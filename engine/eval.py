"""Deterministic eval harness for gold-set scoring."""
from __future__ import annotations

from typing import Any

from engine.similarity import similarity

MATCH_THRESHOLD = 0.60


def _requirements(envelope: dict[str, Any]) -> list[dict[str, Any]]:
    return list(envelope.get("requirements", []))


def match_requirements(
    gold: dict[str, Any], output: dict[str, Any]
) -> tuple[list[tuple[dict[str, Any], dict[str, Any]]], list[dict[str, Any]], list[dict[str, Any]]]:
    """Greedy one-to-one gold/output matching by descending deterministic similarity."""
    gold_reqs = _requirements(gold)
    output_reqs = _requirements(output)
    candidates: list[tuple[float, int, int, int, dict[str, Any], dict[str, Any]]] = []

    for gi, gold_req in enumerate(gold_reqs):
        for oi, output_req in enumerate(output_reqs):
            sim = similarity(str(gold_req.get("text", "")), str(output_req.get("text", "")))
            if sim >= MATCH_THRESHOLD:
                same_page_rank = 0 if gold_req.get("source_page") == output_req.get("source_page") else 1
                candidates.append((sim, same_page_rank, gi, oi, gold_req, output_req))

    candidates.sort(key=lambda item: (-item[0], item[1], item[2], item[3]))

    matched_gold: set[int] = set()
    matched_output: set[int] = set()
    matches: list[tuple[dict[str, Any], dict[str, Any]]] = []

    for _, _, gi, oi, gold_req, output_req in candidates:
        if gi in matched_gold or oi in matched_output:
            continue
        matched_gold.add(gi)
        matched_output.add(oi)
        matches.append((gold_req, output_req))

    matches.sort(key=lambda pair: gold_reqs.index(pair[0]))
    unmatched_gold = [g for i, g in enumerate(gold_reqs) if i not in matched_gold]
    unmatched_output = [o for i, o in enumerate(output_reqs) if i not in matched_output]
    return matches, unmatched_gold, unmatched_output
