"""engine/embeddings.py — optional semantic dedup for reconcile (J-056, Generalist).

Adds a VECTOR-similarity merge path on top of reconcile's conservative lexical gate.
Two near-duplicate requirements the char/token gate misses — a *paraphrase* of the same
obligation on the same page+clause — can still collapse when their embeddings are close.

Design guarantees (why this is safe to add to the demo spine):
  * OFF by default. Semantic dedup runs only when the RECONCILE_SEMANTIC env flag is
    truthy AND a usable OpenAI client is present. With the flag off, build_index()
    returns None and reconcile behaves EXACTLY as the pure lexical gate — so the offline
    test suite stays deterministic and free even on a machine with OPENAI_API_KEY
    exported. (An explicit flag, not mere key-presence, is what guarantees that.)
  * Never raises. Any import/key/network error -> build_index() returns None -> reconcile
    silently falls back to lexical-only dedup, so a live upload can never crash here.
  * Pure-Python cosine (NO numpy dependency — the repo has none). One batched embeddings
    call per build, with a process-lifetime cache keyed by normalised text so repeats
    (across documents / eval A-B runs) cost nothing.

Kept OUT of similarity.py on purpose: that module is the deterministic, stdlib-only
"swappable seam" the eval depends on; embeddings are an optional, network-backed extra
and live here so the seam stays offline-reproducible.
"""
from __future__ import annotations

import math
import os

from engine.similarity import _normalise

EMBED_MODEL = "text-embedding-3-small"
EMBED_SIM_THRESHOLD = 0.87   # cosine >= this collapses a non-gating near-duplicate

_TRUTHY = {"1", "true", "yes", "on"}

# Process-lifetime cache: normalised text -> embedding vector. Avoids re-embedding the
# same requirement text across documents or across an eval off-vs-on A/B run.
_CACHE: dict[str, tuple[float, ...]] = {}


def semantic_enabled() -> bool:
    """Semantic dedup runs only when RECONCILE_SEMANTIC is explicitly truthy.

    An explicit flag (rather than key-presence) is what keeps pytest deterministic and
    offline even when a dev has OPENAI_API_KEY exported in their shell — the test suite
    never sets the flag, so build_index() short-circuits to None before any network call.
    """
    return os.environ.get("RECONCILE_SEMANTIC", "").strip().lower() in _TRUTHY


def _cosine(u: tuple[float, ...], v: tuple[float, ...]) -> float:
    """Pure-Python cosine similarity; 0.0 on a zero/degenerate/length-mismatched vector."""
    if not u or not v or len(u) != len(v):
        return 0.0
    dot = sum(x * y for x, y in zip(u, v))
    nu = math.sqrt(sum(x * x for x in u))
    nv = math.sqrt(sum(y * y for y in v))
    if nu == 0.0 or nv == 0.0:
        return 0.0
    return dot / (nu * nv)


class EmbeddingIndex:
    """Immutable {normalised text -> vector} lookup with a cosine() over two raw texts.

    cosine() returns 0.0 when either text isn't in the index (e.g. an empty string), so a
    missing vector can never *force* a merge — it just falls through to non-mergeable.
    """

    def __init__(self, vectors: dict[str, tuple[float, ...]]):
        self._vectors = vectors

    def cosine(self, a: str, b: str) -> float:
        va = self._vectors.get(_normalise(a))
        vb = self._vectors.get(_normalise(b))
        if va is None or vb is None:
            return 0.0
        return _cosine(va, vb)


def _embed(texts: list[str]) -> dict[str, tuple[float, ...]]:
    """One batched OpenAI embeddings call for the given (already unique) texts.

    Returns {normalised text -> vector}. Raises on any client/network error; callers
    (build_index) swallow it and fall back to lexical-only dedup.
    """
    from openai import OpenAI

    client = OpenAI()
    resp = client.embeddings.create(model=EMBED_MODEL, input=texts)
    try:  # spend visibility (J-055) — must never break dedup
        from engine.usage_log import log_embedding_usage
        log_embedding_usage(resp, EMBED_MODEL, f"embed {len(texts)} texts")
    except Exception:
        pass
    return {_normalise(text): tuple(item.embedding) for text, item in zip(texts, resp.data)}


def build_index(texts: list[str], enabled: bool | None = None) -> EmbeddingIndex | None:
    """Embed the distinct requirement texts once; return an EmbeddingIndex, or None.

    Returns None (-> reconcile stays pure lexical) when the flag is off, there's nothing
    to embed, or ANYTHING goes wrong (no key, network error, SDK missing). Never raises.
    Uses the process-lifetime cache so already-seen texts cost nothing.
    """
    if enabled is None:
        enabled = semantic_enabled()
    if not enabled:
        return None

    # Distinct, non-empty, normalised texts — one original spelling kept per normal form.
    uniq: dict[str, str] = {}
    for t in texts:
        n = _normalise(t or "")
        if n and n not in uniq:
            uniq[n] = t
    if not uniq:
        return None

    vectors: dict[str, tuple[float, ...]] = {}
    missing_norm: list[str] = []
    missing_orig: list[str] = []
    for n, orig in uniq.items():
        cached = _CACHE.get(n)
        if cached is not None:
            vectors[n] = cached
        else:
            missing_norm.append(n)
            missing_orig.append(orig)

    if missing_orig:
        try:
            fresh = _embed(missing_orig)
        except Exception as exc:  # no key / network / SDK missing -> disable, don't crash
            print(f"[embeddings] semantic dedup unavailable ({exc}); using lexical only.")
            return None
        for n in missing_norm:
            vec = fresh.get(n)
            if vec is not None:
                _CACHE[n] = vec
                vectors[n] = vec

    return EmbeddingIndex(vectors) if vectors else None
