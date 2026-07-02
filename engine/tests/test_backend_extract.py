"""Regression tests for backend/app/extract.py — the Day-4 accuracy pass (P).

Pins the behaviour of the extraction tuning so a later refactor can't silently
regress it: soft-wrap reflow, the NOT-a-requirement filter, precise gating signals,
the added mandatory-recall verbs, whitespace-flexible page location, and the
multi-pass union's default no-op. Uses the key-free HeuristicExtractor only.

Bridges into the backend package; skipped in a pure-engine checkout.
"""
import os

import pytest

extract = pytest.importorskip("backend.app.extract")
chunk_mod = pytest.importorskip("backend.app.chunk")

Chunk = chunk_mod.Chunk


def _chunk(text: str) -> "Chunk":
    return Chunk(id="c001", text=text, page_start=1, page_end=1, page_map=[(0, 1)])


# ---- soft-wrap reflow (kills mid-sentence fragment "rules") -------------------

def test_soft_wrap_joins_midsentence_newline():
    # lowercase/comma before + lowercase/open-paren after = a wrap, join to a space
    assert extract._SOFT_WRAP.sub(" ", "provide\nall") == "provide all"


def test_soft_wrap_keeps_sentence_boundary():
    # a capitalised next line is a new clause/heading — must NOT be joined
    assert "\n" in extract._SOFT_WRAP.sub(" ", "equipment.\nThe Contractor")


def test_reflow_yields_whole_requirement_not_fragments():
    ch = _chunk("The Tenderer shall provide\nall necessary equipment for the works.")
    reqs = extract.HeuristicExtractor().extract_chunk(ch)
    assert len(reqs) == 1
    assert "provide all necessary equipment" in reqs[0]["text"].lower()


# ---- NOT-a-requirement filter -----------------------------------------------

def test_reject_continuation_fragment():
    # begins lowercase -> a leftover mid-sentence fragment, not an obligation
    assert extract._looks_like_requirement(
        "as to the accuracy of the information stated in the Tender which shall") is False


def test_reject_buyer_side_opener():
    assert extract._looks_like_requirement(
        "The Authority will select the preferred bidder at its discretion.") is False


def test_reject_dangling_tail_fragment():
    assert extract._looks_like_requirement(
        "The Contractor shall provide the following equipment and") is False


def test_accept_real_obligation():
    assert extract._looks_like_requirement(
        "The Contractor shall provide clean, presentable uniforms for staff.") is True


# ---- gating precision (no bare "minimum"/"failure to") ----------------------

def test_minimum_standard_is_not_gating():
    assert extract._is_gating(
        "The minimum standard of cleanliness must be maintained daily.", "mandatory") is False


def test_explicit_disqualifier_is_gating():
    assert extract._is_gating(
        "A late tender will not be considered.", "mandatory") is True


def test_exclusion_phrase_is_gating():
    assert extract._is_gating(
        "Non-compliant bids will result in exclusion from the process.", "mandatory") is True


# ---- mandatory-recall verbs --------------------------------------------------

def test_responsible_for_classifies_mandatory():
    assert extract._classify_type("The Contractor is responsible for pest control.") == "mandatory"


def test_will_provide_classifies_mandatory():
    assert extract._classify_type("The Contractor will provide six air-care units.") == "mandatory"


# ---- whitespace-flexible page location (survives reflow offset shift) --------

def test_find_in_original_tolerates_wrap_whitespace():
    haystack = "intro. The  Contractor\nshall provide staff. end."
    idx = extract._find_in_original(haystack, "The Contractor shall provide staff")
    assert idx == haystack.index("The  Contractor")


def test_find_in_original_returns_minus_one_when_absent():
    assert extract._find_in_original("nothing relevant here", "a totally different sentence") == -1


# ---- multi-pass union: default is an exact no-op -----------------------------

def test_extract_chunk_multi_default_is_noop(monkeypatch):
    monkeypatch.delenv("EXTRACT_PASSES", raising=False)
    ch = _chunk("The Contractor shall provide staff. Records must be kept on site.")
    ex = extract.HeuristicExtractor()
    assert extract.extract_chunk_multi(ex, ch) == ex.extract_chunk(ch)


def test_extract_chunk_multi_noop_for_heuristic_even_when_passes_set(monkeypatch):
    # extra passes are OpenAI-only; the heuristic must never be run N times
    monkeypatch.setenv("EXTRACT_PASSES", "3")
    ch = _chunk("The Contractor shall provide staff.")
    ex = extract.HeuristicExtractor()
    assert extract.extract_chunk_multi(ex, ch) == ex.extract_chunk(ch)


# ---- determinism knobs are present ------------------------------------------

def test_extract_seed_is_fixed():
    assert isinstance(extract.EXTRACT_SEED, int)
