"""ingest.py — PDF → page-numbered text.

Step 1 of the pipeline. Turns a tender PDF into a list of Page objects, each with
its 1-based page number and extracted text. Page numbers are SACRED — they're what
makes every downstream requirement verifiable against its source.

Prefers PyMuPDF (fitz); falls back to pypdf if fitz isn't installed. (Same engine
logic proven by scripts/parse_check.py.)

Scaffolded by J as backend cover — backend owns hardening this (tables via pdfplumber
fallback, header/footer stripping, OCR detection for image-only pages).
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass
class Page:
    number: int   # 1-based page number, as a human would cite it
    text: str


@dataclass
class IngestedDoc:
    filename: str
    pages: list[Page]

    @property
    def page_count(self) -> int:
        return len(self.pages)

    @property
    def total_chars(self) -> int:
        return sum(len(p.text) for p in self.pages)

    def looks_image_only(self) -> bool:
        """True if there's almost no extractable text — likely a scan needing OCR."""
        return self.total_chars < 500 or not any(
            len(p.text.strip()) >= 100 for p in self.pages
        )


def _extract_with_fitz(pdf_path: Path) -> list[str] | None:
    try:
        import fitz  # PyMuPDF
    except ImportError:
        return None
    out: list[str] = []
    with fitz.open(str(pdf_path)) as doc:
        for page in doc:
            out.append(page.get_text("text"))
    return out


def _extract_with_pypdf(pdf_path: Path) -> list[str] | None:
    try:
        from pypdf import PdfReader
    except ImportError:
        return None
    reader = PdfReader(str(pdf_path))
    return [(page.extract_text() or "") for page in reader.pages]


def ingest_pdf(pdf_path: str | Path) -> IngestedDoc:
    """Read a PDF into page-numbered text. Raises on missing file / no PDF engine."""
    path = Path(pdf_path)
    if not path.exists():
        raise FileNotFoundError(f"PDF not found: {path}")

    raw_pages = _extract_with_fitz(path)
    if raw_pages is None:
        raw_pages = _extract_with_pypdf(path)
    if raw_pages is None:
        raise RuntimeError(
            "No PDF engine available. Install one: pip install pymupdf (preferred) or pypdf"
        )

    pages = [Page(number=i + 1, text=text) for i, text in enumerate(raw_pages)]
    return IngestedDoc(filename=path.name, pages=pages)
