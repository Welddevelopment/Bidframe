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
from pathlib import Path

from .chunk import chunk_doc
from .extract import get_extractor
from .graph import build_graph
from .ingest import ingest_pdf
from .schema import Answer, CapabilityDoc, OpenQuestion, Requirement, TenderResponse

# The generalist's real reconcile/dedupe + confidence routing lives in the top-level
# `engine/` package (engine.reconcile). Import it when it's on the path — locally and
# from the repo root, which is the live-demo runtime + what the eval harness uses. The
# Render deploy roots at backend/ (see render.yaml), so engine/ may be absent there;
# fall back to the thin placeholders so production never breaks. To make the real engine
# live on Render too, the deploy needs engine/ on the path (J's lane — see comms G-005).
try:
    from engine.reconcile import (
        group_candidates as _engine_group,
        merge_group as _engine_merge,
        NEEDS_REVIEW_THRESHOLD as _ENGINE_NEEDS_REVIEW,
    )
    _HAVE_ENGINE = True
except ImportError:  # pragma: no cover - deploy without engine/ on path
    _HAVE_ENGINE = False

NEEDS_REVIEW_BELOW = 0.65   # fallback threshold (used only when engine/ isn't importable)
DUP_SIMILARITY = 0.86       # fallback dedupe similarity (placeholder only)

# Auditable autofill (generalist steps 12-13) — engine.answer drafts a grounded answer
# per requirement (or flags needs_input). Same import-safe pattern as reconcile above:
# present when engine/ is on the path (repo-root runtime, after the render.yaml fix in
# G-009); silently skipped otherwise so a backend-rooted deploy never breaks upload.
try:
    import engine as _engine_pkg
    from engine.answer import (
        MockAnswerer as _MockAnswerer,
        draft_all as _engine_draft_all,
        load_capability_docs as _engine_load_caps,
    )
    _HAVE_ANSWER = True
    # The demo bidder's capability library (AcmeClean). Real per-tender docs come via
    # POST /tenders/{id}/draft. Folder lives next to the engine package, so it resolves
    # regardless of cwd.
    DEFAULT_CAPABILITY_DIR = Path(_engine_pkg.__file__).resolve().parent / "fixtures" / "capability"
except ImportError:  # pragma: no cover - deploy without engine/ on path
    _HAVE_ANSWER = False
    DEFAULT_CAPABILITY_DIR = None


def _similar(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def _reconcile(raws: list[dict]) -> list[dict]:
    """Reconcile/dedupe raw extraction candidates into clean requirement dicts.

    Prefers the generalist's conservative engine (engine.reconcile): merge only on a
    high text + token + same-page + same-clause match, noisy-OR confidence, and safety
    escalation so a disqualifier is never downgraded. Falls back to a thin similarity
    dedupe only when engine/ isn't importable (e.g. a backend-rooted deploy)."""
    if _HAVE_ENGINE:
        return [_engine_merge(group) for group in _engine_group(raws)]

    # --- fallback placeholder (engine/ not on path) ---
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
    """Flag low-confidence items for human review (the generalist's needs_review).

    Uses the engine's threshold when available; the placeholder threshold otherwise."""
    threshold = _ENGINE_NEEDS_REVIEW if _HAVE_ENGINE else NEEDS_REVIEW_BELOW
    return confidence < threshold


def _autofill(requirements: list[Requirement], capability_folder=None, answerer=None,
              max_workers: int = 1):
    """Enrich requirements with a grounded `answer` (or an honest `needs_input` gap) drawn
    from the bidder's capability docs, plus the `capability_docs` metadata for the envelope.

    Defaults to the MockAnswerer (deterministic, free, instant — safe to run on every upload
    with no surprise LLM cost/latency); POST /tenders/{id}/draft re-runs with a real answerer
    and `max_workers > 1` so the per-requirement LLM calls run concurrently (snappy demo).
    Import-safe + never raises into the request: if engine.answer isn't on the path, or there
    are no docs, or anything fails, requirements pass through untouched."""
    if not _HAVE_ANSWER:
        return requirements, []
    folder = capability_folder or DEFAULT_CAPABILITY_DIR
    try:
        caps = _engine_load_caps(folder)
        if not caps:
            return requirements, []
        enriched, _questions = _engine_draft_all(
            [r.model_dump() for r in requirements], caps, answerer or _MockAnswerer(),
            max_workers=max_workers,
        )
        by_id = {e["id"]: e for e in enriched}
        for r in requirements:
            e = by_id.get(r.id)
            if not e:
                continue
            r.answer = Answer(**e["answer"]) if e.get("answer") else None
            r.open_questions = [OpenQuestion(**q) for q in e.get("open_questions", [])]
            r.draft_answer = e.get("draft_answer")
        caps_meta = [
            CapabilityDoc(doc_id=d["doc_id"], filename=d["filename"], page_count=1) for d in caps
        ]
        return requirements, caps_meta
    except Exception as exc:  # autofill is additive — never let it break the upload
        print(f"[pipeline] autofill skipped ({exc})")
        return requirements, []


def run_pipeline(pdf_path: str, tender_id: str, title: str) -> TenderResponse:
    """Full extraction pipeline for one tender PDF → TenderResponse (locked schema)."""
    doc = ingest_pdf(pdf_path)
    chunks = chunk_doc(doc)
    extractor = get_extractor()

    raws: list[dict] = []
    for ch in chunks:
        raws.extend(extractor.extract_chunk(ch))

    reconciled = _reconcile(raws)
    full_text = "\n".join(p.text for p in doc.pages)

    requirements: list[Requirement] = []
    for i, r in enumerate(reconciled, start=1):
        requirements.append(
            Requirement(
                # Globally unique (tender-prefixed) so two tenders never collide on
                # the requirements PK and PATCH /requirements/{id} is unambiguous.
                id=f"{tender_id}-r{i:04d}",
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

    # Graph edges: criteria_ref + depends_on (is_gating already set). Conservative.
    build_graph(requirements, full_text)

    # Auditable autofill: grounded answer-draft per requirement (mock answerer = free + instant).
    requirements, capability_docs = _autofill(requirements)

    return TenderResponse(
        tender_id=tender_id, title=title, requirements=requirements,
        capability_docs=capability_docs,
    )
