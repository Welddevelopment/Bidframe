"""Tender Breakdown API — FastAPI app.

Route shapes match the locked data contract in AGENTS.md so the frontend can swap
its mock data for these endpoints without UI changes.

Pipeline (ingest → chunk → extract → store) is scaffolded by J as backend cover.
Extraction is pluggable: heuristic with no key, Claude when ANTHROPIC_API_KEY is set.
"""

from __future__ import annotations

import os
import shutil
import uuid
from pathlib import Path

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .extract import get_extractor
from .pipeline import run_pipeline
from .schema import DecisionUpdate, Requirement, TenderResponse
from . import store

app = FastAPI(title="Tender Breakdown API")

# CORS: allow local dev (:3000) + any *.vercel.app deployment (the live frontend +
# its preview builds), plus anything in CORS_ORIGINS (comma-separated) for a custom domain.
_origins = ["http://localhost:3000"]
_origins += [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path(__file__).resolve().parent.parent / "data" / "uploads"


@app.on_event("startup")
def _startup() -> None:
    store.init_db()
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@app.get("/health")
def health():
    return {"status": "ok", "extractor": get_extractor().name}


@app.post("/tenders/upload")
async def upload_tender(file: UploadFile = File(...), title: str = Form(None)):
    """Ingest a PDF, run the extraction pipeline, persist, return { tender_id }."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF.")

    tender_id = f"tnd-{uuid.uuid4().hex[:8]}"
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)   # robust even if startup didn't run
    store.init_db()
    dest = UPLOAD_DIR / f"{tender_id}.pdf"
    with dest.open("wb") as out:
        shutil.copyfileobj(file.file, out)

    resp = run_pipeline(
        str(dest), tender_id=tender_id, title=title or file.filename
    )
    store.save_tender(resp, filename=file.filename)
    return {"tender_id": tender_id, "requirement_count": len(resp.requirements)}


@app.get("/tenders/{tender_id}/requirements", response_model=TenderResponse)
def get_requirements(tender_id: str):
    """Return { tender_id, title, requirements: [...] } in the locked schema."""
    resp = store.get_tender(tender_id)
    if resp is None:
        raise HTTPException(status_code=404, detail="Tender not found.")
    return resp


@app.patch("/requirements/{req_id}", response_model=Requirement)
def update_requirement(req_id: str, update: DecisionUpdate):
    """Update status + decision for one requirement."""
    req = store.update_requirement(req_id, update)
    if req is None:
        raise HTTPException(status_code=404, detail="Requirement not found.")
    return req
