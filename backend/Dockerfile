# Portable container for the Bidframe backend (Railway / Fly / Cloud Run / anywhere).
# Render users don't need this — use ../render.yaml instead.
#
# BUILD CONTEXT MUST BE THE REPO ROOT, not backend/ (`docker build -f backend/Dockerfile .`
# from the repo root, or `fly launch --dockerfile backend/Dockerfile` run from the repo root).
# engine/ is a sibling of backend/ and backend/app/pipeline.py imports it
# (`from engine.reconcile import ...`) for the real reconcile/gating-net/autofill — a
# backend/-only build context can't see it and the API silently falls back to the thin
# placeholder engine, catching 0 disqualifiers (this bit Render once, G-009 — don't repeat it).
FROM python:3.12-slim

WORKDIR /app

# Install deps first for layer caching.
COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ backend/
COPY engine/ engine/

# Hosts inject $PORT; default to 8000 for local `docker run -p 8000:8000`.
ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT}"]
