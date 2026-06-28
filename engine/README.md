# engine/ — Generalist lane (reconcile/dedupe + eval harness)

Pure-Python (stdlib + `pytest`) pipeline pieces the Generalist owns. Sibling to `/backend`; never nested under it.

## Run (always from the repo root)

```bash
# tests
python -m pytest engine/tests/ -v

# reconcile a raw extraction envelope -> clean final envelope + report
python -m engine.reconcile engine/tests/fixtures/mock_raw_extraction.json --out out.json --report report.json

# score a tool output against a gold set
python -m engine.eval --gold engine/gold/mock.gold.json --output out.json
```

Use `python` (not `python3` / `py`). All file I/O and stdout are UTF-8 (this box defaults to cp1252 — see `comms/board-j.md` J-008).

## Output contract — match the LIVE frontend type

`reconcile` emits the **15-field `Requirement`** shape and the `{tender_id, title, requirements}` envelope that
`frontend/src/types/requirement.ts` declares **today**. The additive autofill fields (`answer`, `open_questions`,
`capability_docs`) are intentionally **omitted** — they arrive via a coordinated Frontend type change + PR when the
Day-3 answer-draft step ships. Do not add them to reconcile output before that PR lands. Merge provenance lives in the
separate reconcile **report**, never in a requirement object.

## Modules

- `reconcile.py` — dedupe/merge raw extraction candidates into the clean final list (+ audit report).
- `similarity.py` — the swappable similarity seam (difflib char-ratio + content-token Jaccard). Shared with eval.
- `eval.py` — score tool output against a hand-labelled gold set (recall / precision / gating recall + a misses report).
- `_io.py` — UTF-8-safe JSON read/write.
- `gold/` — hand-labelled gold sets, one per tender.
