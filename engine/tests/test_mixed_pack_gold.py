"""Mixed-pack gold scorer: the planted DOCX/XLSX/CSV gates stay measurable."""
from __future__ import annotations

import pytest

pytest.importorskip("docx")
pytest.importorskip("openpyxl")

from engine.scripts import mixed_pack_gold


def test_mixed_pack_gold_net_floor_has_no_dangerous_misses(capsys):
    assert mixed_pack_gold.main() == 0
    out = capsys.readouterr().out
    assert "gating recall 1.0 (7/7)" in out
    assert "dangerous misses 0" in out
