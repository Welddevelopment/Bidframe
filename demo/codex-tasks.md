# Codex task brief — demo-day hardening (3 tasks)

You are working in **Bidframe**, a Conduct "Make Legacy Move" hackathon repo. The team demos a live
5-minute pitch today and submits deck + video + this GitHub repo at midnight. Your job is three
**de-risking / polish** tasks below. **Do not add features. Do not touch the frozen demo data**
(`frontend/src/data/*-prebake.json`). Keep `main` runnable at all times.

## Context you need
- The demo runs on a **frozen Bradwell grounds-maintenance tender** (pre-baked, no backend, no API key):
  routes `/showcase` (primary), `/demo` (backup), `/pitch` (deck). All work offline.
- **Locked numbers live in [`../demo-claim-ledger.md`](../demo-claim-ledger.md)** — that file is the source
  of truth. The deal-breaker floor is reproducible: `python -m engine.scripts.net_floor` → **26/26**.
- Git: trunk-based on `main`, commit small with clear messages, `git pull --rebase` before pushing.
  Doc-only changes are safe to push anytime. **Before pushing any `frontend/` change, run
  `cd frontend && npm run build` and confirm it's green (18/18 routes).** Never push a broken build.
- Frontend deploys on a Vercel account that only builds commits from recognised authors — irrelevant for
  doc changes, but if a `frontend/` change doesn't go live, that's the cause (tell the human; don't chase it).

---

## Task 1 — Harden the demo fallback plan
**Goal:** the live demo cannot be killed by wifi, a dead key, a wrong resolution, or a broken route.

1. Read `demo-day/pre-show-checklist.md`, `demo-day/run-sheet.md`, `demo-day/speaker-notes-2026-07-04.md`,
   and any `demo-day/backup-plan.md` (create it if missing).
2. Produce/tighten a single **failure tree** the presenter can act on in 5 seconds:
   - `/showcase` won't load → switch to `/demo` (guided, same frozen run).
   - `/demo` also fails → **static screenshots / a saved PDF of the matrix + source proof** (confirm these
     assets exist under `pitch-assets/` or `frontend/public/`; if not, list exactly which screenshots to grab).
   - **No wifi** → everything is frozen/offline already; state the offline-safe URL to have preloaded in a tab.
   - **No API key** → the demo never needs one (frozen prebake); the honest line is in the speaker notes.
   - **Projector resolution** → note the tested resolution and the fullscreen key (`F` on `/pitch`).
3. Add a **"preload before you walk on"** list: which tabs open, which route pre-clicked to the first
   deal-breaker, timer reset (`Home` on `/pitch`).
4. **Acceptance:** one page (or a clearly-marked section) any team member can follow cold. No new code.

## Task 2 — Numbers-consistency audit
**Goal:** every number a judge sees is consistent and defensible; no stray old figures.

1. Grep these surfaces: `frontend/src/components/pitch/PitchDeck.tsx`, `README.md`, `demo-narrative.md`,
   `demo-claim-ledger.md`, `demo/qa-prep.md`, `demo-day/` (speaker-notes, cue-cards, run-sheet),
   `pitch-before-after.md`.
2. **These are the canonical figures — everything must match them:**
   - Headline speed-up: **"Days → minutes"** (never "Days → hours").
   - First read by hand: **1–2 days / "the better part of a day"**; Bradwell-specific framing: **34 pages,
     12 bid-killers scattered to page 31**.
   - Pricing: outsourced first-read from **£950**; full bid **~£4,000 / 2–8 weeks**; bid writer **£35–50k/yr**.
   - Deal-breaker catch: **12/12** (SPSO 2 + museum 10), **26/26** across 4 validated gold sets,
     held-out **Bradwell 10/10**, **Duffield 4/4 (0 missed)**, **101/101** synthetic phrasing bank.
   - Drafting: **0 bluffs**; SPSO **42/42** citations verified.
   - Market: **£341bn (2023/24)**, ~a third of public spend, Procurement Act 2023 live **24 Feb 2025**.
   - `/showcase` worked example: **50 requirements, 12 deal-breakers, 4 drafted answers, 1 open question**.
3. **Hunt and kill stragglers** on demo/pitch/README surfaces: `three weeks` / `3 weeks`, `Days → hours`,
   `in hours` (as the speed claim), `Weeks of expert reading`. Reconcile to the first-read frame.
4. **Known exception — do NOT "fix":** `traction-research.md` and `tender-master-plan.md` still say "~3 weeks";
   those are internal outreach/vision docs describing the *whole-bid* effort, not the demo first-read. Leave them
   (or flag to the human), don't rewrite.
5. Confirm **every headline number appears in `demo-claim-ledger.md`** with a source. If a surface cites a
   number not in the ledger, either add it to the ledger with a source or remove it.
6. If you change `frontend/` copy, rebuild green before pushing. **Acceptance:** a short report of what was
   inconsistent + fixed, and a clean grep.

## Task 3 — GitHub submission checklist (for the midnight repo deliverable)
**Goal:** a judge who clones the repo gets a clean, runnable, secret-free project.

1. **Secrets:** confirm no `.env`, credentials, tokens, or tender PDFs are committed. Check `.gitignore`
   covers `.env*`, `.venv/`, `node_modules/`, `data/tenders/`. Run `git ls-files | grep -iE '\.env|secret|token'`
   and scan `git log -p` isn't necessary — just confirm the working tree + tracked files are clean.
2. **Runnable from a fresh clone:** verify the README "Run It Locally" steps work — `cd frontend && npm ci &&
   npm run build` green; `python -m engine.scripts.net_floor` prints **26/26**. Fix the README if any step is wrong.
3. **Coherence:** `README.md`, `START-HERE.md`, `AGENTS.md` don't contradict each other or point at dead files.
   `LICENSE` present. `CODEMAP.md` current (`python scripts/gen_codemap.py` if structure changed — commit both
   `CODEMAP.md` and `frontend/public/codemap.html`).
4. **Judge-facing cleanliness:** no obviously stale/confusing top-level files that would make a judge doubt the
   repo (leftover scratch, broken links in the README). List anything questionable rather than deleting
   aggressively — flag to the human if unsure.
5. **Acceptance:** a checklist report (pass/fail per item) + any fixes committed. Don't delete files you didn't
   create without flagging first.

---

## Overall constraints
- **No features, no schema changes, no touching the frozen prebake JSON.**
- Frontend edits → `npm run build` green before push. Docs → safe to push.
- Commit small with scannable messages; `git pull --rebase` before push.
- When unsure whether a change is safe (deletions, another role's files, the schema), **stop and flag the human.**
