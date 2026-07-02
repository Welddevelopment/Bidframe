"""Regression tests for source_rect highlight coordinates (J-049 P3, backend/app/pipeline.py).

Pins the tiered _search_rects fallback (full excerpt -> first sentence -> first N words)
and the additive schema field, so the frontend's exact-line highlight keeps getting
coordinates. Builds tiny in-memory PDFs via PyMuPDF — no fixture files, no API key.

Skipped in a pure-engine checkout (needs the backend package + fitz).
"""
import pytest

pipeline = pytest.importorskip("backend.app.pipeline")
schema = pytest.importorskip("backend.app.schema")
fitz = pytest.importorskip("fitz")


def _one_page(text: str):
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 100), text, fontsize=11)
    return doc, page


def test_search_rects_finds_full_excerpt_exact():
    doc, page = _one_page("The Contractor shall provide all cleaning equipment.")
    rects, match = pipeline._search_rects(page, "The Contractor shall provide all cleaning equipment.")
    doc.close()
    assert rects and len(rects[0]) == 4  # a fitz Rect is x0,y0,x1,y1
    assert match == "exact"


def test_search_rects_prefix_fallback_is_approx():
    # the page has only the opening; the excerpt's tail isn't present -> full search
    # fails, but the first-N-words fallback still locates the line, flagged approximate.
    doc, page = _one_page("The Contractor shall provide staff")
    excerpt = "The Contractor shall provide staff for the whole contract term at every listed site."
    rects, match = pipeline._search_rects(page, excerpt)
    doc.close()
    assert rects is not None
    assert match == "approx"


def test_search_rects_returns_none_when_absent():
    doc, page = _one_page("Entirely unrelated page content about badgers.")
    rects, match = pipeline._search_rects(page, "The Contractor shall hold ISO 9001 certification.")
    doc.close()
    assert rects is None and match is None


def test_search_rects_ignores_too_short_excerpt():
    doc, page = _one_page("The Contractor shall provide staff.")
    assert pipeline._search_rects(page, "and") == (None, None)
    doc.close()


def test_attach_source_rects_fills_and_is_guarded(tmp_path):
    # end-to-end: a real (tiny) PDF on disk -> _attach_source_rects mutates in place.
    pdf_path = tmp_path / "d1.pdf"
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 100), "The supplier must hold valid insurance.", fontsize=11)
    doc.save(str(pdf_path))
    doc.close()

    req = schema.Requirement(
        id="t-r0001", text="hold insurance", source_page=1,
        source_excerpt="The supplier must hold valid insurance.",
        type="mandatory", is_gating=False, category="insurance", confidence=0.8,
        source_doc_id="d1", source_filename="d1.pdf",
    )
    pipeline._attach_source_rects([req], [("d1", str(pdf_path), "d1.pdf")])
    assert req.source_rect and len(req.source_rect[0]) == 4
    assert req.source_rect_match == "exact"


def test_attach_source_rects_missing_doc_leaves_none():
    req = schema.Requirement(
        id="t-r0001", text="x", source_page=1, source_excerpt="something",
        type="mandatory", is_gating=False, category="other", confidence=0.5,
        source_doc_id="d9",
    )
    # no matching doc path -> stays None, never raises
    pipeline._attach_source_rects([req], [("d1", "/no/such.pdf", "d1.pdf")])
    assert req.source_rect is None


def test_schema_source_rect_is_optional():
    r = schema.Requirement(
        id="t-r0001", text="x", source_page=1, source_excerpt="y",
        type="mandatory", is_gating=False, category="other", confidence=0.5,
    )
    assert r.source_rect is None  # nullable/additive — nothing breaks without it
