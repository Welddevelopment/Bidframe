"""precision_report.py — categorise extraction false-positives vs a gold set.

Low precision on the eval can mean very different things, and they need OPPOSITE fixes:
  - true DUPLICATES (chunk-overlap / fragmentation)  -> reconcile dedup (generalist)
  - genuine NON-REQUIREMENTS (headings/boilerplate)  -> prompt / a filter
  - BORDERLINE gold matches (paraphrase < threshold) -> matcher / eval
  - REAL requirements the sparse gold simply lacks    -> not a defect (gold is the limit)

This categorises each false-positive so we know the MIX before spending effort. Deterministic
(stdlib + our similarity seam), so it can run offline. Extraction itself uses the LLM path when
OPENAI_API_KEY is set (cheap on mini) — throttle-friendly, run it when nothing else is hammering the key.

Usage (repo root):  python -m engine.scripts.precision_report [tender_id ...]   # default: all non-draft
"""
from __future__ import annotations

import sys
from pathlib import Path

from engine._io import read_json
from engine.eval import MATCH_THRESHOLD, load_gold_csv, match_requirements
from engine.reconcile import reconcile
from engine.similarity import content_tokens, match_score

REPO_ROOT = Path(__file__).resolve().parents[2]
MANIFEST = REPO_ROOT / "gold-set" / "eval-manifest.json"

DUP_THRESHOLD = 0.85            # near-identical to another extracted item
NEARGOLD_LOW = 0.45            # close-but-below-match: a paraphrase the matcher missed
_BUYER_SIDE = (
    "the mac ", "the authority ", "the council ", "this contract", "this itt",
    "this tender", "for information", "for the avoidance", "note:", "definition",
    "the supplier will be", "the successful", "please note",
)


def _categorise_fp(o: dict, others: list[dict], gold_reqs: list[dict]) -> str:
    text = (o.get("text") or "").strip()
    toks = content_tokens(text)
    # 1) duplicate of another EXTRACTED item
    dup = max((match_score(text, x.get("text", "")) for x in others if x is not o), default=0.0)
    if dup >= DUP_THRESHOLD:
        return "duplicate"
    # 2) borderline gold match (matcher/eval gap, not real over-extraction)
    near = max((match_score(text, g.get("text", "")) for g in gold_reqs), default=0.0)
    if NEARGOLD_LOW <= near < MATCH_THRESHOLD:
        return "borderline-gold-match"
    # 3) genuine non-requirement noise
    if len(toks) <= 2:
        return "non-requirement (heading/too-short)"
    low = text.lower()
    if any(low.startswith(h) for h in _BUYER_SIDE):
        return "non-requirement (buyer-side/descriptive)"
    # 4) otherwise: most likely a REAL requirement the sparse gold lacks (eval artifact)
    return "real-not-in-gold (gold limit)"


def _report_one(entry: dict) -> None:
    from engine.scripts.run_tender import raw_envelope_from_pdf

    gold = load_gold_csv(REPO_ROOT / entry["gold"], tender_id=entry["tender_id"])
    envelope, extractor = raw_envelope_from_pdf(
        str(REPO_ROOT / entry["pdf"]), entry["tender_id"], entry.get("title", ""))
    final, _ = reconcile(envelope)
    reqs = final["requirements"]
    mp = entry.get("max_page")
    if mp:
        reqs = [r for r in reqs if r.get("source_page") and 1 <= r["source_page"] <= mp]
    outp = {**final, "requirements": reqs}
    _matches, _um_gold, um_out = match_requirements(gold, outp)

    buckets: dict[str, list[dict]] = {}
    for o in um_out:
        buckets.setdefault(_categorise_fp(o, reqs, gold["requirements"]), []).append(o)

    total_fp = len(um_out)
    print(f"\n=== {entry['tender_id']} ({extractor}) — {len(reqs)} extracted, "
          f"{len(gold['requirements'])} gold, {total_fp} false-positive(s) ===")
    if not total_fp:
        print("  (no false positives)")
        return
    for cat in sorted(buckets, key=lambda c: -len(buckets[c])):
        items = buckets[cat]
        pct = 100 * len(items) / total_fp
        print(f"  {len(items):>3} ({pct:4.0f}%)  {cat}")
        for o in items[:2]:
            print(f"           e.g. {(o.get('text') or '')[:100]}")
    real = sum(len(v) for k, v in buckets.items() if k.startswith("real-not-in-gold"))
    fixable = total_fp - real
    print(f"  -> {fixable}/{total_fp} FPs are genuinely fixable (dedup/prompt/matcher); "
          f"{real} are 'real-but-not-in-gold' (raise the gold, not the tool).")


def main(argv) -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass
    wanted = set(argv[1:])
    manifest = read_json(MANIFEST)
    entries = [e for e in manifest.get("tenders", []) if not e.get("draft")]
    if wanted:
        entries = [e for e in entries if e["tender_id"] in wanted]
    if not entries:
        print("No matching non-draft tenders in the manifest.")
        return 0
    print("Precision false-positive breakdown (what actually drags precision):")
    for e in entries:
        _report_one(e)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
