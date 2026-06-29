"""Sharper gap questions: the OpenAI answerer phrases the gap interview via J's
prompt, but the unblocks-mapping + validation is pure and deterministic, tested here
without any network. The mock path stays the deterministic deduper (unchanged)."""
from __future__ import annotations

from engine.answer import MockAnswerer, _build_gap_questions


GAPS = [
    {"req_id": "r1", "text": "Hold ISO 9001.", "is_gating": True, "missing": "ISO 9001 cert"},
    {"req_id": "r2", "text": "Hold ISO 9001 for sites.", "is_gating": False, "missing": "ISO 9001 cert"},
    {"req_id": "r3", "text": "State turnover.", "is_gating": False, "missing": "annual turnover"},
]


def test_dedup_mapping_and_gating_inference():
    raw = [
        {"id": "q-1", "question": "Do you hold ISO 9001 certification?",
         "unblocks": ["r1", "r2"], "unblocks_gating": True},
        {"id": "q-2", "question": "What is your annual turnover?",
         "unblocks": ["r3"], "unblocks_gating": False},
    ]
    out = _build_gap_questions(raw, GAPS)
    assert len(out) == 2
    assert out[0]["unblocks"] == ["r1", "r2"]
    assert out[0]["unblocks_gating"] is True


def test_invalid_req_ids_are_filtered():
    raw = [{"id": "q-1", "question": "?", "unblocks": ["r1", "ghost"], "unblocks_gating": False}]
    out = _build_gap_questions(raw, GAPS)
    assert out[0]["unblocks"] == ["r1"]
    # r1 is gating in GAPS → gating inferred even if the model said false
    assert out[0]["unblocks_gating"] is True


def test_questions_with_no_valid_unblocks_are_dropped():
    raw = [{"id": "q-1", "question": "?", "unblocks": ["ghost"], "unblocks_gating": False}]
    assert _build_gap_questions(raw, GAPS) == []


def test_mock_deduper_unchanged_and_deterministic():
    # the free path must still collapse the two ISO gaps into one question
    questions = MockAnswerer().dedupe_gaps(GAPS)
    iso = [q for q in questions if "r1" in q["unblocks"]][0]
    assert "r2" in iso["unblocks"]          # shared fact deduped
    assert iso["unblocks_gating"] is True
