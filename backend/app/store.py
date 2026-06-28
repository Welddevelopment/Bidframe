"""store.py — SQLite persistence (stdlib sqlite3, zero-config).

Persists tenders + their requirements, and updates a requirement's status/decision.
Requirements are stored as JSON blobs keyed by id so the schema can evolve without
migrations during the hackathon. The DB file is gitignored (*.db).

Scaffolded by J as backend cover. Backend can swap to SQLAlchemy later if wanted.
"""

from __future__ import annotations

import json
import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path

from .schema import DecisionUpdate, Requirement, TenderResponse


def _db_path() -> Path:
    # Accept DATABASE_URL=sqlite:///./tender.db (default) or a bare path.
    url = os.environ.get("DATABASE_URL", "sqlite:///./tender.db")
    if url.startswith("sqlite:///"):
        url = url[len("sqlite:///"):]
    return (Path(__file__).resolve().parent.parent / url).resolve()


@contextmanager
def _conn():
    conn = sqlite3.connect(_db_path())
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    with _conn() as c:
        c.executescript(
            """
            CREATE TABLE IF NOT EXISTS tenders (
                id       TEXT PRIMARY KEY,
                title    TEXT NOT NULL,
                filename TEXT
            );
            CREATE TABLE IF NOT EXISTS requirements (
                id        TEXT PRIMARY KEY,
                tender_id TEXT NOT NULL,
                seq       INTEGER NOT NULL,
                data      TEXT NOT NULL,
                FOREIGN KEY (tender_id) REFERENCES tenders(id)
            );
            """
        )


def save_tender(resp: TenderResponse, filename: str | None = None) -> None:
    with _conn() as c:
        c.execute(
            "INSERT OR REPLACE INTO tenders (id, title, filename) VALUES (?, ?, ?)",
            (resp.tender_id, resp.title, filename),
        )
        c.execute("DELETE FROM requirements WHERE tender_id = ?", (resp.tender_id,))
        for seq, req in enumerate(resp.requirements):
            c.execute(
                "INSERT INTO requirements (id, tender_id, seq, data) VALUES (?, ?, ?, ?)",
                (req.id, resp.tender_id, seq, req.model_dump_json()),
            )


def get_tender(tender_id: str) -> TenderResponse | None:
    with _conn() as c:
        trow = c.execute(
            "SELECT id, title FROM tenders WHERE id = ?", (tender_id,)
        ).fetchone()
        if trow is None:
            return None
        rows = c.execute(
            "SELECT data FROM requirements WHERE tender_id = ? ORDER BY seq", (tender_id,)
        ).fetchall()
    requirements = [Requirement(**json.loads(r["data"])) for r in rows]
    return TenderResponse(
        tender_id=trow["id"], title=trow["title"], requirements=requirements
    )


def update_requirement(req_id: str, update: DecisionUpdate) -> Requirement | None:
    with _conn() as c:
        row = c.execute(
            "SELECT data FROM requirements WHERE id = ?", (req_id,)
        ).fetchone()
        if row is None:
            return None
        req = Requirement(**json.loads(row["data"]))
        if update.status is not None:
            req.status = update.status
        if update.decision is not None:
            req.decision = update.decision
        c.execute(
            "UPDATE requirements SET data = ? WHERE id = ?",
            (req.model_dump_json(), req_id),
        )
    return req
