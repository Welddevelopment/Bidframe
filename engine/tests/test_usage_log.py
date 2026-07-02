"""Regression tests for engine/usage_log.py — OpenAI spend visibility (J-055/J-058).

Pins the cost maths + the cross-process ledger so our only window on the shared key's
spend can't silently break. No API calls — a fake response object carries the usage.
"""
import importlib

usage_log = importlib.import_module("engine.usage_log")


class _Usage:
    def __init__(self, p, c):
        self.prompt_tokens = p
        self.completion_tokens = c
        self.total_tokens = p + c


class _Resp:
    def __init__(self, p, c):
        self.usage = _Usage(p, c)


def test_cost_gpt4o():
    # gpt-4o: 2.50 / 10.00 per 1M -> 1000 prompt + 500 completion
    assert usage_log._cost("gpt-4o", 1000, 500) == 1000 / 1e6 * 2.50 + 500 / 1e6 * 10.00


def test_cost_unknown_model_is_zero():
    assert usage_log._cost("some-future-model", 1000, 500) == 0.0


def test_log_usage_appends_to_ledger(tmp_path, monkeypatch):
    ledger = tmp_path / "usage-ledger.jsonl"
    monkeypatch.setattr(usage_log, "LEDGER_PATH", ledger)
    usage_log.log_usage(_Resp(1000, 500), "gpt-4o", "extract chunk=c001")
    usage_log.log_usage(_Resp(2000, 0), "gpt-4o-mini", "gap-interview")
    total = usage_log.read_total(ledger)
    assert total["calls"] == 2
    assert total["total_usd"] > 0
    assert set(total["by_model"]) == {"gpt-4o", "gpt-4o-mini"}


def test_log_usage_no_usage_is_safe(tmp_path, monkeypatch):
    monkeypatch.setattr(usage_log, "LEDGER_PATH", tmp_path / "l.jsonl")

    class _Empty:
        usage = None

    usage_log.log_usage(_Empty(), "gpt-4o", "x")  # must not raise
    assert usage_log.read_total(tmp_path / "l.jsonl")["calls"] == 0


def test_read_total_missing_ledger_is_empty(tmp_path):
    assert usage_log.read_total(tmp_path / "nope.jsonl") == {
        "total_usd": 0.0, "calls": 0, "by_model": {}
    }
