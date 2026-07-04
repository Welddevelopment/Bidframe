# Messy-tender readiness — the credible scale story

> The Conduct rubric explicitly asks for *"a credible scale story — show you've thought about how this
> holds up on something far bigger and messier."* This is that story. Everything below is in the shipped
> `backend/app/ingest.py` + `chunk.py` + `extract.py`; the OCR path was verified end-to-end on 2026-07-04.

## What "messy" means for real tenders, and how we handle each

| Messy reality | How Bidframe handles it | Where |
|---|---|---|
| **Scanned / image-only PDF** (no text layer) | Detect sparse pages, render to image, **OCR via gpt-4o vision**, feed recovered text into the normal pipeline. **Verified:** an image-only page (0-char text layer) → 2674 chars recovered incl. tender keywords. | `ingest._recover_sparse_with_vision` |
| **Requirements hidden in tables / pricing / form pages** | PyMuPDF plain text misses these → **pdfplumber fallback** recovers table cells + sparse-page text and appends them. | `ingest._enrich_with_pdfplumber` |
| **A parser that chokes on this file** | **Multi-parser cascade:** PyMuPDF → pypdf, each guarded; a clear `PDFIngestError` only if all fail. | `ingest.ingest_pdf` |
| **Very long tender (100s of pages)** | Split into overlapping bounded chunks (overlap so a requirement on a boundary isn't lost); per-chunk extraction runs concurrently. | `chunk.chunk_doc`, `EXTRACT_CONCURRENCY` |
| **A page/chunk the model fails on (rate limit, timeout, garbage)** | **Retry with backoff, then skip that chunk and continue** — one bad chunk never crashes the whole run. | `extract.py` (`MAX_RETRIES`) |
| **Repeated header/footer noise on every page** | Lines that repeat across ≥50% of pages are stripped (page numbers survive). | `ingest._strip_headers_footers` |
| **A page we still can't read** | **Flagged, not silently dropped** — the output carries a visible "likely scanned/image-only, may need OCR" marker so nothing disappears without the human knowing. | `ingest._flag_sparse_pages` |

## The guards (why it stays sane at scale)
- **Cost is bounded:** vision-OCR is capped at `MAX_VISION_PAGES = 15` per document (a fully-scanned
  200-page tender won't run up an unbounded bill); extraction passes capped at `MAX_EXTRACT_PASSES = 3`.
- **Fail-open everywhere:** no key → OCR is a no-op (pipeline stays offline-safe, tested); a failed chunk
  → empty + continue; an unparseable file → a clear error, not a hang.
- **Determinism where it matters:** the deal-breaker net is regex/rules (no model), so document size or
  OCR noise can't make it *miss* a disqualifier — it can only over-flag, which the human reviews.

## Honest limits (what we'd do next)
- **Fully-scanned tenders beyond 15 pages:** pages past the cap are flagged, not OCR'd — a cost choice, not
  a capability gap. Next step: a cheaper local OCR (Tesseract) for the bulk + vision only for hard pages.
- **General extraction recall (~0.7)** is the real quality frontier, independent of format — see the README.
- **Enormous tenders (1000+ pages):** chunking handles them, but total API cost/latency scales linearly;
  a pre-filter (only extract from sections likely to contain requirements) is the obvious optimisation.

## Reproduce the OCR verification
`engine/tests/test_ingest_ocr.py` locks the trigger + the no-key no-op deterministically (mocked vision,
no network). The manual end-to-end check: rasterise any tender page into an image-only PDF and run
`backend.app.ingest.ingest_pdf` with `OPENAI_API_KEY` set — the text comes back.
