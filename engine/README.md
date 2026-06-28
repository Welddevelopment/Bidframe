# Bidframe Engine

Generalist-lane engine modules for reconcile/dedupe, confidence routing, and eval harness work.

## Run from the repo root

Always run commands from the repository root (`C:/Users/choib/UKAI-hack`). Use `python`, not `python3` or `py`, on this Windows box.

### Bash / PowerShell

```bash
python -m pytest engine/tests/ -v
python -m engine.reconcile engine/tests/fixtures/mock_raw_extraction.json --out out.json --report report.json
```

## Frontend contract note

Reconcile emits the 15-field `Requirement` shape and the `{tender_id, title, requirements}` envelope that `frontend/src/types/requirement.ts` declares today. The additive autofill fields (`answer`, `open_questions`, `capability_docs`) are intentionally omitted; they arrive via a coordinated Frontend type change + PR when the Day-3 autofill step ships. Do not add them to reconcile output before that PR lands.
