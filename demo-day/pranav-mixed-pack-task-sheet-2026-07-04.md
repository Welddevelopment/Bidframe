# Pranav Mixed-Pack Task Sheet - Post-Demo 16-Hour Sprint

> Purpose: Pranav's backend task sheet for the **post-demo mixed-pack sprint**.
> Source of truth: `ops/mixed-pack-01-backend-ingest.md`, with release constraints from
> `ops/mixed-pack-04-release-qa.md`.
>
> Product wording: **"Upload the tender pack."** Do not call this "Office integration" unless we
> actually connect to Microsoft systems.

## Goal

Make the live API accept tender packs containing:

- PDF
- Word `.docx`
- Excel `.xlsx`
- CSV

Then normalize all readable text into the existing `IngestedDoc` / `run_pipeline_multi` path **without
changing the locked requirement schema**.

## Non-Goals

- No SharePoint.
- No OneDrive.
- No Microsoft Graph.
- No portal login.
- No live Office comments, permissions or sync.
- No rich Office preview.
- No requirement schema change.
- No ZIP unless everything else is done.
- No legacy `.xls` unless everything else is done.

## Current Backend Shape

Current path:

- `backend/app/main.py` accepts PDF upload and rejects other extensions.
- Uploaded docs are stored as `d1.pdf`, `d2.pdf`, etc.
- `backend/app/pipeline.py` sends each document through `ingest_pdf(path)`.
- `backend/app/ingest.py` returns `IngestedDoc(filename, pages)`.
- `run_pipeline_multi` handles multi-file provenance once documents are ingested.

Target path:

- `main.py` accepts `.pdf`, `.docx`, `.xlsx`, `.csv`.
- Stored docs keep original extension: `d1.pdf`, `d2.docx`, `d3.xlsx`, `d4.csv`.
- Add `ingest_document(path) -> IngestedDoc`.
- PDF path remains exactly as safe as before.
- DOCX/XLSX/CSV become synthetic pages/sections that the existing chunker and extractor can read.

## Source Mapping Rules

Use existing schema fields only:

- `source_filename`: original uploaded filename.
- `source_doc_id`: existing `d1`, `d2`, etc.
- `source_page`:
  - PDF: real page.
  - DOCX: `1`.
  - CSV: `1`.
  - XLSX: sheet index or `1` if simpler.
- `source_clause`:
  - PDF: existing clause heading.
  - DOCX: `DOCX: heading <name> / paragraph <n>` or `DOCX: table <n> row <m>`.
  - XLSX: `XLSX: <SheetName>!A12:F12` or `XLSX: <SheetName> row 12`.
  - CSV: `CSV: row 12`.
- `source_excerpt`: exact paragraph, table row, spreadsheet row or CSV row text.
- `source_rect`: `null` for non-PDF.
- `source_rect_match`: `null` for non-PDF.

Do not add `source_locator` in this sprint.

## Implementation Steps

1. **Dependencies**
   - Add `python-docx` for `.docx`.
   - Add `openpyxl` for `.xlsx`.
   - Use stdlib `csv` for `.csv`.
   - Do not add `xlrd` unless `.xls` is explicitly uncut.

2. **Office ingestion module**
   - Add `backend/app/ingest_office.py`.
   - Implement:
     - `ingest_docx(path) -> IngestedDoc`
     - `ingest_xlsx(path) -> IngestedDoc`
     - `ingest_csv(path) -> IngestedDoc`
   - Preserve readable locators in the page text so the extractor can cite them.
   - Ignore empty paragraphs, empty rows and empty sheets.

3. **Dispatcher**
   - Add `ingest_document(path)` in `backend/app/ingest.py` or a small `ingest_pack.py`.
   - Dispatch by lowercased extension.
   - `.pdf` calls existing `ingest_pdf`.
   - Unsupported extensions raise a clear parse error including filename and extension.

4. **Upload validation**
   - Update `backend/app/main.py` upload validation to accept `.pdf`, `.docx`, `.xlsx`, `.csv`.
   - Keep per-file and total pack-size limits.
   - Keep unsupported files as clean 4xx errors, not 500s.

5. **Pipeline**
   - Update `run_pipeline_multi` to call `ingest_document(path)` instead of `ingest_pdf(path)`.
   - Keep existing provenance assignment.
   - Guard PDF rectangle attachment so it only runs for PDF docs.
   - Update comments/copy from "PDFs" to "tender documents" where it affects behavior.

6. **Tests**
   - Add synthetic fixture files only. Do not commit real tender packs.
   - Minimum tests:
     - PDF-only upload still works.
     - Unsupported `.png` is rejected clearly.
     - DOCX-only upload reaches extraction.
     - XLSX-only or CSV-only upload reaches extraction.
     - Mixed PDF + DOCX + XLSX preserves `source_docs`.
     - Office-derived requirement has `source_filename`, `source_doc_id`, `source_excerpt`.
     - Office-derived requirement does not pretend to have PDF highlights.

## Parser Detail

### DOCX

Extract in document order:

- Headings.
- Paragraphs.
- Tables.

Recommended text format inside `IngestedDoc.pages`:

```text
[DOCX paragraph 12 | heading: Selection Questionnaire]
Tenderers must provide ...

[DOCX table 3 row 4]
Question: Insurance | Requirement: Public Liability GBP 5m | Pass/Fail
```

### XLSX

For each non-empty sheet row:

```text
[XLSX Pricing row 12 | A12:F12]
Item | Unit | Qty | Price | Tenderer must complete
```

Keep sheet names. Use row numbers. Do not evaluate formulas; read visible values.

### CSV

For each non-empty row:

```text
[CSV row 12]
Mandatory, Complete Form of Tender, Pass/Fail
```

Use stdlib CSV parsing, not string splitting.

## Acceptance Criteria

- `POST /tenders/upload` accepts `.pdf`, `.docx`, `.xlsx`, `.csv`.
- Mixed packs do not crash.
- Existing PDF-only path remains green.
- Every requirement from a supported file has `source_filename`.
- Non-PDF-derived requirements have a human-readable source locator.
- Non-PDF-derived requirements have `source_rect = null` and `source_rect_match = null`.
- Unsupported files fail clearly.
- No requirement schema change.

## Cut Line

Cut in this order:

1. ZIP support.
2. Legacy `.xls`.
3. Rich Office source preview.
4. Fancy table reconstruction.

Do **not** cut:

- PDF-only path safety.
- Provenance.
- Clear unsupported-file errors.
- Schema compatibility.

## Suggested Commands

Backend/engine:

```powershell
python -m pytest engine/tests
```

Codemap after adding files:

```powershell
python scripts/gen_codemap.py
```

Git loop:

```powershell
git pull --rebase
git add -A
git commit -m "backend: accept mixed tender packs"
git pull --rebase
git push
```

## Safe Demo/Release Wording If It Ships

> "Bidframe can upload the tender pack, not just one PDF: the ITT, Word response forms, and spreadsheet
> schedules are read into one source-backed compliance matrix."

Avoid:

> "We integrate with Microsoft Office."

Avoid unless proven:

> "We preserve every formula, comment and cell layout."
