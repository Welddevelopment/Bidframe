"""The closed Generalist loop: reconcile(mock raw) -> score vs mock.gold.json.

A real accuracy number from Generalist-owned pieces only, no backend. Reconcile
produces exactly the 5 true requirements, so it scores a clean 1.0 and surfaces
zero dangerous misses — proving the harness end to end.
"""
from pathlib import Path

from engine._io import read_json
from engine.eval import format_report, score
from engine.reconcile import reconcile

REPO_ROOT = Path(__file__).resolve().parents[2]
MOCK_GOLD = REPO_ROOT / "engine" / "gold" / "mock.gold.json"


def test_closed_loop_scores_perfect_on_mock(raw_envelope):
    gold = read_json(MOCK_GOLD)
    final, _ = reconcile(raw_envelope)
    s = score(gold, final)
    assert s["recall"] == 1.0
    assert s["precision"] == 1.0
    assert s["gating_recall"] == 1.0       # all 3 gold disqualifiers caught AND flagged


def test_closed_loop_has_no_dangerous_misses(raw_envelope):
    gold = read_json(MOCK_GOLD)
    final, _ = reconcile(raw_envelope)
    report = format_report(gold, final)
    assert sum(1 for m in report["misses"] if m["dangerous"]) == 0
