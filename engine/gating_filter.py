"""gating_filter.py — MODEL precision filter for the generous gating safety-net.

Two-stage deal-breaker engine: the deterministic keyword net (engine.gating_scan) is generous by
design (recall-first — it would rather over-flag than miss a disqualifier), then this reads each
flagged line and DROPS only the obvious false positives (scope-of-work, boilerplate, navigation,
contact details). The model can only REMOVE from the net's set, so the deterministic recall floor
is preserved — precision goes up, recall does not go down.

RECALL-SAFETY INVARIANTS (why this can never silently drop a real deal-breaker):
  * Conservative prompt — KEEP if a line is, or might plausibly be, a deal-breaker; DROP only when
    it is CLEARLY not one; when unsure, KEEP.
  * Fail-open — disabled, no key, a network error, malformed output, or an EMPTY keep-set all return
    the candidates UNCHANGED. A failure can only under-filter (keep noise), never over-filter.
  * Never adds — the result is always a subset of the input, in the same order.

OFF by default (needs the GATING_FILTER flag + a key), same explicit-flag pattern as
engine.embeddings, so the offline test suite and the no-key demo stay deterministic and free.
"""
from __future__ import annotations

import json
import os

_TRUTHY = {"1", "true", "yes", "on"}

FILTER_SYSTEM = """You are a UK public-sector bid-compliance checker. You are given candidate lines a \
keyword scanner flagged as POSSIBLE deal-breakers in a tender.

A DEAL-BREAKER = a requirement where, if the bidder fails, omits or breaches it, their BID IS \
REJECTED, DISQUALIFIED, EXCLUDED, or SCORES A FAIL. This includes: explicit reject / exclude / \
disqualify / eliminate statements; Pass/Fail selection questions (SQ / PQQ); mandatory MINIMUM \
insurance / turnover / certification / registration; documents that MUST be returned or the bid is \
rejected; the SUBMISSION DEADLINE; collusion / canvassing / conflict-of-interest bans; variant-bid \
bans.

NOT a deal-breaker: the SCOPE OF WORK / what the service must actually do ("must build the \
infrastructure", "must clean the site weekly", "must use recycled materials where possible"); service \
quality aspirations; navigation / table-of-contents lines; contact details, addresses, emails; page \
headers/footers; generic boilerplate; content the tender "must include" UNLESS omitting it explicitly \
rejects the bid.

For each numbered line reply KEEP or DROP. KEEP if it is — or might plausibly be — a deal-breaker. \
DROP only if it is CLEARLY not one. When genuinely unsure, KEEP: missing a real deal-breaker is far \
worse than one extra flag a human can dismiss in a second.

Reply ONLY with a JSON object: {"verdicts":[{"n":1,"v":"KEEP"},{"n":2,"v":"DROP"}, ...]} covering \
every line by its number."""


def filter_enabled() -> bool:
    """The filter runs only when GATING_FILTER is explicitly truthy — an explicit flag (not mere
    key-presence) keeps pytest deterministic + the no-key demo free, exactly as engine.embeddings."""
    return os.environ.get("GATING_FILTER", "").strip().lower() in _TRUTHY


def _llm_classify(texts: list[str]) -> set[int]:
    """One batched chat call -> the set of 0-based indices to KEEP. Raises on any client/network/
    parse error (the caller fails open to keeping everything). Unlisted lines default to KEEP."""
    from openai import OpenAI

    model = os.environ.get("LLM_MODEL", "gpt-4o-mini")
    numbered = "\n".join(f"{i + 1}. {(t or '')[:220]}" for i, t in enumerate(texts))
    client = OpenAI()
    resp = client.chat.completions.create(
        model=model, temperature=0,
        response_format={"type": "json_object"},
        messages=[{"role": "system", "content": FILTER_SYSTEM},
                  {"role": "user", "content": numbered}],
    )
    try:  # spend visibility (J-055) — must never break the filter
        from engine.usage_log import log_usage
        log_usage(resp, model, f"gating-filter {len(texts)} candidates")
    except Exception:
        pass
    data = json.loads(resp.choices[0].message.content)
    dropped = {int(d["n"]) - 1 for d in data.get("verdicts", [])
               if str(d.get("v", "")).strip().upper().startswith("D")}
    # default-KEEP: everything not explicitly dropped stays (recall-first)
    return {i for i in range(len(texts)) if i not in dropped}


def filter_gating_candidates(candidates: list[dict], classify=None, enabled: bool | None = None,
                             text_key: str = "text") -> list[dict]:
    """Drop obvious-false candidates from the generous net; return a SUBSET (never adds/reorders).

    candidates: raw gating dicts from gating_scan.uncovered_gating. `classify` is injectable
    (list[str] -> set[int] of kept indices) for offline testing; defaults to the LLM. Fail-open on
    every error / empty result so the filter can never lower the deterministic recall floor.
    """
    if enabled is None:
        enabled = filter_enabled()
    if not enabled or not candidates:
        return candidates
    try:
        classifier = classify or _llm_classify
        keep = classifier([c.get(text_key, "") for c in candidates])
    except Exception as exc:  # no key / network / parse — keep everything (recall-safe)
        print(f"[gating-filter] disabled this run ({exc}); keeping all candidates.")
        return candidates
    if not keep:  # empty/failed verdict set — keep everything rather than drop all
        return candidates
    kept = [c for i, c in enumerate(candidates) if i in keep]
    return kept if kept else candidates
