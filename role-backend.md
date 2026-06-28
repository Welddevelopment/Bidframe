# Role: Backend Dev — the Extraction Engine

*Read the master plan first. This is your detailed brief. You own the spine: getting a messy tender PDF into clean, structured, source-grounded requirement objects, and serving them.*

## What you own
Ingest · chunk · extract · classify · build graph relationships · persistence · the REST API.
**You do NOT own:** reconcile/dedupe, confidence-routing, the eval harness (generalist), or the UI (frontend).

## The interface (your contract with the team)
- You **output** requirement objects in the exact schema in §3 of the master plan.
- You hand the generalist a **raw extraction list** (requirement objects, possibly with cross-chunk duplicates, raw confidence) — agree this intermediate format with them Day 1 so they build reconcile against mock data in parallel.
- Frontend reads your REST API. Give them a mock endpoint Day 1 returning sample requirement objects so they're never blocked.

## Day-by-day

**Day 1 — spike, don't architect.** Take one real tender (from the sourcing sprint). Get PyMuPDF → text + accurate page numbers. One LLM call → rough requirement JSON. Goal: find the failure modes *today* (tables, multi-column, headers/footers polluting text). Lock the JSON schema + the raw-extraction intermediate format with generalist + J. Stand up a FastAPI skeleton with a mock `/requirements` endpoint for frontend.

**Day 2 — real, reliable extraction on clean tenders.** Chunking (structure-aware, overlapping). Per-chunk LLM extraction → structured objects with correct `source_page` and `source_excerpt`. Mandatory/optional + gating classifier (anchor on "shall/must/mandatory/pass-fail"). Emit raw confidence. Hand real raw-extraction output to generalist; wire your API to serve reconciled results.

**Day 3 — relationships + persistence.** Build graph edges: `criteria_ref` (map requirements to scoring criteria), `depends_on` (dependencies), `is_gating`. SQLite persistence for requirements + decisions. API endpoints: upload tender, get requirements, update a requirement's decision/status.

**Day 4 — hardening (your biggest day; this is the 35%).** Run on the ugly tenders. Fix what breaks. Graceful degradation: a weird PDF must produce flagged-uncertain output, never a crash. Pair with generalist on the gold-set misses. Make extraction fast enough to feel live.

**Day 5 — lock it.** No new features. Demo-path bugs only. Support "judge uploads a fresh tender." Help rehearse.

## Guardrails
- **Accurate `source_page`/`source_excerpt` is sacred** — it's what makes everything verifiable. If grounding is wrong, the whole product is untrustworthy.
- Chase **never-confidently-wrong**, not 100% recall. Low confidence → emit it, let the generalist's routing flag it.
- Don't dump the whole tender in one prompt. Chunk. (This is the difference between us and a wrapper.)
- Keep the graph edges meaningful (source, gating, criterion, real dependencies) — don't invent edges.

## Instructions for your AI (paste into Claude Code / Cursor)

> I'm the backend dev on a 4-person hackathon team building a tool for the Conduct "Make Legacy Move" track. We ingest a UK public-sector **tender** (a 50–150 page procurement PDF), extract every **requirement**, classify mandatory vs optional, flag "gating" requirements that would disqualify a bid if missed, and ground each requirement to its exact source page/clause. A human bid manager then reviews and approves each.
>
> **My module:** PDF ingestion → structure-aware chunking → LLM extraction to structured JSON → classification → graph relationships → SQLite persistence → FastAPI REST API. I do NOT build the reconcile/dedupe layer, the eval harness, or the frontend.
>
> **Stack:** Python, FastAPI, PyMuPDF (fitz) for PDF (pdfplumber fallback for tables), SQLite, and the [OpenAI/Anthropic/Gemini] API with structured output via JSON-schema/function-calling. Windows/PowerShell, VS Code.
>
> **The requirement object schema** every output must match: [paste the JSON schema from master plan §3].
>
> **Build order:** (1) PDF → text with accurate page numbers, tested on a real tender I'll give you — show me where it breaks on tables/multi-column first. (2) Structure-aware overlapping chunker. (3) Per-chunk extraction returning the schema with correct source_page and source_excerpt. (4) Mandatory/optional + gating classifier with a raw confidence score. (5) FastAPI endpoints: upload tender, get requirements, update a requirement's decision. (6) SQLite persistence. (7) graph edges: criteria_ref, depends_on, is_gating.
>
> **Hard rules:** never put the whole document in one prompt — always chunk. source_page and source_excerpt must be exact. Enforce structured output, never free text. When extraction confidence is low, emit the low score (don't hide it) — another module decides what to flag. Build for graceful failure on messy PDFs (flagged-uncertain output, never a crash). Start by asking me for a sample tender and writing the ingestion spike before anything else.
