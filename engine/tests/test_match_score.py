"""Eval matcher: paraphrase/granularity tolerance without embeddings.

`match_score` should match a gold requirement to a reworded/reordered extraction
of the SAME obligation (which the raw char-ratio scored as a miss), while keeping
genuinely-different requirements apart (no spurious match from one shared word).
"""
from engine.eval import MATCH_THRESHOLD, match_requirements
from engine.similarity import match_score, similarity


def test_matches_reordered_paraphrase_that_char_ratio_misses():
    a = "The supplier must hold ISO 9001 certification"
    b = "Bidders are required to hold certification to the ISO 9001 standard"
    # Same obligation, reworded + reordered: char-ratio alone falls short...
    assert similarity(a, b) < MATCH_THRESHOLD
    # ...but the token-overlap path recognises it.
    assert match_score(a, b) >= MATCH_THRESHOLD


def test_keeps_genuinely_different_requirements_apart():
    a = "The supplier must hold ISO 9001 certification"
    b = "The supplier must demonstrate an annual turnover of at least £2,000,000"
    # No shared content tokens -> the token path never fires -> stays a non-match.
    assert match_score(a, b) < MATCH_THRESHOLD


def test_single_shared_word_cannot_force_a_match():
    # Only "certification" in common (1 token) -> below the >=2 guardrail -> no match.
    a = "The supplier must hold ISO 9001 certification"
    b = "A dedicated account manager certification is preferred"
    assert match_score(a, b) < MATCH_THRESHOLD


def test_match_requirements_now_matches_a_paraphrased_gold():
    gold = {"requirements": [
        {"gold_id": "g1", "text": "The supplier must hold ISO 9001 certification", "source_page": 1},
    ]}
    out = {"requirements": [
        {"id": "r1", "text": "Bidders are required to hold certification to the ISO 9001 standard", "source_page": 1},
    ]}
    matches, unmatched_gold, unmatched_output = match_requirements(gold, out)
    assert [(g["gold_id"], o["id"]) for g, o in matches] == [("g1", "r1")]
    assert not unmatched_gold and not unmatched_output
