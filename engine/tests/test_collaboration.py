"""Collaboration (J covering — spans backend lanes): shared-tender access + attributed decisions.

Two accounts on ONE tender: the owner shares by email, the member can read + decide, a non-member is
404-walled, and every decision is stamped server-side with WHO made it (un-forgeable). Skipped in a
pure-engine checkout without backend deps (importorskip), like the other FastAPI tests.
"""
from __future__ import annotations

from pathlib import Path

import pytest

pytest.importorskip("fastapi")
pytest.importorskip("jwt")

from fastapi.testclient import TestClient

from backend.app import admin, main as api, store

REPO_ROOT = Path(__file__).resolve().parents[2]
DOCX_FIXTURE = REPO_ROOT / "fixtures" / "mixed-pack" / "sample-return-forms.docx"

_DECISION = {"status": "accepted",
             "decision": {"action": "approve", "note": "", "timestamp": "2026-07-04T18:00:00Z"}}


def _client(email: str) -> TestClient:
    c = TestClient(api.app)
    tok = c.post("/auth/login", json={"email": email, "password": "testpw123456"}).json()["token"]
    c.headers.update({"Authorization": f"Bearer {tok}"})
    return c


@pytest.fixture
def team(tmp_path, monkeypatch):
    """Owner + member + outsider on a shared DB; owner has uploaded one tender. Returns
    (owner, member, outsider, tender_id, a_requirement_id)."""
    pytest.importorskip("docx")
    db = tmp_path / "collab.db"
    monkeypatch.setattr(store, "_db_path", lambda: db)
    store.init_db()
    admin._create_user("owner@bidframe.co.uk", "testpw123456", "Olivia Owner")
    admin._create_user("member@bidframe.co.uk", "testpw123456", "Marcus Member")
    admin._create_user("outsider@bidframe.co.uk", "testpw123456")
    owner, member, outsider = _client("owner@bidframe.co.uk"), _client("member@bidframe.co.uk"), _client("outsider@bidframe.co.uk")
    with DOCX_FIXTURE.open("rb") as fh:
        r = owner.post("/tenders/upload",
                       files=[("files", (DOCX_FIXTURE.name, fh, "application/octet-stream"))],
                       params={"sync": "1"})
    assert r.status_code == 200, r.text
    tender_id = r.json()["tender_id"]
    reqs = owner.get(f"/tenders/{tender_id}/requirements").json()["requirements"]
    assert reqs, "fixture upload produced no requirements to decide on"
    return owner, member, outsider, tender_id, reqs[0]["id"]


def test_member_gains_access_only_after_share_outsider_never(team):
    owner, member, outsider, tid, _ = team
    assert member.get(f"/tenders/{tid}/requirements").status_code == 404      # walled before share
    assert owner.post(f"/tenders/{tid}/share", json={"email": "member@bidframe.co.uk"}).status_code == 200
    assert member.get(f"/tenders/{tid}/requirements").status_code == 200      # shared in
    assert outsider.get(f"/tenders/{tid}/requirements").status_code == 404    # still walled


def test_shared_tender_shows_in_members_tender_list(team):
    owner, member, _outsider, tid, _ = team
    owner.post(f"/tenders/{tid}/share", json={"email": "member@bidframe.co.uk"})
    assert tid in member.get("/tenders").text                                 # appears in "my tenders"


def test_member_decision_is_stamped_with_their_identity(team):
    owner, member, _outsider, tid, rid = team
    owner.post(f"/tenders/{tid}/share", json={"email": "member@bidframe.co.uk"})
    r = member.patch(f"/requirements/{rid}", json=_DECISION)
    assert r.status_code == 200, r.text
    actor = r.json()["decision"]["actor"]
    assert actor["email"] == "member@bidframe.co.uk" and actor["name"] == "Marcus Member"


def test_activity_log_keeps_every_decision_event_newest_first(team):
    owner, member, _outsider, tid, rid = team
    owner.post(f"/tenders/{tid}/share", json={"email": "member@bidframe.co.uk"})

    first = {"status": "flagged",
             "decision": {"action": "edit", "note": "Owner spotted a gap",
                          "timestamp": "2026-07-04T18:00:00Z"}}
    second = {"status": "accepted",
              "decision": {"action": "approve", "note": "Member cleared it",
                           "timestamp": "2026-07-04T18:05:00Z"}}
    assert owner.patch(f"/requirements/{rid}", json=first).status_code == 200
    assert member.patch(f"/requirements/{rid}", json=second).status_code == 200

    events = owner.get(f"/tenders/{tid}/activity").json()["events"]
    assert [e["action"] for e in events[:2]] == ["approve", "edit"]
    assert events[0]["actor"]["email"] == "member@bidframe.co.uk"
    assert events[1]["actor"]["email"] == "owner@bidframe.co.uk"
    assert events[1]["note"] == "Owner spotted a gap"

    row = owner.get(f"/tenders/{tid}/requirements").json()["requirements"][0]
    assert row["decision"]["action"] == "approve"  # current row still last-write-wins


def test_activity_log_is_member_scoped(team):
    owner, member, outsider, tid, rid = team
    assert outsider.get(f"/tenders/{tid}/activity").status_code == 404
    owner.post(f"/tenders/{tid}/share", json={"email": "member@bidframe.co.uk"})
    owner.patch(f"/requirements/{rid}", json=_DECISION)
    assert member.get(f"/tenders/{tid}/activity").status_code == 200
    assert outsider.get(f"/tenders/{tid}/activity").status_code == 404


def test_outsider_cannot_decide(team):
    _owner, _member, outsider, _tid, rid = team
    assert outsider.patch(f"/requirements/{rid}", json=_DECISION).status_code == 404


def test_actor_is_not_forgeable(team):
    """A client sending its own actor is overwritten by the server's authenticated identity."""
    owner, _member, _outsider, _tid, rid = team
    forged = {"status": "accepted",
              "decision": {"action": "approve", "note": "", "timestamp": "2026-07-04T18:00:00Z",
                           "actor": {"id": "usr-hacker", "email": "evil@example.com", "name": "Not Me"}}}
    actor = owner.patch(f"/requirements/{rid}", json=forged).json()["decision"]["actor"]
    assert actor["email"] == "owner@bidframe.co.uk"     # server stamped the real user, not the forgery


def test_share_requires_owner_and_a_real_account(team):
    owner, member, _outsider, tid, _ = team
    assert owner.post(f"/tenders/{tid}/share", json={"email": "nobody@nowhere.co"}).status_code == 404  # no account
    owner.post(f"/tenders/{tid}/share", json={"email": "member@bidframe.co.uk"})
    # a member (not the owner) cannot re-share
    assert member.post(f"/tenders/{tid}/share", json={"email": "outsider@bidframe.co.uk"}).status_code == 404


def test_owner_can_remove_member_and_member_loses_access(team):
    owner, member, _outsider, tid, _ = team
    owner.post(f"/tenders/{tid}/share", json={"email": "member@bidframe.co.uk"})
    assert member.get(f"/tenders/{tid}/requirements").status_code == 200

    r = owner.request("DELETE", f"/tenders/{tid}/share", json={"email": "member@bidframe.co.uk"})
    assert r.status_code == 200, r.text
    assert [m["email"] for m in r.json()["members"]] == ["owner@bidframe.co.uk"]
    assert member.get(f"/tenders/{tid}/requirements").status_code == 404


def test_only_owner_can_remove_members(team):
    owner, member, _outsider, tid, _ = team
    owner.post(f"/tenders/{tid}/share", json={"email": "member@bidframe.co.uk"})
    r = member.request("DELETE", f"/tenders/{tid}/share", json={"email": "owner@bidframe.co.uk"})
    assert r.status_code == 404
