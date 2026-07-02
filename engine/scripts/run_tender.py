"""run_tender.py — the real closed loop on a real tender.

PDF --(backend ingest/chunk/extract)--> raw extraction list
    --(engine.reconcile)--> clean final requirements
    --(engine.eval vs a gold CSV)--> the headline accuracy number.

This is the Generalist loop wired to the backend's real extractor (read-only use
of backend.app), proving the harness end to end on an actual tender — no API key
needed (heuristic extractor) and no backend server.

Usage (from repo root):
  python -m engine.scripts.run_tender data/tenders/spso-cleaning.pdf \
      gold-set/spso-cleaning.labels.csv --tender-id spso \
      --title "SPSO Cleaning Services ITT" --max-page 6 --out-dir engine/out
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

# Read-only use of the backend's extraction pipeline (the intended integration point).
from backend.app.chunk import chunk_doc
from backend.app.extract import get_extractor
from backend.app.ingest import ingest_pdf

from engine._io import write_json
from engine.eval import _render, format_report, load_gold_csv
from engine.reconcile import reconcile


def raw_envelope_from_pdf(pdf_path: str, tender_id: str, title: str) -> tuple[dict, str]:
    doc = ingest_pdf(pdf_path)
    chunks = chunk_doc(doc)
    extractor = get_extractor()
    raws: list[dict] = []
    for chunk in chunks:
        raws.extend(extractor.extract_chunk(chunk))
    envelope = {
        "tender_id": tender_id,
        "title": title,
        "source_filename": Path(pdf_path).name,
        "raw_requirements": raws,
    }
    return envelope, extractor.name


def main(argv) -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass
    p = argparse.ArgumentParser(prog="engine.scripts.run_tender")
    p.add_argument("pdf", help="path to the tender PDF")
    p.add_argument("gold_csv", help="path to the gold-set CSV")
    p.add_argument("--tender-id", default="tender")
    p.add_argument("--title", default="")
    p.add_argument("--min-page", type=int, default=1)
    p.add_argument("--max-page", type=int, default=None,
                   help="score only tool output up to this page (match the gold's labelled scope)")
    p.add_argument("--out-dir", default=None, help="write raw/final/report/eval JSON here")
    args = p.parse_args(argv[1:])

    envelope, extractor_name = raw_envelope_from_pdf(args.pdf, args.tender_id, args.title)
    from engine.embeddings import build_index
    embed_index = build_index([r.get("text", "") for r in envelope.get("raw_requirements", [])])
    final, report = reconcile(envelope, embed_index)

    # Scope the tool output to the gold's labelled page range for a fair comparison.
    reqs = final["requirements"]
    if args.max_page is not None:
        reqs = [r for r in reqs
                if r["source_page"] is not None and args.min_page <= r["source_page"] <= args.max_page]
    scoped = {**final, "requirements": reqs}

    gold = load_gold_csv(args.gold_csv, tender_id=args.tender_id)
    rep = format_report(gold, scoped)

    print(f"=== {args.title or args.tender_id} — REAL eval ===")
    print(f"extractor: {extractor_name}   raw candidates: {len(envelope['raw_requirements'])}   "
          f"reconciled: {len(final['requirements'])}   scored (pp.{args.min_page}-{args.max_page}): {len(reqs)}")
    print(f"gold requirements: {len(gold['requirements'])}")
    print(_render(rep))
    print("\nMISSES (gold requirements the tool did not match):")
    for m in rep["misses"]:
        flag = " [GATING]" if m["is_gating"] else ""
        print(f"  - {m['gold_id']} (p{m['source_page']}){flag}: {m['text']}")

    if args.out_dir:
        out = Path(args.out_dir)
        out.mkdir(parents=True, exist_ok=True)
        write_json(out / f"{args.tender_id}.raw.json", envelope)
        write_json(out / f"{args.tender_id}.final.json", final)
        write_json(out / f"{args.tender_id}.report.json", report)
        write_json(out / f"{args.tender_id}.eval.json", rep)
        print(f"\nartifacts -> {out}/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
