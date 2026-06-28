"""Pytest config for engine tests. Run from repo root: python -m pytest engine/tests/ -v"""
from __future__ import annotations

import json
from pathlib import Path

import pytest

FIXTURES = Path(__file__).parent / "fixtures"


def _load(name: str) -> dict:
    with open(FIXTURES / name, encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture
def raw_envelope() -> dict:
    return _load("mock_raw_extraction.json")


@pytest.fixture
def golden_final() -> dict:
    return _load("golden_final.json")
