"""Robustness against real extractor output (regression for the SPSO run).

Real extractors (backend HeuristicExtractor/LLM) emit char_start/char_end = None
when an excerpt can't be located in the chunk. The mock fixtures never did, so
assign_ids' sort blew up on None. These pin the tolerance.
"""
from engine.reconcile import reconcile


def _raw(raw_id, text, page, char_start):
    return {
        "raw_id": raw_id, "chunk_id": "c1", "text": text,
        "source_page": page, "source_clause": None, "source_excerpt": text,
        "type": "mandatory", "is_gating": False, "category": "other",
        "confidence": 0.6, "char_start": char_start, "char_end": None,
        "extractor_notes": None,
    }


def test_reconcile_tolerates_null_char_start():
    env = {
        "tender_id": "t", "title": "T",
        "raw_requirements": [
            _raw("raw-c1-0", "The supplier must provide a cleaning rota.", 3, None),
            _raw("raw-c1-1", "The supplier must keep COSHH manuals on site.", 4, 12),
        ],
    }
    final, report = reconcile(env)
    assert len(final["requirements"]) == 2
    assert [r["id"] for r in final["requirements"]] == ["req-0001", "req-0002"]
    assert report["final_count"] == 2


def test_reconcile_tolerates_null_source_page():
    env = {
        "tender_id": "t", "title": "T",
        "raw_requirements": [
            _raw("raw-c1-0", "Bidders must hold employer's liability insurance.", None, None),
            _raw("raw-c1-1", "The supplier must provide two references.", 2, 5),
        ],
    }
    final, _ = reconcile(env)
    # null-page item sorts last; no crash
    assert len(final["requirements"]) == 2
    assert final["requirements"][0]["source_page"] == 2
