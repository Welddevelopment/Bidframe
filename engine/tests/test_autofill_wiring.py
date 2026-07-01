"""Integration: auditable autofill is wired into the live API (generalist lane).

Pins MY wiring of engine.answer into backend/app: run_pipeline enriches each
requirement with a grounded answer (or an honest needs_input gap), GET returns it,
and POST /tenders/{id}/draft re-drafts + persists. Mock answerer only — no network.
"""
from __future__ import annotations

from pathlib import Path

import pytest

# This integration test bridges into the FastAPI backend (backend.app.main → .auth → PyJWT, plus
# fastapi). In a pure-engine checkout without the backend deps installed, skip rather than abort
# collection, so `pytest engine/tests/` stays green on the engine alone. No-op when backend is present.
pytest.importorskip("fastapi")
pytest.importorskip("jwt")  # PyJWT, pulled in by backend.app.main via .auth (J-042 auth)

from fastapi.testclient import TestClient

from backend.app import main as api
from backend.app import pipeline, store
from backend.app.schema import Requirement, TenderResponse


def _req(rid: str, text: str, is_gating: bool = False) -> Requirement:
    return Requirement(
        id=rid, text=text, source_page=1, source_clause="1.1", source_excerpt=text,
        type="mandatory", is_gating=is_gating, category="general", confidence=0.9,
    )


# --------------------------------------------------------------------------- #
# pipeline._autofill — the enrichment unit
# --------------------------------------------------------------------------- #
def test_autofill_is_wired_in():
    assert pipeline._HAVE_ANSWER is True


def test_autofill_grounds_or_flags(tmp_path):
    caps = tmp_path / "capability"
    caps.mkdir()
    (caps / "cap-iso.txt").write_text(
        "AcmeClean Ltd holds ISO 9001 certification, certificate number 12345, "
        "issued by BSI and valid through 2027.",
        encoding="utf-8",
    )
    reqs = [
        _req("t-r0001", "The supplier must hold ISO 9001 certification.", is_gating=True),
        _req("t-r0002", "The supplier must operate a fleet of electric delivery vehicles."),
    ]
    enriched, caps_meta = pipeline._autofill(reqs, capability_folder=str(caps))
    by_id = {r.id: r for r in enriched}

    # grounded where evidence overlaps — cites the capability doc, never bluffs
    grounded = by_id["t-r0001"].answer
    assert grounded is not None and grounded.state == "auto"
    assert grounded.evidence_refs and grounded.evidence_refs[0].doc_id == "cap-iso"
    assert by_id["t-r0001"].draft_answer  # deprecated alias stays populated

    # honest gap where there is no evidence
    gap = by_id["t-r0002"].answer
    assert gap is not None and gap.state == "needs_input" and not gap.evidence_refs
    assert by_id["t-r0002"].open_questions  # raised a question for the human

    # capability docs surfaced on the response envelope
    assert any(c.doc_id == "cap-iso" for c in caps_meta)


def test_autofill_is_safe_when_no_docs(tmp_path):
    empty = tmp_path / "empty"
    empty.mkdir()
    reqs = [_req("t-r0001", "Some requirement.")]
    enriched, caps_meta = pipeline._autofill(reqs, capability_folder=str(empty))
    assert caps_meta == []
    assert enriched[0].id == "t-r0001"  # requirements pass through untouched, no crash


# --------------------------------------------------------------------------- #
# The live API — upload-shaped tender round-trips answers; /draft enriches
# --------------------------------------------------------------------------- #
@pytest.fixture
def client(tmp_path, monkeypatch):
    db = tmp_path / "test.db"
    monkeypatch.setattr(store, "_db_path", lambda: db)
    store.init_db()
    # Invite-only auth (J-042): every /tenders endpoint needs a bearer token and is
    # owner-scoped. Create a user, sign in, default the auth header on the client, and
    # return the owner id so saved tenders belong to the signed-in user.
    from backend.app import admin
    admin._create_user("test@bidframe.co.uk", "testpw123456")
    c = TestClient(api.app)
    tok = c.post("/auth/login",
                 json={"email": "test@bidframe.co.uk", "password": "testpw123456"}).json()["token"]
    c.headers.update({"Authorization": f"Bearer {tok}"})
    owner = store.get_user_by_email("test@bidframe.co.uk")["id"]
    return c, owner


def test_get_round_trips_answers_and_caps(client):
    """A tender saved with enriched requirements comes back through GET with answers."""
    c, owner = client
    tid = "tnd-rt"
    reqs = [_req(f"{tid}-r0001", "The supplier must hold ISO 9001 certification.")]
    enriched, caps = pipeline._autofill(reqs)  # default fixture bidder
    store.save_tender(TenderResponse(tender_id=tid, title="RT", requirements=enriched,
                                     capability_docs=caps), filename="rt.pdf", owner=owner)

    r = c.get(f"/tenders/{tid}/requirements")
    assert r.status_code == 200
    body = r.json()
    assert body["requirements"][0]["answer"] is not None
    assert body["capability_docs"]  # persisted + returned


def test_draft_endpoint_enriches_and_persists(client):
    """POST /draft on a bare tender fills in answers and persists them (mock provider)."""
    c, owner = client
    tid = "tnd-draft"
    bare = [_req(f"{tid}-r0001", "The supplier must hold ISO 9001 certification.", is_gating=True)]
    store.save_tender(TenderResponse(tender_id=tid, title="Draft", requirements=bare),
                      filename="draft.pdf", owner=owner)

    # before: no answer
    assert c.get(f"/tenders/{tid}/requirements").json()["requirements"][0]["answer"] is None

    resp = c.post(f"/tenders/{tid}/draft", params={"provider": "mock"})
    assert resp.status_code == 200
    drafted = resp.json()
    assert drafted["requirements"][0]["answer"] is not None
    assert drafted["capability_docs"]

    # persisted: a subsequent GET still has the answer + title/filename intact
    after = c.get(f"/tenders/{tid}/requirements").json()
    assert after["requirements"][0]["answer"] is not None
    assert after["title"] == "Draft"


def test_draft_endpoint_404_on_unknown_tender(client):
    c, _owner = client
    assert c.post("/tenders/nope/draft", params={"provider": "mock"}).status_code == 404


def test_draft_endpoint_limit_drafts_gating_first(client):
    """?limit=1 drafts only the most important (gating) requirement; the rest stay bare."""
    c, owner = client
    tid = "tnd-limit"
    reqs = [
        _req(f"{tid}-r0001", "An optional nicety the bidder may provide."),
        _req(f"{tid}-r0002", "The supplier must hold ISO 9001 certification.", is_gating=True),
    ]
    store.save_tender(TenderResponse(tender_id=tid, title="Limit", requirements=reqs),
                      filename="limit.pdf", owner=owner)

    resp = c.post(f"/tenders/{tid}/draft", params={"provider": "mock", "limit": 1})
    assert resp.status_code == 200
    by_id = {r["id"]: r for r in resp.json()["requirements"]}
    assert by_id[f"{tid}-r0002"]["answer"] is not None   # gating one drafted
    assert by_id[f"{tid}-r0001"]["answer"] is None        # non-gating left untouched by the cap
