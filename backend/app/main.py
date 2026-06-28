"""Tender Breakdown API — minimal skeleton.

Backend owner: flesh out ingest/extract/classify. The route shapes below match
the locked data contract in AGENTS.md — keep them stable so frontend can swap
its mock data for these endpoints without UI changes.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Tender Breakdown API")

# Frontend dev server runs on :3000 — allow it during the hackathon.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


# ---- Locked endpoints (see AGENTS.md) — TODO: implement ----

@app.post("/tenders/upload")
def upload_tender():
    """Ingest a PDF, return { tender_id }."""
    raise NotImplementedError


@app.get("/tenders/{tender_id}/requirements")
def get_requirements(tender_id: str):
    """Return { tender_id, title, requirements: [...] } in the locked schema."""
    raise NotImplementedError


@app.patch("/requirements/{req_id}")
def update_requirement(req_id: str):
    """Update status + decision for one requirement."""
    raise NotImplementedError
