"""net_floor.py — the deterministic deal-breaker floor, offline and reproducible.

Answers "how do you know it catches the deal-breakers?" with a number a judge can re-run in
seconds, no API key, no PDFs: does the deterministic disqualifier net (`engine.gating_scan`, a
regex over strong pass/fail language — NO model) recognise every hand-labelled disqualifier in
our validated gold sets?

Matching-free by design: each gold `is_gating` row IS a disqualifier, so we simply ask the net
to flag it and print any it misses (auditable). This is the net's RECALL FLOOR on real labelled
disqualifier clauses — the deterministic guarantee under the model, not an end-to-end PDF score
(that's `gating_recall.py`, which adds embeddings). Draft/in-progress gold sets (eval-manifest
`draft: true`) are skipped, exactly as `eval_all.py` skips them.

Usage (repo root):  python -m engine.scripts.net_floor
"""
from __future__ import annotations

import csv
import json
from pathlib import Path

from engine.gating_scan import scan_candidates

REPO_ROOT = Path(__file__).resolve().parents[2]
MANIFEST = REPO_ROOT / "gold-set" / "eval-manifest.json"


def _gating_rows(path: Path) -> list[dict]:
    with open(path, encoding="utf-8") as f:
        lines = [ln for ln in f if not ln.lstrip().startswith("#")]
    return [
        r for r in csv.DictReader(lines)
        if (r.get("is_gating") or "").strip().lower() in ("yes", "y", "true", "1")
    ]


def main() -> int:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    tot_caught = tot_total = 0
    print(f"{'Gold tender':<40}{'caught':>8}{'total':>7}   held-out")
    print("-" * 72)
    for t in manifest["tenders"]:
        if t.get("draft"):
            continue  # in-progress gold — excluded, same as eval_all
        gold = REPO_ROOT / t["gold"]
        if not gold.exists():
            continue
        rows = _gating_rows(gold)
        misses = []
        caught = 0
        for r in rows:
            page = int(r["source_page"]) if (r.get("source_page") or "").strip().isdigit() else 1
            if scan_candidates([(page, r["text"])]):
                caught += 1
            else:
                misses.append(f'{r.get("id")}:{r.get("source_clause")}')
        tot_caught += caught
        tot_total += len(rows)
        held = "yes" if t["tender_id"] in ("bradwell", "duffield") else ""
        print(f'{t["title"][:39]:<40}{caught:>8}{len(rows):>7}   {held}')
        for m in misses:
            print(f"    MISS  {m}")
    print("-" * 72)
    print(f"{'TOTAL (validated gold sets)':<40}{tot_caught:>8}{tot_total:>7}")
    print(f"\ndeterministic net, no model — {tot_caught}/{tot_total} labelled disqualifiers flagged")
    return 0 if tot_caught == tot_total else 1


if __name__ == "__main__":
    raise SystemExit(main())
