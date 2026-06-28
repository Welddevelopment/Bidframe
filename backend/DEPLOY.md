# Deploying the Bidframe backend

Goal: get the API on a public URL so the deployed frontend (Vercel) can call it. The **heuristic
extractor needs no API key**, so the deployed API works the moment it's up — add the OpenAI key later.

## Option A — Render (easiest, one-click)

1. Push is already done — the blueprint is `render.yaml` at the repo root.
2. Go to **https://render.com** → sign up (free) → **New + → Blueprint**.
3. **Connect this GitHub repo.** Render reads `render.yaml` and proposes the `bidframe-api` service.
4. Click **Apply / Deploy**. First build takes ~2-3 min.
5. You get a URL like `https://bidframe-api.onrender.com`. Check it: open `…/health` → should show
   `{"status":"ok","extractor":"heuristic"}`. API docs at `…/docs`.
6. **Give that URL to the frontend** (see `../frontend-integration.md`).
7. *(Later)* To switch to GPT extraction: Render dashboard → the service → **Environment** →
   set `OPENAI_API_KEY` → save (it redeploys).

> Note: free tier sleeps after inactivity (first request after idle takes ~30s to wake) and SQLite
> resets on redeploy — both fine for a demo (just re-upload the tender). For the live demo, hit
> `/health` once a minute before showing it, or upload the tender fresh on stage.

## Option B — Docker (Railway / Fly / Cloud Run / local)

A `Dockerfile` is in this folder.

```bash
# local
cd backend
docker build -t bidframe-api .
docker run -p 8000:8000 bidframe-api      # http://localhost:8000/docs
```

Railway/Fly: point them at `backend/Dockerfile`. They inject `$PORT`; the container respects it.

## Option C — just run it locally for the demo (most reliable)

No deploy needed if you demo on one laptop:

```bash
cd backend && pip install -r requirements.txt
uvicorn app.main:app --reload        # http://localhost:8000
```

…and run the frontend with `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`. CORS already allows
`localhost:3000`. This is the zero-surprises demo path.

## CORS (already handled)

The API allows `localhost:3000`, any `*.vercel.app` origin, and anything in the `CORS_ORIGINS` env var
(comma-separated) for a custom domain. So a Vercel-hosted frontend works with no extra config.
