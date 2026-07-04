# Mixed-Pack Ingestion Sprint - Release and QA Lane

Owner: J / QA / whoever is coordinating the 16-hour sprint
Timebox: runs alongside all lanes, then owns the final 2 hours
Goal: keep the sprint shippable on `main`, prevent lane blocking, and decide the cut line before the clock runs out.

## Product Framing

Do not call this "Word/Excel integration" in the product unless we actually connect to Microsoft systems.

Call it:

> Upload the tender pack.

Supported pack files for the sprint:

- PDF
- Word `.docx`
- Excel `.xlsx`
- CSV
- Optional: ZIP containing those files

Deferred:

- SharePoint
- OneDrive
- Microsoft Graph
- portal scraping
- live Office comments or permissions

## Parallel Work Plan

Hour 0-1:

- Backend starts parser dispatcher and upload acceptance.
- Generalist starts format-neutral safety-net tests from synthetic `IngestedDoc` objects.
- Frontend starts upload copy and source-label changes against mock data.
- QA prepares mixed-pack fixtures.

Hour 1-6:

- Backend lands DOCX and XLSX/CSV ingest.
- Generalist lands safety-net and cross-doc dedupe tests.
- Frontend lands UI acceptance and Office source fallback.
- QA keeps a running checklist of commands and failures.

Hour 6-10:

- Backend wires parser dispatcher into `run_pipeline_multi`.
- Frontend checks source panel behavior with a mock Office-derived requirement.
- Generalist runs engine suite and fixes any report wording.
- QA starts local smoke with backend fixtures.

Hour 10-14:

- Integration smoke:
  - PDF-only upload still works.
  - DOCX-only upload reaches extraction.
  - XLSX/CSV-only upload reaches extraction.
  - Mixed PDF + DOCX + XLSX pack preserves `source_doc_id` and `source_filename`.
  - Office-derived source rows do not try to show PDF highlights.

Hour 14-16:

- Cut or ship.
- Run minimum checks.
- Regenerate `CODEMAP.md` because files were added/structure changed.
- Commit small, pull rebase, push.

## Fixtures To Build

Minimum:

- `sample-return-forms.docx`
  - deadline
  - insurance pass/fail
  - complete and return Form of Tender

- `sample-pricing-schedule.xlsx`
  - sheet `Pricing`
  - rows with price headings
  - row requiring completion and return
  - one clear rejection/disqualification line

- `sample-compliance.csv`
  - one mandatory checklist row
  - one optional row

Keep fixture content synthetic if committing. Do not commit real tender packs unless already allowed.

## Test Commands

Backend and engine:

```bash
python -m pytest engine/tests
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Codemap:

```bash
python scripts/gen_codemap.py
```

## Demo Truth After This Ships

Safe wording:

> Bidframe now reads tender packs, not just PDFs. It can ingest the main ITT, Word response templates, and spreadsheet schedules into one source-backed compliance matrix.

Avoid:

> We integrate with Microsoft Office.

Avoid unless proven:

> We perfectly preserve every cell, comment and formula.

## Release Gate

Ship only if all are true:

- PDF-only path remains green.
- Mixed pack upload does not crash.
- Every requirement has `source_filename`.
- Non-PDF requirements show a source excerpt and locator.
- No fake PDF highlight appears for non-PDF files.
- Unsupported files fail clearly.

## Cut Lines

First cut:

- Drop ZIP.
- Drop `.xls`.

Second cut:

- Keep `.docx`, `.xlsx`, `.csv`.
- Source panel only shows excerpt for Office files.

Final cut:

- Keep PDF live.
- Land frontend copy saying Word/Excel support is coming only if backend is not ready. Do not claim support the product cannot deliver.
