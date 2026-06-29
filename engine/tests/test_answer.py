from pathlib import Path

from engine.answer import (
    MockAnswerer, all_passages, draft_all, draft_answer, load_capability_docs, retrieve,
)

REPO_ROOT = Path(__file__).resolve().parents[2]
CAP = REPO_ROOT / "engine" / "fixtures" / "capability"

ISO = {"id": "req-1", "text": "The supplier must hold ISO 9001 certification.", "is_gating": True, "type": "mandatory"}
TURNOVER = {"id": "req-2", "text": "The supplier must demonstrate an annual turnover of at least 2,000,000.", "is_gating": True, "type": "mandatory"}
INSURANCE = {"id": "req-3", "text": "The supplier must hold employer's liability insurance.", "is_gating": True, "type": "mandatory"}


def _docs():
    return load_capability_docs(CAP)


def test_capability_docs_load_into_passages():
    docs = _docs()
    assert {d["doc_id"] for d in docs} >= {"cap-001-company-profile", "cap-002-case-studies", "cap-003-policies"}
    assert len(all_passages(docs)) >= 6


def test_retrieve_finds_iso_evidence():
    ev = retrieve(ISO["text"], all_passages(_docs()))
    assert ev and any("ISO 9001" in p["text"] for p in ev)


def test_mock_grounds_when_evidence_present():
    ev = retrieve(ISO["text"], all_passages(_docs()))
    a = MockAnswerer().draft(ISO, ev)
    assert a["state"] == "auto"
    assert a["evidence_refs"] and a["text"]
    assert a["confidence"] > 0


def test_mock_never_bluffs_without_evidence():
    # THE trust rule: no evidence => needs_input, empty answer, no fabricated evidence.
    a = MockAnswerer().draft(TURNOVER, [])
    assert a["state"] == "needs_input"
    assert a["text"] == ""
    assert a["evidence_refs"] == []
    assert a["missing"]


def test_draft_answer_turnover_has_no_evidence_in_docs():
    # The capability docs never state a turnover figure -> must become a gap, not a bluff.
    a = draft_answer(TURNOVER, all_passages(_docs()), MockAnswerer())
    assert a["state"] == "needs_input"


def test_draft_all_mix_of_auto_and_gaps():
    enriched, questions = draft_all([ISO, TURNOVER, INSURANCE], _docs(), MockAnswerer())
    by_id = {r["id"]: r for r in enriched}
    assert by_id["req-1"]["answer"]["state"] == "auto"        # ISO grounded
    assert by_id["req-3"]["answer"]["state"] == "auto"        # insurance grounded
    assert by_id["req-2"]["answer"]["state"] == "needs_input"  # turnover -> gap
    # the gap interview produced a question that unblocks the turnover requirement
    assert questions and any("req-2" in q["unblocks"] for q in questions)
    # turnover requirement carries the open_question; auto ones don't
    assert by_id["req-2"]["open_questions"]
    assert by_id["req-1"]["open_questions"] == []
    # v1 alias kept in lockstep
    assert by_id["req-1"]["draft_answer"] == by_id["req-1"]["answer"]["text"]


def test_answer_block_matches_frontend_shape():
    enriched, _ = draft_all([ISO], _docs(), MockAnswerer())
    ans = enriched[0]["answer"]
    assert set(ans.keys()) == {"text", "state", "evidence_refs", "confidence"}
    for ref in ans["evidence_refs"]:
        assert set(ref.keys()) == {"doc_id", "excerpt", "page"}
