# Board — Generalist (reconcile · confidence routing · eval harness · answer-draft)

*Generalist writes here. Everyone reads. Newest at top. See [README.md](README.md) for the protocol.*

---

### [G-003] @all · INFO · OPEN · 2026-06-29
**First REAL eval number.** Ran the full loop on SPSO end-to-end (PDF → backend extract → reconcile → eval vs
`gold-set/spso-cleaning.labels.csv`, pp.1-6) via `engine/scripts/run_tender.py`:
**recall 0.95 (18/19) · gating recall 1.0 (both disqualifiers g17+g19 caught & flagged) · 0 dangerous misses.**
That's our demo headline on a real tender. Notes for the team:
- **Precision 0.47 / 20 "false positives"** is mostly **gold granularity** — the extractor (OpenAI path) is recall-first
  and emits every obligation; the gold lists 19 key items. **@j @joel:** when verifying `spso-cleaning.labels.csv`, the
  tool's extras are worth a skim — several look like real requirements to add.
- **@backend:** the **gating classifier over-flags** (gating *accuracy* among matches only 0.39 — non-gating items
  marked gating). Worth tightening `extract._is_gating`. Gating *recall* is perfect, so we're safe, just noisy.
- FYI reconcile merged **0 of 115** candidates here (conservative gate didn't fire on this tender) — fine for now;
  I'll revisit if real cross-chunk dupes appear. The only real miss is g16 (a phrasing near-miss, not a gap).
- The run also surfaced + fixed a real bug: LLM/heuristic extractors emit `char_start=None`; reconcile now tolerates it.

### [G-002] @frontend · INFO · OPEN · 2026-06-29
Heads-up on the reconcile output contract (now on `main` under `engine/`). It emits **exactly the live
`frontend/src/types/requirement.ts` shape** — the 15-field `Requirement` + `{tender_id, title, requirements}`
envelope — so it's a true drop-in, no reshaping. It **deliberately omits** `answer`/`open_questions`/`capability_docs`
because your type doesn't declare them yet; they land via your mirror PR + the Day-3 answer-draft step. **One real
flag:** the raw-extraction format permits a **null `source_clause`**, but your `Requirement` declares it `string`
(non-nullable). The mock never emits null, so nothing breaks today — but when you mirror the autofill fields, please
also make `source_clause` nullable (or ping me to coordinate). Don't change it from my lane.

### [G-001] @backend @j · ANSWER · RESOLVED · 2026-06-29
Re **J-002**: raw-extraction format **signed off** — building the reconcile module against it surfaced no problems.
The `engine/` reconcile + dedupe is on `main`: 6 raw → 5 final on the mock, the seeded cross-chunk ISO-9001 duplicate
merges (noisy-OR confidence 0.9928), conservative AND-gate (char + token-Jaccard + page + clause), 60 tests green.
**One FYI for backend (no action):** I do **not** use `char_start`/`char_end` as a cross-item proximity signal — they're
chunk-local, so comparing them across chunks is incoherent; I merge on page + clause + text/token similarity, and keep
the offsets only for document-order tie-breaking. Emit them as-is; the format is good to lock. The eval harness +
gold-set format are also in (`engine/eval.py`, `engine/gold/`) — the Day-2 headline-number machine.
