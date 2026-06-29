"""draft_answers.py — the auditable-autofill demo run.

Takes a requirement set (a reconcile final.json or a gold CSV) + the bidder's
capability docs, drafts a grounded answer for each requirement, and collapses the
gaps into a short question list. Prints the "drafted N answers, asked you M
questions" moment and (optionally) writes the enriched tender response.

Usage (from repo root):
  python -m engine.scripts.draft_answers --gold gold-set/spso-cleaning.labels.csv     # mock, free
  python -m engine.scripts.draft_answers --output engine/out/spso.final.json --provider openai
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from engine._io import read_json, write_json
from engine.answer import draft_all, get_answerer, load_capability_docs
from engine.eval import load_gold_csv

REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_CAP = REPO_ROOT / "engine" / "fixtures" / "capability"


def _requirements_from_gold(path: str) -> tuple[str, list[dict]]:
    gold = load_gold_csv(path)
    reqs = [{"id": g["gold_id"], "text": g["text"], "type": g.get("type", "mandatory"),
             "is_gating": g.get("is_gating", False), "source_clause": g.get("source_clause")}
            for g in gold["requirements"]]
    return gold.get("tender_id", "tender"), reqs


def main(argv) -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass
    p = argparse.ArgumentParser(prog="engine.scripts.draft_answers")
    src = p.add_mutually_exclusive_group(required=True)
    src.add_argument("--gold", help="a gold CSV to use as the requirement set")
    src.add_argument("--output", help="a reconcile final-envelope JSON")
    p.add_argument("--capability", default=str(DEFAULT_CAP), help="folder of capability .txt docs")
    p.add_argument("--provider", default=None, help="force LLM_PROVIDER (openai|mock)")
    p.add_argument("--limit", type=int, default=None, help="cap number of requirements (saves credits)")
    p.add_argument("--out", default=None, help="write the enriched tender response here")
    args = p.parse_args(argv[1:])
    if args.provider:
        os.environ["LLM_PROVIDER"] = args.provider

    if args.gold:
        tender_id, reqs = _requirements_from_gold(args.gold)
        title = tender_id
    else:
        final = read_json(args.output)
        tender_id, title = final.get("tender_id", "tender"), final.get("title", "")
        reqs = final.get("requirements", [])
    if args.limit:
        reqs = reqs[:args.limit]

    capability_docs = load_capability_docs(args.capability)
    answerer = get_answerer()
    enriched, questions = draft_all(reqs, capability_docs, answerer)

    auto = sum(1 for r in enriched if r["answer"]["state"] == "auto")
    gaps = sum(1 for r in enriched if r["answer"]["state"] == "needs_input")
    gating_gaps = sum(1 for q in questions if q["unblocks_gating"])

    print(f"=== Auditable autofill — {title or tender_id} (answerer: {answerer.name}) ===")
    print(f"{len(reqs)} requirements  ·  drafted {auto} grounded answers  ·  "
          f"{gaps} need your input  ·  {len(questions)} questions after dedupe "
          f"({gating_gaps} touch a disqualifier)\n")
    print("SAMPLE GROUNDED ANSWERS:")
    for r in enriched:
        if r["answer"]["state"] == "auto":
            cites = ", ".join(e["doc_id"] for e in r["answer"]["evidence_refs"])
            print(f"  [{r['id']}] {r['text'][:70]}")
            print(f"      -> {r['answer']['text'][:110]}  (cites: {cites})")
    print("\nQUESTIONS IT ASKED YOU:")
    for q in questions:
        flag = " [GATING]" if q["unblocks_gating"] else ""
        print(f"  - {q['question'][:100]}{flag}  (unblocks {len(q['unblocks'])})")

    if args.out:
        write_json(args.out, {"tender_id": tender_id, "title": title, "requirements": enriched,
                              "gap_questions": questions,
                              "capability_docs": [{"doc_id": d["doc_id"], "filename": d["filename"],
                                                   "page_count": 1} for d in capability_docs]})
        print(f"\nenriched tender response -> {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
