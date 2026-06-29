"""draft_all parallelism: drafting concurrently must be byte-identical to sequential.

The /draft endpoint runs the per-requirement answerer calls concurrently (they're
I/O-bound LLM calls) to keep the demo snappy. That speed-up must NOT change the
result — same answers, same order, same gap questions — vs the sequential path.
"""
from __future__ import annotations

from engine.answer import MockAnswerer, draft_all


def _caps():
    return [
        {
            "doc_id": "cap-iso",
            "filename": "cap-iso.txt",
            "passages": [
                {"doc_id": "cap-iso", "page": 1,
                 "text": "AcmeClean holds ISO 9001 certification number 12345 issued by BSI."},
                {"doc_id": "cap-iso", "page": 1,
                 "text": "All cleaning staff complete enhanced DBS checks before deployment."},
            ],
        }
    ]


def _reqs(n: int):
    base = [
        "The supplier must hold ISO 9001 certification.",
        "All cleaning staff must hold enhanced DBS checks.",
        "The supplier must operate a fleet of electric vehicles.",
        "Tenders must be submitted before the published deadline.",
    ]
    return [
        {"id": f"r{i:04d}", "text": base[i % len(base)], "type": "mandatory",
         "is_gating": i % 3 == 0}
        for i in range(n)
    ]


def test_parallel_matches_sequential():
    caps, reqs = _caps(), _reqs(12)
    seq_reqs, seq_q = draft_all(reqs, caps, MockAnswerer(), max_workers=1)
    par_reqs, par_q = draft_all(reqs, caps, MockAnswerer(), max_workers=4)

    assert [r["id"] for r in par_reqs] == [r["id"] for r in seq_reqs]  # order preserved
    assert [r["answer"] for r in par_reqs] == [r["answer"] for r in seq_reqs]
    assert [r["open_questions"] for r in par_reqs] == [r["open_questions"] for r in seq_reqs]
    assert par_q == seq_q


def test_default_is_sequential_and_unchanged():
    # default max_workers must keep the existing single-threaded behaviour
    caps, reqs = _caps(), _reqs(5)
    a, qa = draft_all(reqs, caps, MockAnswerer())
    b, qb = draft_all(reqs, caps, MockAnswerer(), max_workers=1)
    assert [r["answer"] for r in a] == [r["answer"] for r in b]
    assert qa == qb
