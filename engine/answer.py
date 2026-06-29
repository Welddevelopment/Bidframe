"""answer.py — auditable autofill: grounded answer-draft + gap interview (Generalist lane).

Pipeline steps 12-13 (see autofill-scope-decision.md). Per requirement, retrieve
evidence from the bidder's capability documents and draft a grounded answer — or,
when the evidence doesn't cover it, mark `needs_input` and let the gap interview ask
the human. Emits exactly the frontend's Answer / OpenQuestion shape.

THE RULE THAT PROTECTS TRUST: ground every claim in retrieved evidence, or flag
needs_input. Never bluff. A confident-but-unevidenced answer destroys the trust the
matrix earned (same DNA as extraction: when unsure, flag, don't guess).

Pluggable, mirroring backend/app/extract.py:
  - MockAnswerer        — deterministic, no key; grounds when evidence overlaps, else needs_input.
  - OpenAIAnswerer      — J's prompts/answer-generation.md, structured output (OPENAI_API_KEY).
"""
from __future__ import annotations

import json
import os
from pathlib import Path

from engine.similarity import content_tokens

MIN_EVIDENCE_TOKENS = 2   # a passage must share >= this many content tokens to count as evidence
TOP_K = 3


# --------------------------------------------------------------------------- #
# Capability docs -> passages
# --------------------------------------------------------------------------- #
def load_capability_docs(folder: str | Path) -> list[dict]:
    """Each .txt -> {doc_id, filename, passages:[{doc_id, page, text}]} (blank-line passages)."""
    docs = []
    for path in sorted(Path(folder).glob("*.txt")):
        text = path.read_text(encoding="utf-8")
        passages = [
            {"doc_id": path.stem, "page": 1, "text": " ".join(p.split())}
            for p in text.split("\n\n") if p.strip()
        ]
        docs.append({"doc_id": path.stem, "filename": path.name, "passages": passages})
    return docs


def all_passages(capability_docs: list[dict]) -> list[dict]:
    return [p for d in capability_docs for p in d["passages"]]


def retrieve(requirement_text: str, passages: list[dict], k: int = TOP_K) -> list[dict]:
    """Thin RAG: rank passages by shared content tokens with the requirement. No embeddings."""
    req = content_tokens(requirement_text)
    scored = []
    for p in passages:
        shared = len(req & content_tokens(p["text"]))
        if shared >= MIN_EVIDENCE_TOKENS:
            scored.append({**p, "score": shared})
    scored.sort(key=lambda x: (-x["score"], x["doc_id"], x["text"]))
    return scored[:k]


def _evidence_ref(passage: dict) -> dict:
    # Exactly the frontend EvidenceRef shape (doc_id, excerpt, page).
    return {"doc_id": passage["doc_id"], "excerpt": passage["text"], "page": passage["page"]}


def _build_gap_questions(raw_questions: list[dict], gaps: list[dict]) -> list[dict]:
    """Validate LLM-produced gap questions against the real gaps: keep only questions
    that unblock a known requirement, and re-derive `unblocks_gating` from the gaps so a
    model slip can't mislabel a disqualifier. Pure (no network) — the testable core."""
    valid_ids = {g["req_id"] for g in gaps}
    gating_ids = {g["req_id"] for g in gaps if g.get("is_gating")}
    out: list[dict] = []
    for i, q in enumerate(raw_questions, 1):
        unblocks = [rid for rid in (q.get("unblocks") or []) if rid in valid_ids]
        if not unblocks:
            continue
        out.append({
            "id": q.get("id") or f"q-{i}",
            "question": (q.get("question") or "").strip(),
            "unblocks": unblocks,
            "unblocks_gating": bool(q.get("unblocks_gating")) or bool(set(unblocks) & gating_ids),
        })
    return out


# --------------------------------------------------------------------------- #
# Answerers
# --------------------------------------------------------------------------- #
class MockAnswerer:
    """Deterministic answerer. Grounds in retrieved evidence or flags needs_input — never bluffs."""

    name = "mock"

    def draft(self, requirement: dict, evidence: list[dict]) -> dict:
        req_id = requirement.get("id", "")
        if evidence:
            refs = [_evidence_ref(p) for p in evidence[:2]]
            top = evidence[0]
            conf = round(min(0.9, 0.55 + 0.1 * top["score"]), 2)
            text = ("AcmeClean Ltd meets this requirement. Evidence: "
                    + " | ".join(r["excerpt"] for r in refs))
            return {"req_id": req_id, "text": text, "state": "auto",
                    "evidence_refs": refs, "missing": None, "confidence": conf}
        # No evidence -> do NOT invent an answer.
        return {"req_id": req_id, "text": "", "state": "needs_input", "evidence_refs": [],
                "missing": f"No capability evidence found for: {requirement.get('text', '')}",
                "confidence": 0.0}

    def dedupe_gaps(self, gaps: list[dict]) -> list[dict]:
        """Collapse needs_input gaps into the shortest question list (token-overlap grouping)."""
        questions: list[dict] = []
        for gap in gaps:
            toks = content_tokens(gap["text"])
            placed = False
            for q in questions:
                if len(toks & q["_toks"]) >= 2:   # same underlying fact
                    q["unblocks"].append(gap["req_id"])
                    q["unblocks_gating"] = q["unblocks_gating"] or gap.get("is_gating", False)
                    placed = True
                    break
            if not placed:
                questions.append({
                    "id": f"q-{len(questions) + 1}",
                    "question": f"Please provide evidence or details for: {gap['text']}",
                    "unblocks": [gap["req_id"]],
                    "unblocks_gating": gap.get("is_gating", False),
                    "_toks": toks,
                })
        for q in questions:
            q.pop("_toks", None)
        return questions


class OpenAIAnswerer:
    """OpenAI answerer using prompts/answer-generation.md (structured output)."""

    name = "openai"

    def __init__(self) -> None:
        from openai import OpenAI
        self._client = OpenAI()
        self._model = os.environ.get("LLM_MODEL", "gpt-4o")

    _SYSTEM = (
        "You draft answers to UK public-sector tender requirements on behalf of a bidder, using "
        "ONLY the bidder's own capability evidence provided. You are an auditable autofill engine, "
        "not a creative writer: every factual claim must be supported by a provided evidence snippet, "
        "and you cite which one. If the evidence does not cover the requirement, state=needs_input, "
        "text='', evidence_refs=[], and put the specific question in `missing`. Never invent "
        "certifications, figures, dates, or client names. Report 0-1 confidence."
    )
    _SCHEMA = {
        "type": "object",
        "properties": {
            "text": {"type": "string"},
            "state": {"type": "string", "enum": ["auto", "needs_input", "empty"]},
            "evidence_refs": {"type": "array", "items": {"type": "object", "properties": {
                "doc_id": {"type": "string"}, "excerpt": {"type": "string"}, "page": {"type": "integer"}},
                "required": ["doc_id", "excerpt", "page"]}},
            "missing": {"type": ["string", "null"]},
            "confidence": {"type": "number"},
        },
        "required": ["text", "state", "evidence_refs", "confidence"],
    }

    def draft(self, requirement: dict, evidence: list[dict]) -> dict:
        ev = "\n".join(f"- [{p['doc_id']} p.{p['page']}] {p['text']}" for p in evidence) or "(no evidence retrieved)"
        user = (f"REQUIREMENT [{requirement.get('id')}] ({requirement.get('type')}"
                f"{', GATING' if requirement.get('is_gating') else ''})\n"
                f"ask: {requirement.get('text')}\nclause: {requirement.get('source_clause')}\n\n"
                f"EVIDENCE FROM CAPABILITY DOCS (your only source of truth):\n{ev}\n\n"
                "Draft the answer. Ground every claim in the evidence above, or mark needs_input.")
        resp = self._client.chat.completions.create(
            model=self._model,
            messages=[{"role": "system", "content": self._SYSTEM}, {"role": "user", "content": user}],
            tools=[{"type": "function", "function": {
                "name": "emit_answer", "description": "Return the drafted answer.", "parameters": self._SCHEMA}}],
            tool_choice={"type": "function", "function": {"name": "emit_answer"}},
        )
        calls = resp.choices[0].message.tool_calls or []
        out = json.loads(calls[0].function.arguments) if calls else {}
        out["req_id"] = requirement.get("id", "")
        out.setdefault("evidence_refs", [])
        out.setdefault("missing", None)
        out.setdefault("state", "needs_input")
        out.setdefault("text", "")
        out.setdefault("confidence", 0.0)
        return out

    # Gap interview (J's prompts/gap-interview.md): turn the raw needs_input gaps into the
    # SHORTEST set of plain-English questions, deduping shared facts. One LLM call for the
    # whole list; falls back to the mock's deterministic deduper if it's unavailable.
    _GAP_SYSTEM = (
        "You turn a list of unanswered tender-requirement gaps into the SHORTEST possible set of "
        "clear questions for a human bid manager. Ask the fewest questions that unblock the most "
        "requirements.\nRULES\n- DEDUPE aggressively: if several requirements need the same fact, ask "
        "for it ONCE and link all the requirements it unblocks.\n- Make each question specific and "
        "answerable in one line — a fact, a number, a yes/no, or a document to attach. No essays.\n"
        "- Order by impact: questions unblocking GATING requirements first, then by how many each "
        "unblocks.\n- Plain English, second person (\"Do you hold…?\", \"What is your…?\"). No jargon, "
        "no restating the clause.\n- Do not invent gaps. Only ask about the gaps provided.\n"
        "Each question carries the list of requirement ids it would unblock."
    )
    _GAP_SCHEMA = {
        "type": "object",
        "properties": {
            "questions": {"type": "array", "items": {"type": "object", "properties": {
                "id": {"type": "string"},
                "question": {"type": "string"},
                "unblocks": {"type": "array", "items": {"type": "string"}},
                "unblocks_gating": {"type": "boolean"},
            }, "required": ["id", "question", "unblocks", "unblocks_gating"]}},
        },
        "required": ["questions"],
    }

    def _call_gap_interview(self, gaps: list[dict]) -> dict:
        lines = [
            f"- req {g['req_id']}{' (GATING)' if g.get('is_gating') else ''}: "
            f"needs — {g.get('missing') or g.get('text', '')}"
            for g in gaps
        ]
        user = ("The following requirements need input from the human (each with the gap the drafter "
                "identified):\n\n" + "\n".join(lines) +
                "\n\nProduce the shortest set of questions that unblocks these. Dedupe shared needs. "
                "Gating first.")
        resp = self._client.chat.completions.create(
            model=self._model,
            messages=[{"role": "system", "content": self._GAP_SYSTEM}, {"role": "user", "content": user}],
            tools=[{"type": "function", "function": {
                "name": "emit_questions", "description": "Return the deduped question list.",
                "parameters": self._GAP_SCHEMA}}],
            tool_choice={"type": "function", "function": {"name": "emit_questions"}},
        )
        calls = resp.choices[0].message.tool_calls or []
        return json.loads(calls[0].function.arguments) if calls else {"questions": []}

    def dedupe_gaps(self, gaps: list[dict]) -> list[dict]:
        if not gaps:
            return []
        try:
            questions = _build_gap_questions(self._call_gap_interview(gaps).get("questions", []), gaps)
            if questions:
                return questions
        except Exception as exc:  # pragma: no cover - network/parse failure → deterministic fallback
            print(f"[answer] gap-interview LLM failed ({exc}); using deterministic dedupe.")
        return MockAnswerer.dedupe_gaps(self, gaps)


def get_answerer():
    provider = os.environ.get("LLM_PROVIDER", "").lower()
    if provider != "heuristic" and provider != "mock" and os.environ.get("OPENAI_API_KEY"):
        try:
            return OpenAIAnswerer()
        except Exception as exc:  # pragma: no cover
            print(f"[answer] OpenAI unavailable ({exc}); using mock answerer.")
    return MockAnswerer()


# --------------------------------------------------------------------------- #
# Orchestration
# --------------------------------------------------------------------------- #
def draft_answer(requirement: dict, passages: list[dict], answerer, k: int = TOP_K) -> dict:
    """Retrieve evidence for one requirement and draft a grounded answer (or needs_input)."""
    evidence = retrieve(requirement.get("text", ""), passages, k)
    return answerer.draft(requirement, evidence)


def _answer_block(raw: dict) -> dict:
    """Map an answerer result to the frontend Answer shape (drops `missing`)."""
    return {"text": raw["text"], "state": raw["state"],
            "evidence_refs": raw.get("evidence_refs", []), "confidence": raw.get("confidence", 0.0)}


def draft_all(requirements: list[dict], capability_docs: list[dict], answerer=None,
              k: int = TOP_K, max_workers: int = 1) -> tuple[list[dict], list[dict]]:
    """Enrich each requirement with an `answer` (+ per-req open_questions for gaps) and
    return (enriched_requirements, deduped_gap_questions).

    `max_workers > 1` runs the per-requirement answerer calls concurrently (they're
    I/O-bound LLM requests) to keep the live /draft endpoint snappy. Results are
    re-ordered back to the input order, so a parallel run is identical to a sequential
    one — only faster. Default 1 = sequential (deterministic, no threads)."""
    answerer = answerer or get_answerer()
    passages = all_passages(capability_docs)

    if max_workers and max_workers > 1 and len(requirements) > 1:
        from concurrent.futures import ThreadPoolExecutor
        with ThreadPoolExecutor(max_workers=max_workers) as pool:
            raws = list(pool.map(lambda req: draft_answer(req, passages, answerer, k), requirements))
    else:
        raws = [draft_answer(req, passages, answerer, k) for req in requirements]

    enriched, gaps = [], []
    for req, raw in zip(requirements, raws):
        block = _answer_block(raw)
        out = {**req, "answer": block, "draft_answer": block["text"] or None, "open_questions": []}
        if raw["state"] == "needs_input":
            gaps.append({"req_id": req["id"], "text": req.get("text", ""),
                         "is_gating": req.get("is_gating", False), "missing": raw.get("missing")})
        enriched.append(out)

    questions = answerer.dedupe_gaps(gaps) if gaps else []
    # Back-link the deduped questions onto each requirement's open_questions.
    by_req: dict[str, list[dict]] = {}
    for q in questions:
        for rid in q["unblocks"]:
            by_req.setdefault(rid, []).append(
                {"id": q["id"], "question": q["question"], "answer": None, "answered_at": None})
    for out in enriched:
        out["open_questions"] = by_req.get(out["id"], [])
    return enriched, questions
