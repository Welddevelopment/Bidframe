# Portable container for the Bidframe backend (Railway / Fly / Cloud Run / anywhere).
# Render users don't need this — use ../render.yaml instead.
FROM python:3.12-slim

WORKDIR /app

# Install deps first for layer caching.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Hosts inject $PORT; default to 8000 for local `docker run -p 8000:8000`.
ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
