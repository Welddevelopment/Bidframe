"""parse_check.py — hour-one tender sanity check.

Answers ONE question fast: "will this tender PDF give us clean, page-numbered text,
or is it an image-only scan we'd need OCR for?" Run it the moment a tender lands —
if it fails, grab a different tender rather than burning the day on a pathological PDF.

    python backend/scripts/parse_check.py path/to/tender.pdf
    python backend/scripts/parse_check.py path/to/folder/      # checks every *.pdf

Prefers PyMuPDF (fitz) — the engine our real pipeline uses — and falls back to pypdf
(already in requirements.txt) so it runs even before PyMuPDF is installed.

NOTE: written by J as temporary cover while backend ramps up. Backend owns the real
ingest/chunk/extract — this is just the go/no-go gate on a tender's parseability.
Not wired into the API; standalone by design.
"""

from __future__ import annotations

import sys
from pathlib import Path

# Per-page text below this many characters → probably image-only / needs OCR.
MIN_CHARS_PER_PAGE = 100
# A tender with almost no extractable text overall is unusable as-is.
MIN_TOTAL_CHARS = 500


def _extract_with_fitz(pdf_path: Path) -> list[str] | None:
    """Return per-page text using PyMuPDF, or None if it isn't installed."""
    try:
        import fitz  # PyMuPDF
    except ImportError:
        return None
    pages: list[str] = []
    with fitz.open(str(pdf_path)) as doc:
        for page in doc:
            pages.append(page.get_text("text"))
    return pages


def _extract_with_pypdf(pdf_path: Path) -> list[str] | None:
    """Fallback per-page text using pypdf, or None if it isn't installed."""
    try:
        from pypdf import PdfReader
    except ImportError:
        return None
    reader = PdfReader(str(pdf_path))
    return [(page.extract_text() or "") for page in reader.pages]


def check_pdf(pdf_path: Path) -> bool:
    """Print a verdict for one PDF. Return True if it's a usable text tender."""
    print(f"\n=== {pdf_path.name} ===")

    engine = "PyMuPDF (fitz)"
    pages = _extract_with_fitz(pdf_path)
    if pages is None:
        engine = "pypdf (fallback)"
        pages = _extract_with_pypdf(pdf_path)
    if pages is None:
        print("  ✗ Neither PyMuPDF nor pypdf is installed.")
        print("    Install one:  pip install pymupdf   (preferred)   |   pip install pypdf")
        return False

    page_count = len(pages)
    if page_count == 0:
        print(f"  ⚠️  {engine}: 0 pages — corrupt or unreadable PDF. Grab another.")
        return False

    per_page_chars = [len(t.strip()) for t in pages]
    total_chars = sum(per_page_chars)
    avg_chars = total_chars / page_count
    text_pages = sum(1 for c in per_page_chars if c >= MIN_CHARS_PER_PAGE)
    empty_pages = sum(1 for c in per_page_chars if c == 0)
    digit_heavy = _count_digit_heavy_pages(pages)

    print(f"  engine:      {engine}")
    print(f"  pages:       {page_count}  (page numbers intact: 1..{page_count})")
    print(f"  text:        {total_chars:,} chars total · {avg_chars:,.0f} avg/page")
    print(f"  text pages:  {text_pages}/{page_count} have real text "
          f"(>= {MIN_CHARS_PER_PAGE} chars)")
    if empty_pages:
        print(f"  empty pages: {empty_pages} (could be image-only / section dividers)")
    if digit_heavy:
        print(f"  table-ish:   {digit_heavy} page(s) look digit/table-heavy — "
              f"flag for the pdfplumber fallback later")

    # --- verdict ---
    if total_chars < MIN_TOTAL_CHARS or text_pages == 0:
        print("  ⚠️  VERDICT: looks IMAGE-ONLY / needs OCR. Not usable as-is — "
              "grab a different tender.")
        return False
    if text_pages < page_count * 0.5:
        print("  ⚠️  VERDICT: USABLE but patchy — over half the pages are sparse. "
              "OK as an 'ugly' test tender; not the clean hero.")
        return True

    print("  ✅ VERDICT: clean text PDF — good input for extraction.")
    _print_sample(pages)
    return True


def _count_digit_heavy_pages(pages: list[str]) -> int:
    """Rough heuristic: pages where digits are a large share of non-space chars
    often = tables/pricing schedules (where requirements hide). Worth flagging."""
    count = 0
    for text in pages:
        compact = [ch for ch in text if not ch.isspace()]
        if len(compact) < 50:
            continue
        digit_ratio = sum(ch.isdigit() for ch in compact) / len(compact)
        if digit_ratio > 0.20:
            count += 1
    return count


def _print_sample(pages: list[str]) -> None:
    """Show a snippet from a middle page so a human can eyeball grounding quality."""
    mid = len(pages) // 2
    snippet = " ".join(pages[mid].split())[:240]
    if snippet:
        print(f"  sample (p.{mid + 1}): \"{snippet}…\"")


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print(__doc__)
        return 2

    target = Path(argv[1])
    if not target.exists():
        print(f"Path not found: {target}")
        return 2

    pdfs = sorted(target.glob("*.pdf")) if target.is_dir() else [target]
    if not pdfs:
        print(f"No PDFs found in {target}")
        return 2

    results = [check_pdf(p) for p in pdfs]
    usable = sum(results)
    print(f"\n{usable}/{len(results)} tender(s) usable as-is.")
    # Exit 0 if at least one tender is usable, else 1 — handy for scripting.
    return 0 if usable else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
