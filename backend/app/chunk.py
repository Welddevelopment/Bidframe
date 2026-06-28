"""chunk.py — page-aware overlapping chunker.

Step 2 (the anti-wrapper step). Splits the ingested doc into overlapping chunks
small enough for an LLM to read carefully, WITHOUT losing requirements at the
boundaries. Each chunk remembers the page range it came from, so extraction can
attribute every requirement to an accurate source_page.

We pack page-tagged paragraphs into chunks up to TARGET_CHARS, carrying a few
paragraphs of OVERLAP into the next chunk so a requirement split across a boundary
still appears whole in at least one chunk. Cross-chunk duplicates are expected and
fine — the generalist's reconcile step merges them.

Scaffolded by J as backend cover.
"""

from __future__ import annotations

from dataclasses import dataclass

from .ingest import IngestedDoc

TARGET_CHARS = 3000     # ~per-chunk size; small enough for careful extraction
OVERLAP_CHARS = 400     # carried into the next chunk so boundaries aren't lost


@dataclass
class _Block:
    page: int
    text: str


@dataclass
class Chunk:
    id: str             # "c001", "c002", ...
    text: str
    page_start: int
    page_end: int


def _split_into_blocks(doc: IngestedDoc) -> list[_Block]:
    """Break each page into paragraph-ish blocks tagged with their page number."""
    blocks: list[_Block] = []
    for page in doc.pages:
        # Split on blank lines; fall back to the whole page if it's one dense block.
        paras = [p.strip() for p in page.text.split("\n\n") if p.strip()]
        if not paras and page.text.strip():
            paras = [page.text.strip()]
        for para in paras:
            blocks.append(_Block(page=page.number, text=para))
    return blocks


def chunk_doc(doc: IngestedDoc) -> list[Chunk]:
    """Produce overlapping, page-ranged chunks from an ingested document."""
    blocks = _split_into_blocks(doc)
    chunks: list[Chunk] = []
    if not blocks:
        return chunks

    cur: list[_Block] = []
    cur_len = 0
    seq = 1

    def flush() -> list[_Block]:
        """Emit the current buffer as a chunk; return the tail blocks to overlap."""
        nonlocal seq
        if not cur:
            return []
        text = "\n\n".join(b.text for b in cur)
        chunks.append(
            Chunk(
                id=f"c{seq:03d}",
                text=text,
                page_start=cur[0].page,
                page_end=cur[-1].page,
            )
        )
        seq += 1
        # Build the overlap tail (last few blocks up to OVERLAP_CHARS).
        tail: list[_Block] = []
        tail_len = 0
        for b in reversed(cur):
            if tail_len >= OVERLAP_CHARS:
                break
            tail.insert(0, b)
            tail_len += len(b.text)
        return tail

    for block in blocks:
        # A single oversized block still goes in whole — never drop content.
        if cur_len + len(block.text) > TARGET_CHARS and cur:
            tail = flush()
            cur = list(tail)
            cur_len = sum(len(b.text) for b in cur)
        cur.append(block)
        cur_len += len(block.text)

    flush()
    return chunks
