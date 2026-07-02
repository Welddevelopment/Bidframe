"""Embedding semantic dedup (J-056, Generalist).

The embedding path is an ADDITIVE, opt-in merge route layered on reconcile's lexical
gate. These tests drive it with an injected FakeIndex so they stay offline, deterministic
and key-free (the real OpenAI index is only ever built at an I/O boundary when the
RECONCILE_SEMANTIC flag is set). They prove the safety envelope holds:

  * a non-gating paraphrase the lexical gate misses DOES collapse,
  * two gating rows NEVER collapse on vectors (distinct disqualifiers survive),
  * disjoint numbers ('ISO 9001' vs '14001') block a semantic merge,
  * the same-page+clause source gate still blocks even identical text,
  * with no index, behaviour is byte-for-byte the current lexical dedup,
  * the flag defaults OFF (build_index -> None, no network),
  * a multi-pass union escalates gating from ANY pass (item 2).
"""
from engine.reconcile import (
    _lexical_ok,
    _mergeable,
    _numeric_conflict,
    group_candidates,
    merge_group,
)
from engine.embeddings import EMBED_SIM_THRESHOLD, build_index, semantic_enabled


def _raw(rid, text, *, page=3, clause="4.1", gating=False, typ="mandatory", conf=0.8):
    return {
        "raw_id": rid,
        "chunk_id": "c1",
        "text": text,
        "source_page": page,
        "source_clause": clause,
        "source_excerpt": text,
        "char_start": 0,
        "char_end": len(text),
        "type": typ,
        "is_gating": gating,
        "category": "other",
        "confidence": conf,
    }


class _FakeIndex:
    """Deterministic EmbeddingIndex stand-in: texts sharing a concept -> cosine 0.95,
    otherwise 0.10. Lets the semantic path be tested with no network/key."""

    def __init__(self, concept: dict[str, str]):
        self._concept = concept

    def cosine(self, a: str, b: str) -> float:
        ca, cb = self._concept.get(a), self._concept.get(b)
        if ca is None or cb is None:
            return 0.10
        return 0.95 if ca == cb else 0.10


# --------------------------------------------------------------------------- #
# 1. The win: a non-gating paraphrase the lexical gate misses now collapses
# --------------------------------------------------------------------------- #
def test_semantic_merges_nongating_paraphrase_the_lexical_gate_misses():
    a = _raw("a", "The contractor shall submit monthly cleaning reports.")
    b = _raw("b", "A written account of janitorial activity is required every four weeks.")
    assert not _lexical_ok(a, b)  # precondition: NOT a lexical duplicate
    idx = _FakeIndex({a["text"]: "reporting", b["text"]: "reporting"})
    assert idx.cosine(a["text"], b["text"]) >= EMBED_SIM_THRESHOLD
    assert _mergeable(a, b, idx) is True
    assert len(group_candidates([a, b], idx)) == 1
    # and without an index it stays separate (pure lexical parity)
    assert _mergeable(a, b, None) is False
    assert len(group_candidates([a, b])) == 2


def test_semantic_merges_nullclause_paraphrase_but_page_gate_holds():
    # The REAL shape of extractor output: NO clause. Same page + embedding-close collapses.
    a = _raw("a", "The contractor shall submit monthly cleaning reports.", clause=None)
    b = _raw("b", "A written account of janitorial activity is required every four weeks.",
             clause=None)
    assert not _lexical_ok(a, b)
    idx = _FakeIndex({a["text"]: "reporting", b["text"]: "reporting"})
    assert _mergeable(a, b, idx) is True
    assert len(group_candidates([a, b], idx)) == 1
    # different page -> still separate even with a hot index (page gate is absolute)
    b2 = _raw("b2", b["text"], clause=None, page=4)
    assert _mergeable(a, b2, idx) is False


# --------------------------------------------------------------------------- #
# 2. Safety: embeddings NEVER merge a gating row (distinct disqualifiers survive)
# --------------------------------------------------------------------------- #
def test_embedding_never_merges_two_gating_rows():
    a = _raw("a", "Public liability insurance is mandatory for all bidders.", gating=True)
    b = _raw("b", "Employers indemnity must be evidenced before award.", gating=True)
    assert not _lexical_ok(a, b)
    idx = _FakeIndex({a["text"]: "insurance", b["text"]: "insurance"})
    assert idx.cosine(a["text"], b["text"]) >= EMBED_SIM_THRESHOLD  # would merge if allowed
    assert _mergeable(a, b, idx) is False
    assert len(group_candidates([a, b], idx)) == 2


def test_embedding_not_used_when_one_side_is_gating():
    a = _raw("a", "Public liability insurance is mandatory for all bidders.", gating=True)
    b = _raw("b", "Employers indemnity must be evidenced before award.", gating=False)
    idx = _FakeIndex({a["text"]: "insurance", b["text"]: "insurance"})
    assert _mergeable(a, b, idx) is False


# --------------------------------------------------------------------------- #
# 3. Numeric-conflict guard: distinct specs/amounts never collapse on vectors
# --------------------------------------------------------------------------- #
def test_numeric_conflict_helper():
    assert _numeric_conflict("ISO 9001 certification", "ISO 14001 certification") is True
    assert _numeric_conflict("cover of £5m", "cover of £10m") is True
    assert _numeric_conflict("submit reports", "submit a report") is False  # no numbers
    assert _numeric_conflict("hold ISO 9001", "certified to ISO 9001") is False  # shared number


def test_numeric_conflict_blocks_embedding_merge_of_distinct_specs():
    a = _raw("a", "Provide evidence of ISO 9001 certification.")
    b = _raw("b", "Environmental management to the 14001 framework is expected.")
    assert not _lexical_ok(a, b)  # lexically distinct -> only the embedding path could fire
    idx = _FakeIndex({a["text"]: "iso", b["text"]: "iso"})
    assert idx.cosine(a["text"], b["text"]) >= EMBED_SIM_THRESHOLD
    assert _numeric_conflict(a["text"], b["text"]) is True
    assert _mergeable(a, b, idx) is False
    assert len(group_candidates([a, b], idx)) == 2


# --------------------------------------------------------------------------- #
# 4. Source gate still blocks even identical text on a different page
# --------------------------------------------------------------------------- #
def test_source_gate_blocks_even_identical_text_on_a_different_page():
    text = "Provide a valid health and safety policy."
    a = _raw("a", text, page=3)
    b = _raw("b", text, page=4)
    idx = _FakeIndex({text: "hs"})  # identical text -> cosine 0.95, and lexically identical too
    assert _mergeable(a, b, idx) is False  # source gate short-circuits before both paths
    assert len(group_candidates([a, b], idx)) == 2


# --------------------------------------------------------------------------- #
# 5. No index -> pure lexical parity (genuine duplicate still merges)
# --------------------------------------------------------------------------- #
def test_embed_index_none_is_pure_lexical_parity():
    a = _raw("a", "The supplier must hold ISO 9001 certification.", gating=True)
    b = _raw("b", "The supplier must hold ISO 9001 certification at submission.", gating=True)
    assert _lexical_ok(a, b)  # a genuine (lexical) duplicate
    assert len(group_candidates([a, b])) == 1  # None index
    assert len(group_candidates([a, b], _FakeIndex({}))) == 1  # index present, lexical still wins


# --------------------------------------------------------------------------- #
# 6. Feature is OFF by default (no flag -> build_index returns None, no network)
# --------------------------------------------------------------------------- #
def test_semantic_disabled_by_default(monkeypatch):
    monkeypatch.delenv("RECONCILE_SEMANTIC", raising=False)
    assert semantic_enabled() is False
    assert build_index(["alpha requirement", "beta requirement"]) is None  # disabled -> None


def test_flag_recognised_but_empty_input_needs_no_network(monkeypatch):
    monkeypatch.setenv("RECONCILE_SEMANTIC", "1")
    assert semantic_enabled() is True
    assert build_index([], enabled=True) is None  # nothing to embed -> None, still no call


# --------------------------------------------------------------------------- #
# 7. Ensemble / multi-pass union: gating escalates from ANY pass (item 2)
# --------------------------------------------------------------------------- #
def test_union_merge_escalates_gating_from_any_pass():
    # Two extraction passes surface the SAME requirement; only pass 1 flagged it gating.
    p1 = _raw("p1", "The supplier must hold ISO 9001 certification.",
              gating=True, typ="mandatory", conf=0.6)
    p2 = _raw("p2", "The supplier must hold ISO 9001 certification.",
              gating=False, typ="optional", conf=0.7)
    groups = group_candidates([p1, p2])  # identical text -> lexical merge
    assert len(groups) == 1
    m = merge_group(groups[0])
    assert m["is_gating"] is True and m["type"] == "mandatory"  # escalated from pass 1
    assert m["confidence"] >= max(0.6, 0.7)  # noisy-OR is monotonic up
