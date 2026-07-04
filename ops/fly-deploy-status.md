# Fly.io deploy — current status + what's left for @j / whoever has Vercel + the ssh session

Follows [`fly-deploy.md`](fly-deploy.md) (the original runbook). This file is the live status: what's
actually done on Fly right now, and the exact remaining steps. Pranav (`pranav.bgri@gmail.com`) is the
Fly.io account owner.

## Done ✅

- `flyctl` installed locally.
- App **`bidframe-api`** created in org `pranav-sb`, region `lhr` (London).
- **Fixed a real bug in `backend/Dockerfile`** before deploying: the build context was `backend/` only,
  which can't see `engine/` (a sibling directory) — `backend/app/pipeline.py` imports
  `engine.reconcile`/`engine.gating_scan`/`engine.answer` for the REAL reconcile + deterministic
  gating-net + autofill. Building from `backend/` alone would have silently deployed the thin
  placeholder engine and caught **0 disqualifiers** — this is the exact same bug that bit the Render
  deploy once (`G-009`). Fixed: the Dockerfile now expects a **repo-root build context** (`COPY
  backend/ backend/` + `COPY engine/ engine/`, `CMD` runs `backend.app.main:app`). `fly.toml` lives at
  the repo root and its `[build] dockerfile = 'backend/Dockerfile'` already points at the right file
  with the right context — nothing further to do here, just don't move `fly.toml` into `backend/`.
- Persistent volume **`bidframe_data`** created (1 GB, region `lhr`), mounted at `/data` in `fly.toml`.
- `min_machines_running = 1` set (no cold starts mid-demo).
- Secrets **staged and deployed**: `AUTH_SECRET`, `OPENAI_API_KEY` (the real key), `LLM_MODEL=gpt-4o`,
  `DATABASE_URL=sqlite:////data/tender.db`, `CORS_ORIGINS=https://bidframe.org,https://www.bidframe.org`.
- **`fly deploy` succeeded.** Live at **https://bidframe-api.fly.dev**.
- Verified `GET /health` → `{"status":"ok","extractor":"openai"}` (the real key is active, not the
  free heuristic fallback).
- Verified on the running machine itself (`fly ssh console`): `pipeline._HAVE_ENGINE == True` — the
  real engine package imported correctly, confirming the Dockerfile fix actually worked in production,
  not just in theory.
- Verified the documented Alice demo account can log in against Fly (token not printed).
- Verified the public `bidframe.org` frontend bundle is built with `https://bidframe-api.fly.dev` and
  calls `/tenders/upload` on that host.
- Verified a live ZIP/mixed-pack upload against Fly: `fixtures/mixed-pack/sample-pack.zip` →
  `job-26bc1a66` → `done`, 21 requirements, 18 deal-breakers, 3 source docs, with per-file progress.

## Left to do — presenter-machine acceptance only

The infrastructure/upload path is live. Before recording or presenting, do one browser-level pass on the
actual presenter machine:

1. Open `https://bidframe.org` → sign in as **Alice** (`alice@bidframe.co.uk` / documented password) →
   upload a small tender/pack → wait for extraction.
2. **Share** the tender to `bob@bidframe.co.uk`.
3. In a second browser/profile, sign in as **Bob** → open the same tender (must be 200, not 404).
4. Both approve/edit/flag rows → confirm **"Approved by Alice / Bob"** attribution, the **activity
   feed** updating, and **member avatars**.

Latest non-browser proof (2026-07-04, Codex): health=openai, Alice login ok, public frontend points at
Fly, live ZIP upload finished `done` with 21 requirements / 18 deal-breakers / 3 source docs.

## Gotchas (from the original runbook, still true)

- **Don't redeploy after creating the accounts** unless you must — the DB is safe on the volume, but a
  redeploy wipes the *uploads* dir (only the DB is mounted at `/data`; uploaded PDFs are not, per the
  original runbook's Step 3 note). If you need to keep an uploaded demo tender across a redeploy, that's
  a follow-up (mount `/app/data` too).
- **`extractor` says `heuristic` after a future redeploy?** The `OPENAI_API_KEY` secret didn't carry —
  re-run `fly secrets set OPENAI_API_KEY=...` and `fly deploy`.
- **CORS error in the browser console on bidframe.org?** `CORS_ORIGINS` must be exactly
  `https://bidframe.org,https://www.bidframe.org` — re-set the secret + redeploy if it's ever changed.
- **Extraction is slow** on a real gpt-4o key (minutes per upload, depending on rate limits). Fine for
  the collab demo (upload once, then collaborate) — don't try to live-upload a huge pack on camera; the
  instant mixed-pack view is already frozen at `/pack`.
- **Invite-only**: there's no public signup, so only Alice + Bob (created in step 1 above) can sign in.

## Fallback

If Fly or Vercel fights back and time is short: **localhost is identical and ~5 minutes.** Run
`uvicorn app.main:app` from `backend/` locally + the frontend with
`NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`, create Alice + Bob with the same two admin commands
(against the local `backend/tender.db`), record locally. Same product, zero deploy risk.
