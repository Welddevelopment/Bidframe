"""eval_all.py — aggregate accuracy across every labelled tender.

Reads gold-set/eval-manifest.json, runs each tender PDF through the backend
extractor -> engine.reconcile -> engine.eval (page-scoped to the gold's range),
and prints a per-tender table plus the aggregate headline. Lights up as the team
finishes human gold sets; skips entries marked "draft".

Usage (from repo root):
  python -m engine.scripts.eval_all                      # extractor per env (OpenAI if key)
  python -m engine.scripts.eval_all --provider heuristic # force the no-key extractor (free)
"""
from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

from engine._io import read_json
from engine.eval import _ratio, load_gold_csv, score
from engine.reconcile import reconcile

REPO_ROOT = Path(__file__).resolve().parents[2]
MANIFEST = REPO_ROOT / "gold-set" / "eval-manifest.json"


def aggregate(rows: list[dict]) -> dict:
    """Micro-average across per-tender score dicts (+ macro recall). Pure, testable."""
    tp = sum(r["tp"] for r in rows)
    fn = sum(r["fn"] for r in rows)
    fp = sum(r["fp"] for r in rows)
    gg = sum(r["gating_gold"] for r in rows)
    gc = sum(r["gating_caught"] for r in rows)
    dm = sum(r["dangerous_misses"] for r in rows)
    return {
        "tenders": len(rows),
        "recall": _ratio(tp, tp + fn),
        "precision": _ratio(tp, tp + fp),
        "f1": _ratio(2 * tp, 2 * tp + fp + fn),
        "gating_recall": _ratio(gc, gg),
        "gating_gold": gg,
        "gating_caught": gc,
        "dangerous_misses": dm,
        "macro_recall": round(sum(r["recall"] for r in rows) / len(rows), 4) if rows else 0.0,
    }


def _score_one(entry: dict, extractor_box: list) -> dict:
    from engine.scripts.run_tender import raw_envelope_from_pdf
    gold = load_gold_csv(REPO_ROOT / entry["gold"], tender_id=entry["tender_id"])
    envelope, extractor_name = raw_envelope_from_pdf(
        str(REPO_ROOT / entry["pdf"]), entry["tender_id"], entry.get("title", ""))
    extractor_box[0] = extractor_name
    final, _ = reconcile(envelope)
    reqs = final["requirements"]
    mp = entry.get("max_page")
    if mp:
        reqs = [r for r in reqs if r["source_page"] and 1 <= r["source_page"] <= mp]
    s = score(gold, {**final, "requirements": reqs})
    s["tender_id"] = entry["tender_id"]
    return s


def main(argv) -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass
    p = argparse.ArgumentParser(prog="engine.scripts.eval_all")
    p.add_argument("--manifest", default=str(MANIFEST))
    p.add_argument("--provider", default=None, help="force LLM_PROVIDER (heuristic|openai|anthropic)")
    args = p.parse_args(argv[1:])
    if args.provider:
        os.environ["LLM_PROVIDER"] = args.provider

    manifest = read_json(args.manifest)
    entries = [e for e in manifest.get("tenders", []) if not e.get("draft")]
    drafts = [e for e in manifest.get("tenders", []) if e.get("draft")]
    if not entries:
        print("No non-draft gold sets in the manifest yet. Nothing to score.")
        return 0

    box: list = [None]
    rows = [_score_one(e, box) for e in entries]
    agg = aggregate(rows)

    print(f"=== Bidframe aggregate eval — {agg['tenders']} tender(s), extractor: {box[0]} ===\n")
    print(f"{'tender':<10}{'gold':>6}{'recall':>8}{'prec':>7}{'gate-rec':>10}{'danger':>8}")
    for r in rows:
        print(f"{r['tender_id']:<10}{r['gold_count']:>6}{r['recall']:>8}{r['precision']:>7}"
              f"{r['gating_recall']:>10}{r['dangerous_misses']:>8}")
    print()
    print(f"AGGREGATE (micro): recall {agg['recall']}  precision {agg['precision']}  f1 {agg['f1']}")
    print(f"  gating recall {agg['gating_recall']} "
          f"({agg['gating_caught']}/{agg['gating_gold']} disqualifiers caught & flagged)  "
          f"dangerous misses: {agg['dangerous_misses']}")
    print(f"  macro recall {agg['macro_recall']}")
    if drafts:
        print(f"\n  ({len(drafts)} tender(s) awaiting human gold: "
              f"{', '.join(e['tender_id'] for e in drafts)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
