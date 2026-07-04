# Mixed-Pack Ingestion Sprint - Frontend Lane

Owner: Frontend
Timebox: 2-3 hours inside the 16-hour sprint
Goal: make the UI honestly accept and display mixed tender packs, while leaving parsing and extraction to backend.

## Why This Lane Is Light

Frontend does not need to understand Word or Excel. It only needs to:

- let the user select the right files
- describe the pack honestly
- display non-PDF source locations without pretending there is a PDF highlight
- keep the existing PDF proof experience unchanged

This can be built against mock data before backend support lands.

## Non-Goals

- No Office previewer.
- No client-side DOCX/XLSX parsing.
- No Microsoft 365 integration.
- No new product surface beyond upload copy and source labels.

## Tasks

1. Broaden upload acceptance:
   - In `frontend/src/components/UploadDropzone.tsx`, accept `.pdf,.docx,.xlsx,.csv` and maybe `.zip` only if backend ships it.
   - Change error copy from "Use PDF tender documents" to "Use PDF, Word, Excel or CSV tender documents."
   - Keep size guards.
   - Still pass the `File[]` to `uploadTender` unchanged.

2. Update upload page wording:
   - Rename "PDF" language to "tender pack" where it is user-facing.
   - Keep the promise calm: "Upload the tender pack" rather than "integrate Office".

3. Make source labels format-aware:
   - Check `frontend/src/lib/source-doc.ts` and any nearby source label helpers.
   - If `source_filename` ends in `.pdf`, keep page wording and PDF behavior.
   - If `.docx`, show `Word - <source_clause>` or simply the filename plus locator.
   - If `.xlsx` or `.csv`, show `Excel - <source_clause>` or `CSV - <source_clause>`.

4. Keep PDF proof honest:
   - Existing PDF overlay/highlight should render only when `requirementPdfUrl(...)` exists and the source file is PDF.
   - For Office-derived requirements, show the source excerpt in the panel and do not show "Open page" or a fake highlight.

5. Add a tiny mock fixture:
   - Add one DOCX-derived requirement and one XLSX-derived requirement to existing mock/prebake data only if it does not disturb the demo.
   - Better option: add a local fixture in a component test or story-like data object if available.

## Suggested File Touches

- `frontend/src/components/UploadDropzone.tsx`
- `frontend/src/lib/api.ts` if the accepted file comments/types say PDF-only
- `frontend/src/lib/source-doc.ts`
- `frontend/src/components/MatrixView.tsx` or `RequirementPanel.tsx` only if they show PDF-only source actions
- `frontend/src/data/mock-requirements.ts` only if a mock is useful

## Acceptance Criteria

- The upload control accepts PDF, DOCX, XLSX and CSV files.
- The UI copy says "tender pack" or "documents", not "PDF" where mixed packs are supported.
- PDF-derived requirements still open the PDF proof panel.
- Office-derived requirements show a filename, locator and excerpt, with no fake page highlight.
- Frontend can be tested before backend support lands by using mock Office-derived requirements.

## Cut Line

If time gets tight, do only upload acceptance/copy plus a source-label guard. Backend can still ship mixed-pack extraction without a fancy frontend change.
