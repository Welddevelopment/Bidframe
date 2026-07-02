"""gating_scan.py — deterministic disqualifier SAFETY NET (never miss a deal-breaker).

A compliance tool cannot silently drop a pass/fail requirement. General LLM extraction
occasionally does — especially in garbled form/PQQ sections (verified on the museum 41pp ITT:
the model missed the Q3.2.x Pass/Fail selection questions and the collusion-exclusion clause).

This exhaustive, deterministic scan reads EVERY page for strong disqualifier language
(reject / exclude / disqualify / pass-fail / "failure to … will result in …" / submission
deadline). For any STRONG signal the LLM extraction did NOT already cover, it emits a candidate
gating requirement — low confidence, needs_review — so the disqualifier is surfaced for a human
to confirm rather than lost. Recall-first by design: over-surface a candidate, never miss one.

Stdlib + the similarity seam only — no LLM, no key, reproducible offline. It only ADDS uncovered
strong candidates, so it can never reduce recall or precision of what extraction already found.
"""
from __future__ import annotations

import re

from engine.similarity import content_tokens

# STRONG = explicit disqualifier / pass-fail / submission-deadline language. These, if uncovered
# by extraction, are surfaced. (BROAD signals like bare "minimum"/"mandatory" are too noisy to
# auto-add — kept out of the safety net; the LLM pass handles those.)
_STRONG = re.compile(
    r"(reject(ed|ion)?|exclud(e|ed|ing|sion)|disqualif(y|ied|ication|ies)|"
    r"eliminat(e|ed|ion)|will\s+not\s+be\s+(considered|evaluated|accepted|assessed)|"
    r"pass\s*/?\s*fail|pass\s+or\s+fail|shall\s+be\s+excluded|deemed\s+.{0,25}fail|"
    r"fail(ure|ed|s)?\s+.{0,40}(reject|exclu|disqualif|eliminat|not\s+be\s+considered)|"
    r"canvass|collusi|non[-\s]?complian|"
    r"(received|submitted|returned)\s+no\s+later\s+than|closing\s+(date|time)|\bdeadline\b)",
    re.IGNORECASE,
)

_MIN_LEN = 16
_COVER_CONTAINMENT = 0.6   # covered if an extracted req overlaps >=60% of the smaller token set
_PASSFAIL = re.compile(r"pass\s*/?\s*fail|pass\s+or\s+fail", re.IGNORECASE)


def _units(text: str):
    """Whitespace-normalise (form/table sections arrive with huge gaps), split into sentence-ish
    units, plus a sliding 3-window so a requirement fragmented across form cells still reforms."""
    norm = re.sub(r"\s+", " ", text or "").strip()
    parts = [p.strip() for p in re.split(r"(?<=[.;:])\s+", norm) if len(p.strip()) >= _MIN_LEN]
    seen = set()
    for p in parts:
        if p not in seen:
            seen.add(p)
            yield p
    for i in range(len(parts) - 1):
        win = " ".join(parts[i:i + 3])
        if len(win) >= 20 and win not in seen:
            seen.add(win)
            yield win


def scan_candidates(pages) -> list[dict]:
    """pages: iterable of (page_number:int, page_text:str).
    Returns strong-signal candidate sentences: [{text, source_excerpt, source_page}]."""
    out: list[dict] = []
    seen: set[str] = set()
    for page_no, text in pages:
        for unit in _units(text):
            if _STRONG.search(unit):
                key = re.sub(r"\s+", " ", unit.lower())[:120]
                if key in seen:
                    continue
                seen.add(key)
                # A Pass/Fail selection question is a gate but arrives as a bare heading in form
                # layout ("3.2.2 Quality Standard (Pass/Fail)"); frame it as a requirement so the
                # candidate faithfully represents the disqualifier and is recognisable as the same
                # gate a human labelled (source_excerpt stays the verbatim line for grounding).
                cand_text = unit
                if _PASSFAIL.search(unit):
                    cand_text = "Tenderers must satisfy this Pass/Fail selection requirement: " + unit
                out.append({"text": cand_text, "source_excerpt": unit, "source_page": page_no})
    return out


def _covered(cand_tokens: set[str], extracted_token_sets: list[set[str]]) -> bool:
    """Covered if some extracted requirement overlaps >=60% of the SMALLER token set — so a tight
    disqualifier sentence AND a wide form-window that merely contains it both count as covered."""
    if not cand_tokens:
        return True
    for et in extracted_token_sets:
        if not et:
            continue
        inter = len(cand_tokens & et)
        if inter and inter / min(len(cand_tokens), len(et)) >= _COVER_CONTAINMENT:
            return True
    return False


def uncovered_gating(extracted_reqs: list[dict], pages, raw_id_prefix: str = "gate") -> list[dict]:
    """The safety net: strong disqualifier sentences NOT already covered by extraction, returned
    as raw-format gating requirement dicts (low confidence, needs_review). Union these into the
    raw set before reconcile — reconcile's safety-escalation keeps them gating."""
    extracted_token_sets = [content_tokens(r.get("text", "")) for r in extracted_reqs]
    extra: list[dict] = []
    for seq, cand in enumerate(scan_candidates(pages)):
        if _covered(content_tokens(cand["text"]), extracted_token_sets):
            continue
        excerpt = cand["source_excerpt"][:300]
        extra.append({
            "raw_id": f"{raw_id_prefix}-{cand['source_page']}-{seq:04d}",
            "chunk_id": f"gating-scan-p{cand['source_page']}",
            "text": cand["text"][:300],
            "source_page": cand["source_page"],
            "source_clause": None,
            "source_excerpt": excerpt,
            "type": "mandatory",
            "is_gating": True,
            "category": "legal",
            "confidence": 0.5,
            "char_start": None,
            "char_end": None,
            "extractor_notes": "deterministic gating safety-net — extraction missed this "
                               "disqualifier-language line; confirm it is a real pass/fail gate.",
            "needs_review": True,
        })
    return extra
