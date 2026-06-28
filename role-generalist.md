# Role: Generalist — Verification & Reconciliation Engine

*Read the master plan first. You're a coder, so this is a real engineering slice, not QA. You co-own the engine with the backend dev and you own the thing that lets us PROVE the 35% score: measured accuracy.*

## What you own
Reconcile/dedupe · confidence calibration + flag-routing · the eval harness (recall/precision/mandatory-accuracy) · the shallow answer-draft. Plus you float to whatever's behind.
**You do NOT own:** PDF ingestion/extraction (backend) or the UI (frontend).

## The interface (your contract with the team)
- Backend hands you a **raw extraction list** — requirement objects, possibly with cross-chunk duplicates, raw confidence. Agree this format with backend Day 1.
- You **output** the clean, reconciled, flag-routed list in the master schema (§3) — this is what the API serves and the frontend renders.
- You build against **mock raw-extraction data** Day 1 so you parallelise with backend instead of waiting.

## Day-by-day

**Day 1 — agree the format, sourcing sprint, start reconcile.** With backend + J, lock the raw-extraction intermediate format. Do your share of the **tender sourcing sprint**. Start the **reconcile/dedupe module** against mock raw data: merge requirements that appear across chunk boundaries (same requirement extracted twice), keep the best source reference, combine confidence sensibly.

**Day 2 — gold set + eval harness (the headline-number machine).** Hand-label your assigned tender (everyone labels one). Build the **eval harness**: run backend's extraction across the labelled tenders, score **recall** (did it catch all requirements), **precision** (were the ones it found correct), and **mandatory-accuracy**. This produces the "caught 98%, flagged the rest" number for the demo. Feed misses back to backend. Integrate your reconcile module with backend's real output.

**Day 3 — confidence routing + answer-draft.** Calibrate the confidence threshold (what gets `needs_review: true`) using the gold-set results — tune it so genuine misses get flagged, not buried. Build the **shallow answer-draft**: first-pass `draft_answer` per requirement from 2–3 capability docs (basic RAG or context-stuffing). Keep it deliberately thin.

**Day 4 — break it before the judges do.** Run the eval across many tenders, especially the ugly ones; pair with backend on fixes. Curate the demo tender set (one clean hero + proof it works on messy ones). Lock the headline accuracy number.

**Day 5 — final QA + assembly + float.** Try to break the whole system the way a judge would. Help build the demo video and submission. Jump to whatever role is behind.

## Guardrails
- The **eval is the point** — it's not optional QA, it's how we earn and prove the 35% and get the demo's number. Protect time for it.
- Don't gold-plate the answer-draft. "Good enough first pass." The spotlight is extraction + the catch + control.
- Reconcile conservatively — merging two genuinely-different requirements into one is a silent miss, which is the worst failure. When unsure whether two are the same, keep both and let the human decide.

## Instructions for your AI (paste into Claude Code / Cursor)

> I'm a developer on a 4-person hackathon team building a tool for the Conduct "Make Legacy Move" track that extracts **requirements** from **tenders** (50–150 page procurement PDFs). The backend dev does PDF extraction; **I own the reconciliation, confidence-routing, and evaluation layer** — the part that turns raw extractions into a clean, trustworthy, measured list.
>
> **Stack:** Python (same repo as the FastAPI backend), the [OpenAI/Anthropic/Gemini] API for the answer-draft.
>
> **Inputs/outputs:** I receive a "raw extraction list" of requirement objects (possibly with cross-chunk duplicates and raw confidence) and output the clean reconciled list in this schema: [paste the JSON schema from master plan §3]. I build against mock raw data first.
>
> **Build order:** (1) A **reconcile/dedupe module**: merge requirement objects that are the same requirement extracted from overlapping chunks (fuzzy text match + source proximity), keep the best source_excerpt/source_page, combine confidence. Be conservative — when unsure if two are the same, keep both. (2) An **eval harness**: given a hand-labelled gold set (list of true requirements with mandatory/optional labels) and the tool's output, compute recall, precision, and mandatory-classification accuracy, and print a report of misses. (3) **Confidence routing**: set needs_review=true for requirements below a tuned threshold, calibrated against the gold-set results so real misses get flagged. (4) A **shallow answer-draft**: for each requirement, generate a first-pass draft_answer from 2–3 capability docs via simple RAG — keep it thin.
>
> **Hard rules:** reconcile conservatively (a wrongly-merged requirement is a silent miss — the worst outcome). The eval harness is the priority — it's how we prove accuracy and get our demo number. Don't over-build the answer-draft. Start with the reconcile module over mock data, then the eval harness.
