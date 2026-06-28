# Tender Breakdown

Extracts requirements from UK public-sector tender PDFs and presents them in a
**compliance matrix** for bid managers to review. Conduct "Make Legacy Move" hackathon (7-day build).

Deal-breakers jump out, uncertain items look hesitant, confidence is shown visually — not as raw numbers.

## Repo layout

```
/frontend     Next.js 16 + React 19 + Tailwind 4 — compliance matrix UI
/backend      Python + FastAPI — PDF ingest, extraction, REST API
*.md          Plan + per-role briefs (see below)
```

## Read first

| Doc | What it is |
|-----|------------|
| [tender-master-plan.md](tender-master-plan.md) | Source of truth: pipeline, schema, scoring |
| [AGENTS.md](AGENTS.md) | Locked data contract + conventions |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Git workflow — read before you push |
| `role-*.md` | Your day-by-day brief |

## Run the frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

## Run the backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload                        # http://localhost:8000
```

## The one rule

The **requirement schema is locked** (see [AGENTS.md](AGENTS.md)). Frontend builds against mock
data in that exact shape; backend produces it for real. Don't change it without team agreement.
