# Mixed-Pack Ingestion Sprint - Engine and Eval Lane

Owner: Generalist
Timebox: 3-5 hours inside the 16-hour sprint
Goal: make the extraction, reconcile, deal-breaker safety-net and eval assumptions format-neutral, using synthetic fixtures if the backend parser is still in flight.

## Why This Lane Exists

The backend can convert Word and Excel into text, but the trust layer must not assume every source is a PDF page. The engine's job is to keep the output honest: no silent deal-breaker misses, no fake source proof, and no eval command that gives a misleading result.

This lane can proceed without waiting for backend parsing by constructing `IngestedDoc` objects directly in tests.

## Non-Goals

- Do not build Office parsers here.
- Do not change the requirement schema.
- Do not tune the whole extraction prompt unless a mixed-pack test shows a specific failure.
- Do not chase broad recall improvements.

## Independent Inputs

Use test documents made in code:

- A pseudo-DOCX `IngestedDoc` with pages containing:
  - a submission deadline
  - a pass/fail insurance threshold
  - a "complete and return Form of Tender" line
- A pseudo-XLSX `IngestedDoc` with pages containing:
  - sheet-like rows
  - pricing schedule return instructions
  - a hidden-looking mandatory row

These can be built before the backend parser lands.

## Tasks

1. Audit engine code for PDF-only language:
   - Tests or scripts that say "PDF" when they really mean "source document".
   - Any eval formatting that assumes `source_page` is always a literal PDF page.

2. Strengthen deal-breaker safety-net tests:
   - Ensure `engine.gating_scan` catches pass/fail, exclusion, mandatory-return and deadline language in plain text pages.
   - Add one table-row style test, for example: `Insurance | Public Liability | GBP 5m | Pass/Fail`.
   - Add one return-form test, for example: `Bidders must complete and return the Pricing Schedule. Failure to do so may result in rejection.`

3. Add reconcile/eval provenance tests:
   - Requirements from different `source_doc_id`s must never merge across documents.
   - A requirement with `source_filename="pricing.xlsx"` and `source_clause="XLSX: Pricing!A12:F20"` should render in reports without crashing.
   - `source_page=1` for non-PDF docs must not be treated as a true PDF highlight.

4. Add an optional mini fixture:
   - `engine/tests/fixtures/mixed_pack_raw.json` if useful.
   - Include a duplicate non-gating row across two docs and a distinct gating row in Excel.

5. Update eval wording if needed:
   - "source page" remains valid for schema, but report copy should say "source" or "locator" where possible.
   - Avoid claiming PDF highlight coverage for Office-derived requirements.

## Suggested File Touches

- `engine/tests/test_gating_scan.py`
- `engine/tests/test_reconcile.py`
- `engine/tests/test_eval.py`
- `engine/scripts/eval_all.py` only if wording/reporting needs a small fix
- `engine/README.md` if a gotcha needs documenting

## Acceptance Criteria

- Engine tests prove the safety-net works on non-PDF text.
- Cross-document dedupe stays conservative.
- Eval/reporting handles Office-style source locators.
- No schema change.
- No dependency on the backend parser landing first.

## Cut Line

If time gets tight, do only the safety-net tests plus one cross-document reconcile test. That still protects the core claim.
