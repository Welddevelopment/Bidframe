# Mixed-Pack Ingestion Sprint - Backend Lane

Owner: Backend
Timebox: 6-8 hours inside the 16-hour sprint
Goal: make the live API accept a tender pack containing PDF, DOCX, XLSX and CSV files, then feed all readable text into the existing extraction pipeline without changing the locked requirement schema.

## Why This Lane Exists

PDF-only is demo-safe, but real tender packs are mixed. The main ITT may be a PDF while the scored questions, pricing schedule, compliance checklist or return forms arrive as Word and Excel files. Missing those files weakens Bidframe's central promise: no silent deal-breaker miss.

This lane should make Bidframe read the whole pack, not build a full Microsoft integration.

## Non-Goals

- No SharePoint, OneDrive, Microsoft Graph, portal login or live sync.
- No locked-schema change unless the team explicitly approves it.
- No rich Office preview in this lane.
- No attempt to perfectly preserve Word or Excel formatting.

## Implementation Shape

Keep `run_pipeline_multi` as the main entry point, but stop assuming every `docs` item is a PDF.

Current path:

- `backend/app/main.py` rejects non-PDF files before storage.
- `backend/app/pipeline.py` calls `ingest_pdf(path)` for every document.
- `backend/app/ingest.py` returns `IngestedDoc(filename, pages)`.

Target path:

- `main.py` accepts `.pdf`, `.docx`, `.xlsx`, `.csv` and optionally `.zip`.
- Stored files keep their original extension: `d1.pdf`, `d2.docx`, `d3.xlsx`.
- New dispatcher: `ingest_document(path) -> IngestedDoc`.
- Existing `chunk_doc`, extractor, reconcile, safety-net, graph and autofill continue unchanged.

## Source Mapping Without Schema Changes

Use the existing fields:

- `source_filename`: original uploaded filename.
- `source_doc_id`: `d1`, `d2`, etc.
- `source_page`: for PDF, real page. For DOCX/CSV, use `1`. For XLSX, use the sheet index if useful.
- `source_clause`: encode the human locator:
  - PDF: existing clause heading.
  - DOCX: `DOCX: <heading> / paragraph 12` or `DOCX: table 3 row 4`.
  - XLSX: `XLSX: Pricing!A12:F20` or `XLSX: Sheet 'Pricing' rows 12-18`.
  - CSV: `CSV: rows 12-18`.
- `source_excerpt`: the exact paragraph, table row or cell-row text.
- `source_rect`: leave `null` for non-PDF files.
- `source_rect_match`: leave `null` for non-PDF files.

This keeps the current frontend and API contract alive. A later cleanup can add a first-class `source_locator` field.

## Tasks

1. Add parser dependencies if needed:
   - Preferred: `python-docx`, `openpyxl`.
   - Optional for legacy `.xls`: `xlrd`.
   - CSV can use stdlib.

2. Add `backend/app/ingest_office.py`:
   - `ingest_docx(path)`: extract headings, paragraphs and tables in document order.
   - `ingest_xlsx(path)`: extract every non-empty sheet row, preserving sheet name and row number.
   - `ingest_csv(path)`: extract non-empty rows with row numbers.
   - Each function returns the same `IngestedDoc` and `Page` objects used by PDFs.

3. Add `backend/app/ingest_pack.py` or a dispatcher in `ingest.py`:
   - `ingest_document(path)` chooses parser by extension.
   - Unsupported files raise a clear parse error.
   - Errors include the filename and format.

4. Update `backend/app/main.py` upload validation:
   - Accept `.pdf`, `.docx`, `.xlsx`, `.csv`.
   - Accept `.zip` only if time allows. If included, safely unpack only supported files, reject path traversal, cap total size.
   - Keep per-file and pack-size limits.

5. Update `run_pipeline_multi` docs/comments:
   - Replace "one or more PDFs" with "one or more tender documents".
   - Call `ingest_document(path)` instead of `ingest_pdf(path)`.
   - Keep PDF `source_rect` attachment guarded so it only runs for PDF docs.

6. Add focused backend tests:
   - Upload rejects unsupported `.png`.
   - Upload accepts one PDF plus one DOCX or XLSX fixture.
   - `source_docs` lists every uploaded file.
   - A DOCX paragraph requirement carries `source_filename` and a DOCX locator in `source_clause`.
   - An XLSX row requirement carries sheet/row location in `source_clause`.

## Suggested File Touches

- `backend/requirements.txt`
- `backend/app/main.py`
- `backend/app/ingest.py`
- `backend/app/ingest_office.py` or `backend/app/ingest_pack.py`
- `backend/app/pipeline.py`
- `backend/tests/` or existing backend test location

## Acceptance Criteria

- `POST /tenders/upload` accepts a mixed pack of supported file types.
- A DOCX-only upload produces chunks and at least reaches extraction.
- An XLSX/CSV-only upload produces chunks and at least reaches extraction.
- Mixed pack provenance is preserved per requirement.
- Existing PDF upload path still passes.
- Unsupported file types fail clearly.
- No requirement schema change.

## Cut Line

If time gets tight, ship only `.docx`, `.xlsx` and `.csv` direct upload. Cut `.zip` and legacy `.xls`.
