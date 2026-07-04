"""Regression lock for the deterministic deal-breaker floor (the demo's headline proof).

The deterministic net (`engine.gating_scan.scan_candidates`, no model) must flag EVERY hand-labelled
disqualifier in the validated gold sets. If a net tweak or a gold-set edit ever drops one, these tests
go red — so the "26/26, deterministic, reproducible" claim can't silently regress. Mirrors
`engine/scripts/net_floor.py` (draft gold sets excluded, same as eval_all)."""
from __future__ import annotations

import csv
import json
from pathlib import Path

from engine.gating_scan import scan_candidates

REPO_ROOT = Path(__file__).resolve().parents[2]
MANIFEST = REPO_ROOT / "gold-set" / "eval-manifest.json"

# The locked per-tender floor (validated gold sets only; WLWA is draft/in-progress → excluded).
EXPECTED = {
    "spso": 2,
    "museum": 10,
    "bradwell": 10,   # held-out
    "duffield": 4,    # held-out
}


def _gating_rows(path: Path) -> list[dict]:
    with open(path, encoding="utf-8") as f:
        lines = [ln for ln in f if not ln.lstrip().startswith("#")]
    return [
        r for r in csv.DictReader(lines)
        if (r.get("is_gating") or "").strip().lower() in ("yes", "y", "true", "1")
    ]


def _caught(rows: list[dict]) -> tuple[int, list[str]]:
    caught, misses = 0, []
    for r in rows:
        page = int(r["source_page"]) if (r.get("source_page") or "").strip().isdigit() else 1
        if scan_candidates([(page, r["text"])]):
            caught += 1
        else:
            misses.append(f'{r.get("id")}: {r["text"][:70]}')
    return caught, misses


def _tenders() -> dict[str, dict]:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    return {t["tender_id"]: t for t in manifest["tenders"]}


def test_manifest_marks_only_wlwa_as_draft():
    """If a new gold set is added as draft, EXPECTED must be revisited — this guards that."""
    drafts = {tid for tid, t in _tenders().items() if t.get("draft")}
    assert drafts == {"wlwa"}, f"unexpected draft gold sets: {drafts}"


def test_every_validated_tender_floor_is_complete():
    tenders = _tenders()
    for tid, expected in EXPECTED.items():
        gold = REPO_ROOT / tenders[tid]["gold"]
        rows = _gating_rows(gold)
        assert len(rows) == expected, f"{tid}: gold has {len(rows)} gating rows, expected {expected}"
        caught, misses = _caught(rows)
        assert caught == expected, f"{tid}: net caught {caught}/{expected}; misses: {misses}"


def test_aggregate_floor_is_26_of_26():
    tenders = _tenders()
    total_caught = total = 0
    for tid in EXPECTED:
        rows = _gating_rows(REPO_ROOT / tenders[tid]["gold"])
        caught, _ = _caught(rows)
        total_caught += caught
        total += len(rows)
    assert (total_caught, total) == (26, 26), f"deterministic floor is {total_caught}/{total}, expected 26/26"
