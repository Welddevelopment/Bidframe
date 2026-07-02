"""Regression tests for backend/app/extract_cache.py — content-addressed extraction cache.

Pins: opt-in (off by default = no caching), a hit returns identical raw data, and the
key changes when the chunk text or extractor identity changes (so stale output can't be
served after an ingest/prompt/model change). No API calls — a fake extractor + chunks.
"""
import pytest

extract_cache = pytest.importorskip("backend.app.extract_cache")


class _Chunk:
    def __init__(self, text):
        self.text = text


class _Extractor:
    name = "heuristic"


def _chunks():
    return [_Chunk("The Contractor shall provide staff."), _Chunk("Records must be kept.")]


def test_disabled_by_default(monkeypatch):
    monkeypatch.delenv("EXTRACT_CACHE", raising=False)
    assert extract_cache.enabled() is False
    # load/save are no-ops when disabled
    assert extract_cache.load(_chunks(), _Extractor()) is None


def test_round_trip_hit(monkeypatch, tmp_path):
    monkeypatch.setenv("EXTRACT_CACHE", "1")
    monkeypatch.setattr(extract_cache, "CACHE_DIR", tmp_path / "cache")
    ch, ex = _chunks(), _Extractor()
    raws = [{"raw_id": "raw-c001-0000", "text": "x", "is_gating": False}]
    assert extract_cache.load(ch, ex) is None          # miss first
    extract_cache.save(ch, ex, raws)
    assert extract_cache.load(ch, ex) == raws           # hit returns identical data


def test_key_changes_with_chunk_text(monkeypatch, tmp_path):
    monkeypatch.setenv("EXTRACT_CACHE", "1")
    monkeypatch.setattr(extract_cache, "CACHE_DIR", tmp_path / "cache")
    ex = _extract = _Extractor()
    extract_cache.save(_chunks(), ex, [{"text": "a"}])
    # different chunk text -> different key -> miss (no stale serve)
    other = [_Chunk("Totally different content here.")]
    assert extract_cache.load(other, ex) is None


def test_key_changes_with_extractor_identity(monkeypatch, tmp_path):
    monkeypatch.setenv("EXTRACT_CACHE", "1")
    monkeypatch.setattr(extract_cache, "CACHE_DIR", tmp_path / "cache")
    ch = _chunks()
    extract_cache.save(ch, _Extractor(), [{"text": "a"}])

    class _Other:
        name = "openai"
        _model = "gpt-4o"

    assert extract_cache.load(ch, _Other()) is None


# ---- extraction concurrency knob (backend/app/pipeline._extract_concurrency) --
pipeline = pytest.importorskip("backend.app.pipeline")


def test_extract_concurrency_default_is_one(monkeypatch):
    monkeypatch.delenv("EXTRACT_CONCURRENCY", raising=False)
    assert pipeline._extract_concurrency() == 1


def test_extract_concurrency_reads_env(monkeypatch):
    monkeypatch.setenv("EXTRACT_CONCURRENCY", "6")
    assert pipeline._extract_concurrency() == 6


def test_extract_concurrency_clamps_and_survives_garbage(monkeypatch):
    monkeypatch.setenv("EXTRACT_CONCURRENCY", "999")
    assert pipeline._extract_concurrency() == 16      # clamped high
    monkeypatch.setenv("EXTRACT_CONCURRENCY", "0")
    assert pipeline._extract_concurrency() == 1       # clamped low
    monkeypatch.setenv("EXTRACT_CONCURRENCY", "nonsense")
    assert pipeline._extract_concurrency() == 1       # garbage -> safe default


# ---- within-doc exact dedup (backend/app/pipeline._dedup_exact) --------------

def test_dedup_exact_collapses_verbatim_repeats():
    raws = [
        {"text": "The Contractor shall provide staff.", "source_page": 3},
        {"text": "the contractor SHALL provide  staff.", "source_page": 4},  # overlap copy
        {"text": "Records must be kept on site.", "source_page": 3},
    ]
    out = pipeline._dedup_exact(raws)
    assert len(out) == 2
    assert out[0]["source_page"] == 3  # keeps the first (earliest) occurrence


def test_dedup_exact_keeps_distinct():
    raws = [{"text": "A shall do X."}, {"text": "B shall do Y."}]
    assert len(pipeline._dedup_exact(raws)) == 2
