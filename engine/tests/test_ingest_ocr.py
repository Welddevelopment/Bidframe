"""Deterministic test of the scanned/image-only-PDF vision-OCR fallback in backend.app.ingest.

Mocks the OpenAI vision client, so it needs NO key and NO network — it verifies the *plumbing*:
a page with no text layer is detected as sparse, sent through the vision path, and its recovered
text replaces the empty page. (The real end-to-end run against gpt-4o is exercised manually; this
locks the guard/trigger logic so a refactor can't silently disable OCR.)
"""
from __future__ import annotations

import fitz  # PyMuPDF
import pytest

from backend.app import ingest
from backend.app.ingest import SPARSE_PAGE_CHARS, _recover_sparse_with_vision

_OCR_TEXT = (
    "RECOVERED BY OCR: The tenderer must hold Public Liability insurance of at least "
    "five million pounds, and the tender must be returned by the stated deadline. "
) * 2


class _FakeResp:
    class _Choice:
        class _Msg:
            content = _OCR_TEXT
        message = _Msg()
    choices = [_Choice()]


class _FakeClient:
    class _Chat:
        class _Completions:
            def create(self, **_kw):
                return _FakeResp()
        completions = _Completions()
    chat = _Chat()


def _image_only_pdf(path: str) -> None:
    """Write a 1-page PDF that is a rasterised image with NO text layer."""
    scratch = fitz.open()
    pg = scratch.new_page()
    pg.insert_text((72, 100), "A scanned tender page — this text is baked into pixels only.")
    pix = pg.get_pixmap(dpi=110)
    scratch.close()
    out = fitz.open()
    page = out.new_page(width=pix.width, height=pix.height)
    page.insert_image(page.rect, pixmap=pix)
    out.save(path)
    out.close()


def test_vision_ocr_recovers_a_scanned_page(tmp_path, monkeypatch):
    pdf = tmp_path / "scanned.pdf"
    _image_only_pdf(str(pdf))

    # precondition: the page genuinely has no extractable text layer
    doc = fitz.open(str(pdf))
    assert len(doc[0].get_text().strip()) < SPARSE_PAGE_CHARS
    doc.close()

    # mock the key + the vision client + usage logging (no network, no real key)
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    import openai
    monkeypatch.setattr(openai, "OpenAI", lambda *a, **k: _FakeClient())
    monkeypatch.setattr(ingest, "_log_usage", lambda *a, **k: None)

    recovered = _recover_sparse_with_vision(pdf, [""])  # one sparse (empty) page
    assert "RECOVERED BY OCR" in recovered[0]
    assert len(recovered[0].strip()) > SPARSE_PAGE_CHARS


def test_ocr_is_a_noop_without_a_key(tmp_path, monkeypatch):
    """The OCR path must never fire (or fail) when there's no key — the pipeline stays offline-safe."""
    pdf = tmp_path / "scanned.pdf"
    _image_only_pdf(str(pdf))
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    out = _recover_sparse_with_vision(pdf, ["   "])
    assert out == ["   "]  # unchanged — no key, no OCR, no crash
