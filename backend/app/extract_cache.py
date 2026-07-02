"""extract_cache.py — content-addressed cache for the expensive LLM extraction step.

The OpenAI key is shared + rate-limited, so re-running extraction on the same tender
(re-uploads, repeated eval runs, fixture re-bakes) burns money and time for identical
output. This caches a document's raw requirements keyed on the CHUNK TEXTS plus the
extractor identity (name + model + system prompt + EXTRACT_PASSES) — so any change to
ingest, chunking, the model, the prompt, or the pass count auto-invalidates the entry;
no manual version bumping. The heuristic path benefits too (it's just cheap there).

OPT-IN via EXTRACT_CACHE=1 (default off = today's verified behaviour, zero change).
Fully guarded: any cache I/O error falls through to a live extraction, never raises.
Cache dir data/extract_cache/ is gitignored runtime data.
"""
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path

CACHE_DIR = Path(__file__).resolve().parent.parent / "data" / "extract_cache"


def enabled() -> bool:
    return bool(os.environ.get("EXTRACT_CACHE"))


def _key(chunks, extractor) -> str:
    try:
        from .extract import _LLM_SYSTEM
    except Exception:
        _LLM_SYSTEM = ""
    h = hashlib.sha256()
    h.update(getattr(extractor, "name", "?").encode())
    h.update(str(getattr(extractor, "_model", "")).encode())
    h.update(_LLM_SYSTEM.encode())
    h.update(str(os.environ.get("EXTRACT_PASSES", "1")).encode())
    for ch in chunks:
        h.update(b"\x00")
        h.update((getattr(ch, "text", "") or "").encode("utf-8", "replace"))
    return h.hexdigest()


def load(chunks, extractor):
    """Return the cached raw-requirement list for these chunks, or None on miss/disabled/error."""
    if not enabled():
        return None
    try:
        path = CACHE_DIR / f"{_key(chunks, extractor)}.json"
        if path.is_file():
            return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:  # a corrupt/unreadable entry just means "extract live"
        print(f"[extract_cache] load skipped ({exc})")
    return None


def save(chunks, extractor, raws) -> None:
    """Persist the raw-requirement list for these chunks. Never raises."""
    if not enabled():
        return
    try:
        CACHE_DIR.mkdir(parents=True, exist_ok=True)
        path = CACHE_DIR / f"{_key(chunks, extractor)}.json"
        path.write_text(json.dumps(raws), encoding="utf-8")
    except Exception as exc:
        print(f"[extract_cache] save skipped ({exc})")
