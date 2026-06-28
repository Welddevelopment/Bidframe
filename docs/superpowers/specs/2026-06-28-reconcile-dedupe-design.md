# Reconcile / Dedupe Module — Design Spec

**Date:** 2026-06-28 (Day 1) · **Owner:** Generalist · **Project:** Bidframe (Conduct "Make Legacy Move")

## Context

The backend's per-chunk LLM extraction emits a **raw extraction list** — candidate requirement objects where the *same* real-world requirement may appear 2–3 times (extracted from overlapping chunks), confidence is the model's raw self-report, and ids are provisional. See `prompts/raw-extraction-format.md` + the mock at `prompts/mock-raw-extraction.json`.

The reconcile/dedupe module is **step 5 of the pipeline** and the entry point of the Generalist's lane. It turns that noisy raw list into the **clean, final requirement objects** the API serves and the frontend renders (locked schema in `AGENTS.md` §"Data contract"). Everything else the Generalist owns — confidence routing, the eval harness, answer-draft — operates on this module's output, so it is built first.

**Prime directive:** reconcile **conservatively**. Wrongly merging two genuinely-different requirements is a *silent miss* — the worst failure mode in this product, because a missed mandatory requirement disqualifies a bid. When unsure whether two candidates are the same, keep both and let the human decide.

## Locked decisions

1. **Matching = fuzzy text + source proximity, stdlib (`difflib`), behind a swappable `similarity()` seam.** Not semantic embeddings — they over-merge (would fuse "ISO 9001" with "ISO 14001"), are non-deterministic, and are unauditable, which violates both the conservatism directive and the product's traceability thesis. The seam lets us swap in `rapidfuzz`/embeddings later if Day-2 eval proves `difflib` too weak, without touching merge logic.
2. **Merge only on a conservative AND of signals** — high text similarity **and** source-proximal (same page/clause or overlapping char offsets). Two similar-sounding items far apart in the document are probably distinct requirements stated twice; keep both.
3. **Confidence combination = noisy-OR** (`1 − ∏(1 − cᵢ)`). Two independent chunks extracting the same requirement is corroboration → confidence rises, not averages down.
4. **Safety escalation on merge:** if *any* member is `mandatory` or `is_gating`, the merged item is `mandatory`/`is_gating`. Never downgrade a disqualifier by merging.
5. **Output = the locked final schema**, a drop-in for what the API serves (zero reshaping for frontend/backend). Merge provenance lives in a **separate reconcile report**, never in the requirement object — so the locked schema is untouched.
6. **`needs_review` = crude default for now** (confidence below ~0.75 → true). Real calibration against the gold set is the Generalist's Day-3 job. The crude default already makes the £2m-turnover item (0.62) self-flag in the demo.
7. **Code home = new top-level `engine/` folder** — the Generalist's lane, separate from `/backend`, so pushes never collide.

## Architecture / components

```
engine/
  reconcile.py        # the module
  tests/
    test_reconcile.py
  README.md
```

`reconcile.py` public surface:
- `reconcile(raw_envelope: dict) -> dict` — raw envelope in → tender response out (the one function the API/eval call).
- CLI: `python -m engine.reconcile raw.json > clean.json` (+ report to stderr or sidecar).

Internal units (each independently testable):
- `similarity(a_text, b_text) -> float` — the swappable scorer (`difflib` v1).
- `same_requirement(a, b) -> bool` — the conservative AND of text similarity + source proximity.
- `group(raw_items) -> list[list]` — cluster candidates that are the same requirement.
- `merge_group(items) -> dict` — canonical source + noisy-OR confidence + safety escalation + union of `depends_on`.
- `to_final(merged, req_id) -> dict` — promote to the locked final schema with defaults.
- `assign_ids(merged_list) -> list` — stable `req-0001…` in document order (page, then char offset).

## Data flow

```
raw envelope JSON
  → validate (tolerate missing criteria_ref/depends_on; keep+flag malformed)
  → group candidates (text-sim AND source-proximal)
  → merge each group (canonical excerpt/page, noisy-OR confidence, escalate type/gating, union depends_on)
  → promote to final schema (assign ids, status=pending, decision=null, answer=null, open_questions=[], crude needs_review)
  → emit tender response { tender_id, title, requirements[], capability_docs: [] }
  + separate reconcile report (which raw_ids merged into which req_id, similarity scores, decisions)
```

## Merge logic detail

- **Grouping** is transitive-aware but conservative: if A~B and B~C but A≁C, do **not** force all three together — prefer keeping the weaker link separate over an unsafe merge (exact tie-breaking to be specified in the plan).
- **Similarity threshold** starts ~0.85 as a named constant, **validated/tuned against the gold set on Day 2** — not agonized over now.
- **Canonical source** = the member with the fuller `source_excerpt` / higher raw confidence (mock: `raw-c003`'s excerpt with "…will result in the bid being rejected" beats `raw-c004`'s terse one; keep page 14).
- **Category** = from the highest-confidence member.

## Output schema (the locked final object — per `AGENTS.md`)

`id` (assigned) · `text` · `source_page` · `source_clause` · `source_excerpt` (canonical) · `type` · `is_gating` (escalated) · `category` · `confidence` (noisy-OR) · `status:"pending"` · `needs_review` (crude default) · `decision:null` · `criteria_ref` (passthrough/null) · `depends_on` (union/[]) · `draft_answer:null` · `answer:null` · `open_questions:[]`. Tender response also carries `capability_docs: []`.

## Error handling

Recall-first. A malformed / missing-critical-field raw item is **kept, flagged `needs_review`, and logged in the report** — never silently dropped (dropping = a miss). Missing `criteria_ref`/`depends_on` tolerated (raw spec says they may be absent in v1). One bad item never crashes the run. **All file I/O is UTF-8** (the team already hit a Windows cp1252 crash — see `comms/board-j.md` J-008).

## Testing (TDD — tests written first)

1. 6 mock raw items → **5** final (the two ISO items merge).
2. Merged ISO item keeps the fuller excerpt + page 14, confidence > both inputs (noisy-OR).
3. Non-duplicates pass through unchanged (insurance, account manager, turnover, case studies).
4. Two *similar-but-distant* items (synthetic fixture) stay **separate** — the conservatism guard.
5. `needs_review` true for the 0.62 turnover item, false for the rest.
6. IDs sequential + stable, in document order.
7. A malformed raw item doesn't crash the run (kept + flagged).

## Out of scope (YAGNI — do NOT build now)

- Real confidence calibration / threshold tuning → Day 3 (confidence routing).
- Answer-draft, `open_questions` population → Day 3 (answer-draft).
- Semantic / embedding matching → only if Day-2 eval demands it.
- `criteria_ref` / `depends_on` *population* → backend graph step, Day 3 (we only pass through).
- Live API wiring → consume the mock JSON now; backend swaps the source later.

## Day-2 eval handoff

The reconcile **report** (merge log) is the first artifact the eval harness consumes. Defining the **gold-set label format** is the immediate next sub-project after this module ships.
