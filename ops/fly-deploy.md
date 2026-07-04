# Fly.io backend deploy — runbook (owner: @backend / "panda")

**Decision:** we're hosting the backend on **Fly.io** (not Render — free build minutes are exhausted; not
Cloudflare — serverless can't run our SQLite + disk + long-running extraction). Fly runs our existing
`backend/Dockerfile` as a real always-on container, which is exactly what this backend needs.

**Goal:** `https://bidframe.org` fully live — sign-in, upload, mixed-pack, and **collaboration** (share a
tender, attributed approve/edit/flag, activity feed) — with two real accounts for the demo/video.

The repo is already Fly-ready: `backend/Dockerfile` exists (`WORKDIR /app`, respects injected `$PORT`),
CORS reads `CORS_ORIGINS`, `DATABASE_URL` is env-driven, and the backend admin CLI exists
(`cd backend && python -m app.admin create-user --name ...`).

---

## Ground truth (so you don't rediscover it)

- **Dockerfile context is the repo root** — `backend/app/pipeline.py` imports the sibling `engine/` package.
  A backend-only build context silently drops the real reconcile/gating/autofill engine. Keep `fly.toml` at
  the repo root and build with `backend/Dockerfile`.
- **In-container repo root = `/app`**; backend package lives at `/app/backend`, engine at `/app/engine`.
  Admin CLI can be run as `cd /app/backend && python -m app.admin ...` (or from `/app` as
  `python -m backend.app.admin ...`).
- **SQLite** defaults to `sqlite:///./tender.db` → `/app/tender.db` = **ephemeral** (wiped on every
  redeploy/restart). To persist accounts + tenders, mount a **Fly volume** and point `DATABASE_URL` at it.
- **Uploads** live at `/app/data/uploads` (hardcoded, relative to the code) = ephemeral. Persisting them
  is optional for a single demo session (the machine stays up), but nice-to-have (mount the same volume
  at `/app/data`). If you skip it, just don't redeploy after uploading the demo tender.
- **CORS**: `main.py` already allows `*.vercel.app` by regex **plus** anything in `CORS_ORIGINS`
  (comma-separated). We must add `https://bidframe.org,https://www.bidframe.org` there.

---

## Step 1 — Install + auth
```bash
# install flyctl (macOS: brew install flyctl · Windows: iwr https://fly.io/install.ps1 -useb | iex)
fly auth signup      # or: fly auth login  (a card is required even on the free allowance)
```

## Step 2 — Launch the app (from repo root, don't deploy yet)
```bash
# run from the repository root, not backend/ — the Docker build needs backend/ + engine/
fly launch --no-deploy --dockerfile backend/Dockerfile --name bidframe-api --region lhr
```
- Pick region `lhr` (London) — closest to the UK judges / bidframe.org.
- When it asks about a Postgres/Redis/DB — **say no** (we use SQLite on a volume).
- Keep/write `fly.toml` at the repo root. Open it and make sure:
  - `internal_port = 8000` (the container listens on `$PORT`, default 8000)
  - `force_https = true`
  - under `[[vm]]`/`[http_service]`: set **`min_machines_running = 1`** so it never scales to zero
    (keeps the SQLite machine + sessions warm — no cold-start mid-demo).

## Step 3 — Persistent volume (so accounts/tenders survive)
```bash
fly volumes create bidframe_data --region lhr --size 1     # 1 GB is plenty
```
Then in root `fly.toml` add a mount:
```toml
[mounts]
  source = "bidframe_data"
  destination = "/data"
```
(Optional, to persist uploaded files too: also copy the demo upload onto `/data` or set the upload dir
there — for a single recorded session, mounting for the DB alone is enough.)

## Step 4 — Secrets (env) — set BEFORE first deploy
```bash
fly secrets set \
  AUTH_SECRET="$(python -c 'import secrets; print(secrets.token_urlsafe(48))')" \
  OPENAI_API_KEY="sk-...our-key..." \
  LLM_MODEL="gpt-4o" \
  DATABASE_URL="sqlite:////data/tender.db" \
  CORS_ORIGINS="https://bidframe.org,https://www.bidframe.org"
```
Note the **four** slashes in `sqlite:////data/tender.db` = absolute path `/data/tender.db` on the volume.

## Step 5 — Deploy
```bash
fly deploy
```
Wait for it to go healthy, then smoke-test:
```bash
curl https://bidframe-api.fly.dev/health      # → {"status":"ok","extractor":"openai"}
```
(`extractor` should say `openai` now the key is set — that confirms real extraction, not heuristic.)

## Step 6 — Create the two demo accounts (on the live machine)
```bash
fly ssh console
# inside the container:
cd /app/backend
python -m app.admin create-user alice@bidframe.co.uk --name "Alice Bidmanager" --password alicepw123
python -m app.admin create-user bob@bidframe.co.uk   --name "Bob Compliance"   --password bobpw12345
exit
```
Because the DB is on the volume, these survive restarts. **Do these AFTER the deploy in Step 5.**

## Step 7 — Point the frontend (Vercel) at Fly
In the **Vercel** project (bidframe.org): Settings → Environment Variables →
```
NEXT_PUBLIC_API_BASE_URL = https://bidframe-api.fly.dev
```
Then **Redeploy** the frontend (a rebuild — env vars only take effect on a fresh build). This is a Vercel
build, unaffected by Render's minute wall.

## Step 8 — End-to-end acceptance (the actual collab demo)
1. Open `https://bidframe.org` → sign in as **Alice** → upload a tender → wait for extraction.
2. **Share** the tender to `bob@bidframe.co.uk`.
3. In a second browser/profile, sign in as **Bob** → open the same tender (must be 200, not 404).
4. Both approve/edit/flag rows → confirm **"Approved by Alice / Bob"** attribution, the **activity feed**
   updating, and **member avatars** — all real, persisted, un-forgeable (actor is stamped server-side).

---

## Gotchas / notes
- **Don't redeploy after Step 6** unless you must — a redeploy is fine for the DB (it's on the volume) but
  wipes the ephemeral uploads dir unless you mounted `/data` for uploads too.
- **`extractor` says `heuristic`?** The `OPENAI_API_KEY` secret didn't take — re-set it and `fly deploy`.
- **CORS error in the browser console on bidframe.org?** `CORS_ORIGINS` is missing/misspelled — it must be
  the exact origins `https://bidframe.org,https://www.bidframe.org`; re-set the secret + redeploy.
- **Extraction is slow** (gpt-4o, rate-limited key → minutes per upload). Fine for collab (upload once,
  then collaborate). The instant mixed-pack view is already frozen at `/pack` — don't try to live-upload
  a huge pack on camera.
- **Invite-only**: there's no signup, so only accounts you create via Step 6 can log in. That's expected.

## Fallback
If Fly fights back and time is short, **localhost is identical and 5 minutes**: run `uvicorn app.main:app`
+ the frontend with `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`, create Alice + Bob with the same
admin commands, record locally. Same product, zero deploy risk.
