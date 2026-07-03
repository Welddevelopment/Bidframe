# Bidframe Features For The Pitch Deck

> Companion to `storyboard.md`. This document decides which product features deserve a main investor slide, which belong in appendix/Q&A, and how to describe them without overclaiming.

## Recommendation

Add **one** feature slide to the main 3-minute deck.

**Slide title:** The trust layer for public-sector tenders

**Slide job:** prove Bidframe is deeper than a pretty compliance matrix, without turning the pitch into a product tour.

Use four blocks:

1. **Deal-breakers first** - pass/fail requirements surface before the bid team wastes days on a doomed response.
2. **Every line links to source** - one click shows the exact sentence and page behind each requirement.
3. **Answers with receipts** - drafts from the bidder's own evidence; if evidence is missing, it asks instead of guessing.
4. **Human-controlled workflow** - the bid manager approves, edits, or flags every requirement, and those decisions become context for the next bid.

Use only two proof marks on this slide:

- Worked example: every disqualifier surfaced, zero dangerous misses.
- Grounded autofill: zero invented answers in the cited-answer check.

Everything else below is useful, but should sit in a backup slide, demo beat, or Q&A answer.

## Main Slide Copy

### Deal-breakers First

**Investor wording:**

> Bidframe finds the red trail markers in the tender: the pass/fail clauses that can disqualify a bid before anyone reads the good parts.

**What it means:**

- Gating requirements are surfaced in the oxblood deal-breaker hero, not buried in the matrix.
- Gating approval requires explicit confirmation.
- Confidence is visual and honest, not a raw score.

**Evidence in product/code:**

- `frontend/src/components/GatingHero.tsx`
- `frontend/src/components/RequirementPanel.tsx`
- `frontend/src/components/ConfidenceIndicator.tsx`
- `engine/gating_scan.py`
- `backend/app/pipeline.py`

### Every Line Links To Source

**Investor wording:**

> Every requirement is checkable. Click a line and Bidframe opens the source sentence, page, and document it came from.

**What it means:**

- Requirements carry page, clause, excerpt, source document, and filename.
- Source verification can open the real PDF beside the requirement.
- Backend can attach PDF highlight coordinates with an `exact` / `approx` / `null` match signal.

**Evidence in product/code:**

- `frontend/src/components/SourceVerifyOverlay.tsx`
- `frontend/src/components/PdfSourceView.tsx`
- `frontend/src/types/requirement.ts`
- `backend/app/schema.py`
- `backend/app/pipeline.py`

### Answers With Receipts

**Investor wording:**

> Bidframe drafts answers only from the bidder's own documents, then shows the evidence behind each claim.

**What it means:**

- `/answers` is a focused response workspace with evidence upload, filters, readiness ledger, and answer cards.
- Capability documents show how many answers they back.
- Open questions become a gap interview instead of a blank page.
- If evidence is missing, the answer state is `needs_input`, not invented prose.

**Evidence in product/code:**

- `frontend/src/components/AnswersBody.tsx`
- `frontend/src/components/AnswerPanel.tsx`
- `frontend/src/components/CapabilityUpload.tsx`
- `frontend/src/components/OpenQuestions.tsx`
- `engine/answer.py`
- `engine/eval_answers.py`
- `backend/app/main.py`

### Human-Controlled Workflow

**Investor wording:**

> The AI does the first read. The bid manager makes the decision.

**What it means:**

- Users approve, edit, flag, or reopen each requirement.
- Bulk approve is deliberately limited to confident, non-gating rows.
- Gating and low-confidence rows force a more careful review.
- Decisions persist and become reusable context.

**Evidence in product/code:**

- `frontend/src/components/MatrixView.tsx`
- `frontend/src/components/BulkActionBar.tsx`
- `frontend/src/components/RequirementPanel.tsx`
- `backend/app/store.py`
- `README.md`
- `demo-narrative.md`

## Power Features To Mention In Demo Or Q&A

### Auditable Extraction Pipeline

**Plain wording:**

> The backend is not one prompt over a PDF. It ingests, chunks, extracts, reconciles duplicates, adds a deterministic deal-breaker safety net, maps structure, and returns a locked response schema.

**Feature details:**

- PDF ingest to page-numbered text.
- Structure-aware overlapping chunks.
- Extractor layer: heuristic fallback, OpenAI path, Claude fallback.
- Reconcile/dedupe with safety guards.
- Deterministic gating safety net.
- Graph enrichment for criteria and dependencies.
- Autofill from capability documents.
- Locked `TenderResponse` schema for frontend/backend alignment.

**Best Q&A use:** "Is this just ChatGPT on PDFs?"

**Evidence:**

- `backend/app/pipeline.py`
- `backend/app/ingest.py`
- `backend/app/chunk.py`
- `backend/app/extract.py`
- `engine/reconcile.py`
- `engine/gating_scan.py`

### Deterministic Deal-Breaker Safety Net

**Plain wording:**

> For the highest-risk clauses, Bidframe does not rely only on the LLM. It also runs a deterministic scan for public-sector disqualifier language and adds low-confidence review items if the model missed one.

**Feature details:**

- Scans for pass/fail, exclusion, deadline, minimum insurance/certification, mandatory return, and similar gate language.
- Adds uncovered gating candidates as `needs_review`.
- Wired into the live pipeline.
- Strongest measured story: it is designed to make missed deal-breakers visible, even when the extractor is imperfect.

**Best Q&A use:** "How do you avoid missing the killer clause?"

**Evidence:**

- `engine/gating_scan.py`
- `backend/app/pipeline.py`
- `comms/board-j.md`

**Caution:** Do not say "guaranteed to catch every possible deal-breaker." Say "we added a deterministic safety net for known public-sector gate patterns, and we measure it against hand-labelled tenders."

### Measured Accuracy And Groundedness

**Plain wording:**

> Bidframe measures what it found against human-labelled tenders. It also checks whether drafted answers actually cite text in the bidder's evidence.

**Feature details:**

- Gold-labelled tender sets drive recall, precision, gating recall, and dangerous-miss reports.
- Eval is deterministic, not LLM-as-judge.
- Groundedness eval flags fabricated citations.
- Current deck should lead with deal-breaker and bluff-prevention proof, not broad overall recall.

**Best Q&A use:** "How do you know the numbers are real?"

**Evidence:**

- `engine/eval.py`
- `engine/eval_answers.py`
- `engine/scripts/eval_all.py`
- `gold-set/eval-manifest.json`
- `STATUS.md`

**Caution:** Avoid broad "98% accurate" style claims. Prefer "on the worked example" and "measured against hand-labelled tenders."

### Layout-Aware PDF Handling

**Plain wording:**

> Tenders are ugly PDFs, not clean web pages. Bidframe preserves page context, handles tables, and has a scanned-page recovery path.

**Feature details:**

- PyMuPDF extraction with sorted reading order.
- pypdf and pdfplumber fallbacks.
- Sparse/table page recovery.
- Optional gpt-4o vision OCR for genuinely scanned pages, capped for cost control.

**Best Q&A use:** "What happens with messy tender PDFs?"

**Evidence:**

- `backend/app/ingest.py`
- `backend/README.md`

### Source Highlight Coordinates

**Plain wording:**

> Bidframe can point back to the actual place in the PDF, not just a vague page number.

**Feature details:**

- Requirements may carry `source_rect` PDF coordinates.
- `source_rect_match` distinguishes exact, approximate, or unavailable matches.
- Frontend falls back gracefully when coordinates are missing.

**Best Q&A use:** "How does the source verification work?"

**Evidence:**

- `backend/app/schema.py`
- `backend/app/pipeline.py`
- `frontend/src/types/requirement.ts`
- `frontend/src/components/PdfSourceView.tsx`

### Multi-File Tender Packs

**Plain wording:**

> Real tenders often arrive as packs, not one PDF. Bidframe keeps each source document separate and preserves provenance.

**Feature details:**

- Upload supports one PDF or a pack of PDFs.
- Requirements carry `source_doc_id` and `source_filename`.
- PDF serving supports specific source docs.
- No cross-document provenance contamination in tested paths.

**Best Q&A use:** "Can it handle real tender packs?"

**Evidence:**

- `backend/app/main.py`
- `backend/app/store.py`
- `frontend/src/components/UploadDropzone.tsx`
- `frontend/src/types/requirement.ts`

### Marks And Structure Graph

**Plain wording:**

> Beyond the checklist, Bidframe shows where the marks live: how requirements connect to award criteria and dependencies.

**Feature details:**

- `/graph` has split, ledger, and map modes.
- Requirements are grouped by award criteria and weighting.
- Deal-breakers stay visually distinct.
- Dependencies show what needs answering in order.

**Best Q&A use:** "What comes after the matrix?"

**Evidence:**

- `frontend/src/components/StructureView.tsx`
- `frontend/src/components/MarksView.tsx`
- `frontend/src/components/GraphView.tsx`

**Caution:** Do not lead the 3-minute pitch with the graph. It is a power feature, not the core wedge.

### Operational Product Readiness

**Plain wording:**

> Bidframe is already shaped like a real product: accounts, saved tenders, background processing, exports, and demo-safe pre-baked data.

**Feature details:**

- Invite-only authentication with JWT sessions.
- Owner-scoped tenders.
- Background upload jobs with progress.
- Reopen previous tenders.
- Export compliance matrix as XLSX/CSV.
- Export response packs as PDF, Word, Markdown, or text.
- Public `/demo` uses a real pre-baked tender so the stage demo is reliable.

**Best Q&A use:** "Is this only a hackathon prototype?"

**Evidence:**

- `backend/app/auth.py`
- `backend/app/main.py`
- `backend/app/store.py`
- `frontend/src/components/TendersList.tsx`
- `frontend/src/components/ExportMenu.tsx`
- `frontend/src/lib/export-matrix-xlsx.ts`
- `frontend/src/app/demo/page.tsx`

## Suggested Feature Slide Layout

Use a forest-map composition, not a dashboard grid.

**Visual concept:** one winding path through four clearings.

1. **Red trail marker:** Deal-breakers first.
2. **Source clearing:** Every line links to source.
3. **Evidence footprints:** Answers with receipts.
4. **Approval stamp:** Human-controlled workflow.

At the bottom, add a small proof ledger:

> Worked example: every disqualifier surfaced · zero dangerous misses · zero invented answers

Keep the exact feature labels short. Let the speaker add detail.

## Appendix Slide Ideas

### Appendix A - Under The Hood

`PDF ingest -> chunk -> extract -> reconcile -> gating safety net -> source links -> autofill -> eval`

Use this if a judge asks whether the system is more than one prompt.

### Appendix B - Product Surface

Show six small screenshots:

- Upload / processing
- Compliance matrix
- Deal-breaker hero
- Source verification
- Answers with evidence
- Marks graph

Use this if there is extra time or a judge wants a tour.

### Appendix C - Proof Ledger

Show the evaluation story:

- Human-labelled answer keys.
- Dangerous misses called out.
- Groundedness checks for citations.
- Caution that the validation set is still growing.

Use this for technical/investor diligence.

## Claims To Avoid

- "We write your bid for you."
- "Fully automated submission."
- "Guaranteed to catch everything."
- "The model is running live" unless it is actually live.
- "Customers" unless there are signed or paying customers.
- "98% accurate" unless the exact benchmark and source are on the slide.

## Best One-Liner

Bidframe is the trust layer for public-sector tenders: it finds the deal-breakers, traces every requirement to source, drafts only from evidence, and leaves the bid manager in control.
