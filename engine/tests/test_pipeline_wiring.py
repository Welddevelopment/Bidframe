"""Integration: the backend pipeline now uses the generalist engine for reconcile + routing.

Lives in the generalist lane because it pins MY wiring of engine.reconcile into
backend/app/pipeline.py (the explicitly-delegated `_reconcile` + `_route_confidence`).
"""
import json
from pathlib import Path

from backend.app import pipeline

REPO_ROOT = Path(__file__).resolve().parents[2]
MOCK_RAW = REPO_ROOT / "engine" / "tests" / "fixtures" / "mock_raw_extraction.json"


def test_engine_is_wired_in():
    assert pipeline._HAVE_ENGINE is True


def test_reconcile_uses_engine_conservative_merge():
    raws = json.loads(MOCK_RAW.read_text(encoding="utf-8"))["raw_requirements"]
    out = pipeline._reconcile(raws)
    # engine merges only the ISO cross-chunk dupe: 6 -> 5
    assert len(out) == 5
    # the merged ISO item carries the noisy-OR confidence (engine), not a raw passthrough
    iso = [r for r in out if "ISO 9001" in r["text"]]
    assert len(iso) == 1
    assert iso[0]["confidence"] == 0.9928


def test_route_confidence_uses_engine_threshold():
    assert pipeline._route_confidence("mandatory", 0.62) is True    # < 0.75
    assert pipeline._route_confidence("mandatory", 0.80) is False   # >= 0.75
