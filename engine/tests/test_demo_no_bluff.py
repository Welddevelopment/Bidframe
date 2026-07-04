"""Regression lock for the SECOND headline trust claim: the demo never bluffs.

The stage tenders are frozen fixtures (`frontend/src/data/*-prebake.json`). This asserts the
evidence-first invariant over the exact data judges see: every DRAFTED answer (`state` auto /
human_edited) carries at least one non-empty evidence citation, and where there is no evidence the
answer is `empty` / `needs_input` — the product asks instead of inventing. Mirrors the deterministic
deal-breaker floor in `test_net_floor.py`; together they lock both trust claims.

Asserts the invariant (0 uncited drafts), not brittle exact counts, so it survives a re-bake."""
from __future__ import annotations

import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DATA = REPO_ROOT / "frontend" / "src" / "data"
FIXTURES = ["bradwell-prebake.json", "spso-prebake.json", "nhs-prebake.json"]

DRAFTED = {"auto", "human_edited"}  # a claim was made → it MUST be backed
NO_CLAIM = {"empty", "needs_input", None}  # no claim → no citation required


def _reqs(fixture: str) -> list[dict]:
    data = json.loads((DATA / fixture).read_text(encoding="utf-8"))
    return data.get("requirements", [])


def test_every_drafted_answer_is_cited():
    """No bluff: a drafted answer without a real citation is a fabrication — there must be none."""
    total_drafted = 0
    for fixture in FIXTURES:
        for r in _reqs(fixture):
            ans = r.get("answer") or {}
            state = ans.get("state")
            if state in DRAFTED:
                total_drafted += 1
                refs = ans.get("evidence_refs") or []
                assert refs, f"{fixture} {r.get('id')}: drafted ({state}) but NO evidence_refs — a bluff"
                assert any((ref.get("excerpt") or "").strip() for ref in refs), (
                    f"{fixture} {r.get('id')}: drafted but every citation excerpt is empty"
                )
    # not vacuous — the demo does show drafted, cited answers
    assert total_drafted > 0, "no drafted answers found across fixtures — fixtures missing?"


def test_uncited_requirements_make_no_claim():
    """Where there is no evidence, the state is empty/needs_input — it asks, never a silent auto answer."""
    for fixture in FIXTURES:
        for r in _reqs(fixture):
            ans = r.get("answer") or {}
            if not (ans.get("evidence_refs") or []):
                assert ans.get("state") in NO_CLAIM, (
                    f"{fixture} {r.get('id')}: no evidence but state={ans.get('state')!r} — should ask, not claim"
                )
