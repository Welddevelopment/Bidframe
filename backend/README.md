# Backend — Tender Breakdown API

FastAPI service: PDF ingest → extract → classify → REST API. SQLite for storage.

## Run

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env             # fill in keys
uvicorn app.main:app --reload    # http://localhost:8000  ·  docs at /docs
```

Check it's alive: `curl http://localhost:8000/health`

## Endpoints (locked shapes — see ../AGENTS.md)

| Method | Path | Does |
|--------|------|------|
| `POST` | `/tenders/upload` | Ingest a PDF → `{ tender_id }` |
| `GET`  | `/tenders/{id}/requirements` | Requirement list in locked schema |
| `PATCH`| `/requirements/{id}` | Update status + decision |

`app/main.py` has these stubbed (`NotImplementedError`). Fill them in — keep the
response shapes matching the schema so frontend swaps mock → real with no UI change.
