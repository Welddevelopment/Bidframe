# Mixed-Pack Sprint — Frontend UI (make the pack *visible*)

Owner: Frontend (Jawad)
Timebox: 2–4 hours
Goal: turn the shipped-but-invisible mixed-pack support into a **screenshot-able, demo-able** experience.

## Why this lane exists now

Your light lane (`ec5545f`) already did the hard part — the **data + logic** layer is done and honest:
`source-doc.ts` helpers (`sourceDocumentKind`, `sourceKindLabel`, `hasPdfSource`, `sourceRefLabel`),
Office-aware rendering in `RequirementPanel` / `MatrixView` evidence pane / graph, multi-file *wiring* in
`UploadDropzone`, and mixed mock data (`req-0011` Word, `req-0012` Excel in `mock-requirements.ts`). Backend
(lane 01) is fully wired end-to-end. **But none of it is visible**: the whole pack collapses to the string
`"3 documents"`, there are no format badges, and `tender.source_docs` is plumbed through
`RequirementsContext` but **rendered nowhere**. This lane makes "Upload the tender pack" a thing a judge can
*see*. No schema change; reuse the helpers you already wrote; keep the PDF proof experience untouched.

You can build all of this against the **existing mixed mock data** now, and against
`frontend/src/data/mixedpack-prebake.json` once backend lands it (J-092).

## Tasks (ranked by demo value)

### 1. Multi-file pack upload list — the biggest visible gap
`UploadDropzone.tsx` accepts `.pdf/.docx/.xlsx/.csv` + `multiple`, but >1 file collapses to `"${all.length}
documents"` (~L92). Replace with a **staged file list** before/while uploading:
- one row per file: **format icon** (PDF/Word/Excel/CSV) · filename · size · **remove (×)** · "add more".
- make `ProcessingView` / the done-state **pack-aware**: "Reading 3 documents…" and "Requirements extracted
  across N documents" instead of the single-doc "Reading your tender / pageCount".
- Per-file *progress* needs a backend `JobStatus` per-file field (`api.ts` `JobStatus` has none) — **flag as a
  follow-up**, ship the multi-doc list + aggregate now.

### 2. Per-row source-type badge (matrix + graph)
`sourceDocumentKind`/`sourceKindLabel` exist and are **unused by the matrix**. Add a small PDF/Word/Excel/CSV
glyph in `ComplianceMatrix.tsx`'s mono margin (beside the format-aware ref) and on the `GraphView` node. Pure
presentation over existing helpers — highest value-per-effort.

### 3. "Tender pack: N documents" summary — consume `source_docs`
`RequirementsContext.sourceDocs` is populated by `loadTender` but **no component reads it.** Render a
**chip-per-file strip** (format icon + filename + that doc's requirement count) in `ControlPanel.tsx` and/or
`DocumentHeader`. This is the cleanest single "the pack is real" visual and the data is already in context.

### 4. ControlPanel document tally
`ControlPanel` counts requirements/deal-breakers/decisions but is pack-blind. Add a **"from N documents
(1 PDF · 1 Word · 1 Excel)"** stat sourced from `sourceDocs`.

### 5. Fix the Office path in `SourceVerifyOverlay`
Its text fallback hard-codes `p.{source_page}` (wrong for Excel/CSV) and is currently **unreachable** (the
panel's verify button is `pdfUrl`-gated, null for Office). Either (a) correct the wording to the format-aware
`sourceRefLabel` locator, or (b) give Office rows their own "see the source (text)" affordance. Do **not** ever
show a PDF-highlight chrome for a non-PDF source.

### 6. Exports gain a source column
The CSV export (`MatrixView.tsx`) and `export-matrix-xlsx.ts` emit `source_page`/`source_clause` but no
`source_filename`/format. Add a **Source document** column so an exported matrix shows which file each row came
from. (`export-response.ts` already uses `sourceRefLabel` — leave it.)

### 7. Add a `.csv` mock row
`mock-requirements.ts` has Word + Excel mocks but **no CSV** — add one (e.g. a compliance-checklist row,
`source_filename: "compliance-checklist.csv"`, `source_clause: "CSV row 12"`) so the format sweep is complete
for screenshots.

## Acceptance
- A judge can upload/see a pack of 3+ mixed files as a **list**, not "3 documents".
- Every matrix row and the pack summary shows **which file + format** it came from (icon + label).
- No PDF-highlight chrome ever appears on a Word/Excel/CSV row (`hasPdfSource` stays the gate).
- `next build` + `lint` green; PDF single-doc experience unchanged.

## Cut line
If time-boxed: do **#2 (badges) + #3 (pack summary strip)** — together they make the pack visible for the
video with the least code. #1 (upload list) is the richer build if you have the hours.
