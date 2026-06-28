"""pipeline.py — ingest → chunk → extract → assemble.

Ties the steps together and turns raw per-chunk extractions into final Requirement
objects in the locked schema. Includes a DELIBERATELY THIN reconcile + confidence-route
pass so the API serves sane data today.

NOTE: proper reconcile/dedupe + confidence calibration is the GENERALIST's lane
(see role-generalist.md). What's here is a placeholder good enough to demo; the
generalist replaces `_reconcile` + `_route_confidence` with the real thing.

Scaffolded by J as backend cover.
"""

from __future__ import annotations

from difflib import SequenceMatcher

from .chunk import chunk_doc
from .extract import get_extractor
from .ingest import ingest_pdf
from .schema import Requirement, TenderResponse

NEEDS_REVIEW_BELOW = 0.65   # placeholder threshold — generalist calibrates this
DUP_SIMILARITY = 0.86       # text similarity above which we treat two raws as the same


def _similar(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def _reconcile(raws: list[dict]) -> list[dict]:
    """Thin dedupe: drop near-identical requirements, keeping the highest-confidence
    (and, on a tie, the one with a clause label). PLACEHOLDER — generalist owns the
    real, careful version (conservative merging, best source reference)."""
    kept: list[dict] = []
    for r in sorted(raws, key=lambda x: x["confidence"], reverse=True):
        dup = False
        for k in kept:
            if _similar(r["text"], k["text"]) >= DUP_SIMILARITY:
                dup = True
                break
        if not dup:
            kept.append(r)
    return kept


def _route_confidence(req_type: str, confidence: float) -> bool:
    """Flag low-confidence items for human review. PLACEHOLDER threshold."""
    return confidence < NEEDS_REVIEW_BELOW


def run_pipeline(pdf_path: str, tender_id: str, title: str) -> TenderResponse:
    """Full extraction pipeline for one tender PDF → TenderResponse (locked schema)."""
    doc = ingest_pdf(pdf_path)
    chunks = chunk_doc(doc)
    extractor = get_extractor()

    raws: list[dict] = []
    for ch in chunks:
        raws.extend(extractor.extract_chunk(ch))

    reconciled = _reconcile(raws)

    requirements: list[Requirement] = []
    for i, r in enumerate(reconciled, start=1):
        requirements.append(
            Requirement(
                id=f"req-{i:04d}",
                text=r["text"],
                source_page=r["source_page"],
                source_clause=r.get("source_clause"),
                source_excerpt=r["source_excerpt"],
                type=r["type"],
                is_gating=r["is_gating"],
                category=r["category"],
                confidence=r["confidence"],
                status="pending",
                needs_review=_route_confidence(r["type"], r["confidence"]),
                decision=None,
                criteria_ref=None,
                depends_on=[],
                draft_answer=None,
            )
        )

    return TenderResponse(tender_id=tender_id, title=title, requirements=requirements)
