"""The model precision filter must improve precision without EVER lowering the recall floor:
it may only remove obvious false flags, and any failure must fail OPEN (keep everything)."""
from engine.gating_filter import filter_gating_candidates

CANDS = [
    {"text": "The bid will be rejected if incomplete.", "source_page": 1},        # 0 real gate
    {"text": "Cleaning must be carried out on weekdays.", "source_page": 2},       # 1 scope
    {"text": "Tenders must arrive no later than 12:00.", "source_page": 3},        # 2 real gate
    {"text": "5.3 Clarifications .......... 7", "source_page": 4},                  # 3 TOC junk
]


def test_disabled_returns_everything_unchanged():
    assert filter_gating_candidates(CANDS, enabled=False) == CANDS


def test_drops_only_what_the_classifier_rejects():
    # mock classifier keeps the two real gates (indices 0, 2), drops scope + TOC
    kept = filter_gating_candidates(CANDS, classify=lambda texts: {0, 2}, enabled=True)
    assert [c["source_page"] for c in kept] == [1, 3]
    assert len(kept) == 2


def test_result_is_always_a_subset_in_order():
    kept = filter_gating_candidates(CANDS, classify=lambda texts: {0, 1, 3}, enabled=True)
    # subset, same order, never adds
    assert all(c in CANDS for c in kept)
    assert [CANDS.index(c) for c in kept] == sorted(CANDS.index(c) for c in kept)
    assert len(kept) <= len(CANDS)


def test_classifier_error_keeps_all_recall_safe():
    def boom(texts):
        raise RuntimeError("no key / network down")
    assert filter_gating_candidates(CANDS, classify=boom, enabled=True) == CANDS


def test_empty_keepset_keeps_all_recall_safe():
    # a model that (wrongly) drops everything must NOT empty the gating set — fail open
    assert filter_gating_candidates(CANDS, classify=lambda texts: set(), enabled=True) == CANDS


def test_empty_input_is_fine():
    assert filter_gating_candidates([], classify=lambda texts: {0}, enabled=True) == []


def test_pipeline_wires_the_filter():
    import pytest
    pipeline = pytest.importorskip("backend.app.pipeline")
    assert pipeline._HAVE_GATING_FILTER is True
