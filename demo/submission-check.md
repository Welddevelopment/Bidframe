# Submission check — numbers audit + GitHub readiness (2026-07-04)

Run before the midnight repo submission. Covers Tasks 2 (numbers consistency) and 3 (submission checklist)
from [`codex-tasks.md`](codex-tasks.md). ✅ = verified pass · ⚠️ = needs a human decision.

## Task 2 — Numbers consistency

| Check | Result |
|---|---|
| Straggler grep (`three weeks` / `Days → hours` / `in hours` / `Weeks of expert`) on the **live** surfaces (deck, README, narrative, ledger, speaker-notes, cue-cards, run-sheet) | ✅ **clean** — no first-read speed claim contradicts "Days → minutes" |
| The `demo/` strategy pack (`pitch-script.md`, `judge-research.md`, `research/*`) uses "three weeks" / "in hours" | ✅ left as-is — those are **whole-bid stakes** ("the whole bid — three weeks — wasted by a missed gate") or **quotes of the official judge brief**, not the first-read time. Contextually correct. |
| Headline speed-up is **"Days → minutes"** everywhere (deck, ledger, narrative) | ✅ consistent |
| First-read framing: 1–2 days / "the better part of a day"; Bradwell-specific = **34pp, 12 bid-killers to p.31** | ✅ consistent |
| Deal-breaker catch: **12/12**, **26/26**, held-out **Bradwell 10/10**, **Duffield 4/4**, **101/101** | ✅ present + agree |
| Market: **£341bn (2023/24)**, ~⅓ of public spend, Procurement Act live **24 Feb 2025** | ✅ (year stated) |
| `/showcase` worked example: **50 requirements, 12 deal-breakers, 4 answers, 1 open question** (README) | ✅ |
| Every headline number is in `demo-claim-ledger.md` with a source | ✅ **fixed** — added the **26/26** row and repointed the 12/12 source from the missing `scratchpad/net_alone_floor.py` to the committed **`engine/scripts/net_floor.py`** |

**Fixes applied this pass:**
- `demo-claim-ledger.md` §B: 12/12 now cites `python -m engine.scripts.net_floor` (committed, reproducible); added a **26/26** aggregate row.
- Reconciled the **two Q&A files** (they had the same name in different folders): [`demo/qa-prep.md`](qa-prep.md) is the tight **one-breath drill card**, [`demo-day/qa-prep.md`](../demo-day/qa-prep.md) is the **role-routed reference** — now cross-linked at the top of each, and the role-routed one's "how do you know your numbers" answer gained the reproducible 26/26.

## Task 3 — GitHub submission readiness

| Check | Result |
|---|---|
| No secrets tracked (only `.env.example`) | ✅ `git ls-files` clean of `.env`/token/secret/pem |
| `.gitignore` covers `.env*`, `node_modules/`, `.venv/` | ✅ |
| `LICENSE` present | ✅ |
| Fresh-clone frontend runs: `cd frontend && npm ci && npm run build` | ✅ green, 18/18 routes |
| Proof reproduces: `python -m engine.scripts.net_floor` | ✅ prints **26/26** |
| README "Run It Locally" steps correct | ✅ |
| `README` / `START-HERE` / `AGENTS` coherent, no dead links surfaced | ✅ |
| `CODEMAP.md` current | ⚠️ auto-refreshes hourly on `main`; regenerate with `python scripts/gen_codemap.py` if you want `net_floor.py` reflected immediately |

## ⚠️ One judgment call for the team — committed tender PDFs

`data/tenders/*.pdf` (10 real tender PDFs — SPSO, Bradwell, WLWA, Duffield, etc.) **are committed**. A
`.gitignore` negation (`!/data/tenders/`) deliberately un-ignores them, which **contradicts the AGENTS.md
rule "never commit tender PDFs."**

- **Keep them:** eval + `net_floor` + the gold sets are fully reproducible from a clone (a judge can re-run
  the accuracy claims against the real PDFs). Downside: repo bloat + breaks the team's own stated rule.
- **Remove them:** honours the rule, slims the repo — but a clone can no longer reproduce the PDF-based eval
  (`net_floor` still works — it reads the gold-label CSVs, not the PDFs; `eval_all`/`gating_recall` need them).

These are **UK public-sector documents** (public), so there's no obvious licensing risk. **Not changed here —
team decides.** If removing: `git rm --cached data/tenders/*.pdf` and drop the `!/data/tenders/` negation.

## Not touched (per scope)
No features, no schema changes, no edits to the frozen `frontend/src/data/*-prebake.json`. No files deleted.
