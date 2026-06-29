#!/usr/bin/env python3
"""gen_codemap.py — regenerate CODEMAP.md, the always-current map of this repo.

Zero dependencies (stdlib only). Walks the git-tracked files, classifies them into
areas (frontend / backend / engine / prompts / data / …), extracts a one-line
description per module, and resolves the *internal* import graph for Python and
TypeScript. Emits CODEMAP.md with Mermaid graphs (GitHub renders them — humans get
the picture; agents get the text + edges).

Deterministic: the header is keyed to the current commit (sha + commit date), never
the wall clock, so re-running on the same commit produces an identical file (no CI
churn). Run it whenever you add files or change structure:

    python scripts/gen_codemap.py

CI runs it automatically on every push to main (.github/workflows/codemap.yml).
Do not hand-edit CODEMAP.md — your edits will be overwritten.
"""
from __future__ import annotations

import ast
import os
import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "CODEMAP.md"

# Directories never worth mapping (also mostly .gitignore'd, but belt-and-suspenders).
IGNORE_DIRS = {
    ".git", "node_modules", ".next", ".venv", "venv", "__pycache__",
    ".pytest_cache", ".mypy_cache", "dist", "build", "out", ".turbo", "coverage",
}
# Heavy binaries we count but never list/parse.
BINARY_EXTS = {".pdf", ".woff", ".woff2", ".ttf", ".otf", ".ico", ".png", ".jpg",
               ".jpeg", ".gif", ".webp", ".svg", ".mp4", ".zip", ".lock"}
CODE_EXTS = {".py", ".ts", ".tsx", ".js", ".jsx", ".mjs"}

# path-prefix -> (area key, human label). First match wins; order matters.
AREAS = [
    ("frontend/", ("frontend", "Frontend — Next.js 16 / React 19 / Tailwind (compliance matrix UI)")),
    ("backend/", ("backend", "Backend — FastAPI (PDF ingest, extraction, REST API)")),
    ("engine/", ("engine", "Engine — reconcile / eval / answer-draft pipeline + tests")),
    ("prompts/", ("prompts", "Prompts — LLM prompt specs (extraction, classification, answers, gaps)")),
    ("gold-set/", ("gold", "Eval gold-set — hand-labelled requirements for accuracy measurement")),
    ("data/", ("data", "Data — tender source PDFs (not parsed here)")),
    ("comms/", ("comms", "Comms — async agent message boards")),
    ("docs/", ("docs", "Docs — plans & specs")),
    (".github/", ("ci", "CI — GitHub Actions")),
    ("scripts/", ("tooling", "Tooling — repo scripts (incl. this map generator)")),
]


def sh(*args: str) -> str:
    try:
        return subprocess.check_output(args, cwd=ROOT, text=True, stderr=subprocess.DEVNULL).strip()
    except Exception:
        return ""


def tracked_files() -> list[str]:
    out = sh("git", "ls-files")
    if out:
        files = out.splitlines()
    else:  # fallback: walk the tree
        files = []
        for dp, dns, fns in os.walk(ROOT):
            dns[:] = [d for d in dns if d not in IGNORE_DIRS]
            for fn in fns:
                files.append(str(Path(dp, fn).relative_to(ROOT)).replace(os.sep, "/"))
    keep = []
    for f in files:
        parts = f.split("/")
        if any(p in IGNORE_DIRS for p in parts):
            continue
        if f == "CODEMAP.md":
            continue
        keep.append(f)
    return sorted(keep)


def area_of(path: str) -> tuple[str, str]:
    for prefix, area in AREAS:
        if path.startswith(prefix):
            return area
    return ("root", "Root — docs, config, role briefs")


def line_count(path: str) -> int:
    try:
        with open(ROOT / path, "r", encoding="utf-8", errors="ignore") as fh:
            return sum(1 for _ in fh)
    except Exception:
        return 0


# ---------------------------------------------------------------- descriptions

def py_doc(path: str) -> str:
    try:
        tree = ast.parse((ROOT / path).read_text(encoding="utf-8", errors="ignore"))
        doc = ast.get_docstring(tree) or ""
    except Exception:
        return ""
    first = doc.strip().splitlines()[0] if doc.strip() else ""
    # docstrings here look like "answer.py — auditable autofill: ..."; trim the "name —"
    first = re.sub(r"^[\w./-]+\.py\s*[—:-]\s*", "", first)
    return first.strip()


TS_LEAD_COMMENT = re.compile(r"^\s*(?:/\*+\s*(.*?)\s*\*/|//\s*(.*))", re.S)


def ts_doc(path: str) -> str:
    try:
        txt = (ROOT / path).read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""
    m = TS_LEAD_COMMENT.match(txt)
    if m:
        c = (m.group(1) or m.group(2) or "").strip().splitlines()[0]
        c = c.lstrip("*").strip()
        if c:
            return c
    # fall back to the first exported symbol
    m = re.search(r"export\s+(?:default\s+)?(?:async\s+)?(?:function|const|class|type|interface)\s+(\w+)", txt)
    if m:
        return f"exports `{m.group(1)}`"
    return ""


def describe(path: str) -> str:
    if path.endswith(".py"):
        return py_doc(path)
    if Path(path).suffix in {".ts", ".tsx", ".js", ".jsx", ".mjs"}:
        return ts_doc(path)
    return ""


# ---------------------------------------------------------------- python edges

def py_module(path: str) -> str:
    return path[:-3].replace("/", ".") if path.endswith(".py") else ""


def py_edges(py_files: list[str]) -> list[tuple[str, str]]:
    mods = {py_module(f): f for f in py_files}
    edges: set[tuple[str, str]] = set()
    for f in py_files:
        src_mod = py_module(f)
        pkg = src_mod.rsplit(".", 1)[0] if "." in src_mod else ""
        try:
            tree = ast.parse((ROOT / f).read_text(encoding="utf-8", errors="ignore"))
        except Exception:
            continue
        targets: set[str] = set()
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for a in node.names:
                    targets.add(a.name)
            elif isinstance(node, ast.ImportFrom):
                if node.level:  # relative import: resolve against this file's package
                    base = pkg
                    for _ in range(node.level - 1):
                        base = base.rsplit(".", 1)[0] if "." in base else ""
                    targets.add(f"{base}.{node.module}" if node.module else base)
                elif node.module:
                    targets.add(node.module)
        for t in targets:
            # match the longest known internal module that is a prefix of the import
            cand = t
            while cand:
                if cand in mods and mods[cand] != f:
                    edges.add((f, mods[cand]))
                    break
                cand = cand.rsplit(".", 1)[0] if "." in cand else ""
    return sorted(edges)


# ------------------------------------------------------------ typescript edges

TS_IMPORT = re.compile(r"""(?:import|export)\b[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)""")


def ts_resolve(spec: str, from_file: str, ts_files: set[str]) -> str | None:
    if spec.startswith("@/"):
        base = "frontend/src/" + spec[2:]
    elif spec.startswith("."):
        base = os.path.normpath(os.path.join(os.path.dirname(from_file), spec)).replace(os.sep, "/")
    else:
        return None  # bare package import — external
    for cand in (base, base + ".ts", base + ".tsx", base + ".js", base + ".jsx",
                 base + "/index.ts", base + "/index.tsx"):
        if cand in ts_files:
            return cand
    return None


def ts_edges(ts_list: list[str]) -> list[tuple[str, str]]:
    ts_files = set(ts_list)
    edges: set[tuple[str, str]] = set()
    for f in ts_list:
        try:
            txt = (ROOT / f).read_text(encoding="utf-8", errors="ignore")
        except Exception:
            continue
        for m in TS_IMPORT.finditer(txt):
            spec = m.group(1) or m.group(2)
            tgt = ts_resolve(spec, f, ts_files)
            if tgt and tgt != f:
                edges.add((f, tgt))
    return sorted(edges)


# ------------------------------------------------------------------- mermaid

def mermaid(edges: list[tuple[str, str]], label, nodes: list[str]) -> list[str]:
    if not edges:
        return ["```", "(no internal import edges detected)", "```"]
    ids: dict[str, str] = {}

    def nid(p: str) -> str:
        if p not in ids:
            ids[p] = "n%d" % len(ids)
        return ids[p]

    lines = ["```mermaid", "graph LR"]
    connected = {a for a, _ in edges} | {b for _, b in edges}
    for a, b in edges:
        lines.append(f"  {nid(a)}[{label(a)}] --> {nid(b)}[{label(b)}]")
    # show islands (files with no internal edges) so the map is honest about coverage
    islands = [n for n in nodes if n not in connected]
    for n in islands[:40]:
        lines.append(f"  {nid(n)}[{label(n)}]")
    lines.append("```")
    return lines


# --------------------------------------------------------------------- render

def main() -> int:
    files = tracked_files()
    by_area: dict[str, list[str]] = defaultdict(list)
    labels: dict[str, str] = {}
    for f in files:
        key, lbl = area_of(f)
        by_area[key].append(f)
        labels[key] = lbl

    sha = sh("git", "rev-parse", "--short", "HEAD") or "(unknown)"
    cdate = sh("git", "show", "-s", "--format=%cI", "HEAD") or "(unknown)"

    L: list[str] = []
    L.append("# CODEMAP — auto-generated map of this repository")
    L.append("")
    L.append("> **Do not hand-edit.** Regenerated by `scripts/gen_codemap.py` on every push to `main` "
             "(`.github/workflows/codemap.yml`). To refresh locally: `python scripts/gen_codemap.py`.")
    L.append(">")
    L.append(f"> Map of commit `{sha}` · {cdate}")
    L.append("")
    L.append("**Read this first** for a current picture of the codebase — what lives where, and what "
             "imports what. It is the fast path to context for both humans and agents. If it looks wrong, "
             "it is stale: re-run the generator and push.")
    L.append("")

    # ---- area summary table
    L.append("## Areas at a glance")
    L.append("")
    L.append("| Area | Files | Lines | What it is |")
    L.append("|------|-------|-------|------------|")
    order = ["frontend", "backend", "engine", "prompts", "gold", "data",
             "comms", "docs", "ci", "tooling", "root"]
    for key in order:
        if key not in by_area:
            continue
        fl = by_area[key]
        loc = sum(line_count(f) for f in fl if Path(f).suffix not in BINARY_EXTS)
        L.append(f"| **{key}** | {len(fl)} | {loc:,} | {labels[key]} |")
    L.append("")

    # ---- system-level graph (hand-derived from how the areas actually connect)
    L.append("## System shape")
    L.append("")
    L.append("```mermaid")
    L.append("graph LR")
    L.append("  data[tender PDFs] --> backend")
    L.append("  prompts[prompt specs] --> backend")
    L.append("  prompts --> engine")
    L.append("  backend[Backend API: backend/app] --> engine[Engine: reconcile, eval, answer]")
    L.append("  frontend[Frontend UI: frontend/src] -. HTTP .-> backend")
    L.append("  gold[eval gold-set] --> engine")
    L.append("```")
    L.append("")
    L.append("*Frontend ↔ Backend is an HTTP boundary (`frontend/src/lib/api.ts`), not an import — "
             "shown dashed. Everything else is a real code dependency.*")
    L.append("")

    # ---- dependency graphs from real edges
    # disambiguate route/package files whose basename repeats (page.tsx, __init__.py, …)
    AMBIGUOUS = {"page.tsx", "layout.tsx", "route.ts", "index.ts", "index.tsx", "__init__.py"}

    def smart_label(p: str) -> str:
        parts = p.split("/")
        base = parts[-1]
        if base in AMBIGUOUS and len(parts) >= 2:
            return "/".join(parts[-2:])
        return base

    fe = sorted(f for f in by_area.get("frontend", []) if Path(f).suffix in {".ts", ".tsx", ".js", ".jsx", ".mjs"} and "/src/" in f)
    if fe:
        L.append("## Frontend module graph (`frontend/src`)")
        L.append("")
        L += mermaid(ts_edges(fe), smart_label, fe)
        L.append("")

    py = sorted(f for f in (by_area.get("backend", []) + by_area.get("engine", [])) if f.endswith(".py"))
    py_app = [f for f in py if "/tests/" not in f
              and not f.split("/")[-1].startswith("test_")
              and f.split("/")[-1] != "__init__.py"]
    if py_app:
        L.append("## Backend + Engine module graph (Python, tests excluded)")
        L.append("")
        L += mermaid(py_edges(py_app), smart_label, py_app)
        L.append("")

    # ---- per-area file listing with one-liners
    L.append("## Files by area")
    L.append("")
    for key in order:
        if key not in by_area:
            continue
        fl = by_area[key]
        L.append(f"### {key} — {labels[key]}")
        L.append("")
        if key == "data":
            pdfs = [f for f in fl if f.endswith(".pdf")]
            L.append(f"{len(pdfs)} tender PDF(s) under `data/` (source corpus; not listed individually).")
            L.append("")
            continue
        shown = [f for f in fl if Path(f).suffix not in BINARY_EXTS]
        for f in shown:
            d = describe(f)
            L.append(f"- `{f}`" + (f" — {d}" if d else ""))
        bin_n = len(fl) - len(shown)
        if bin_n:
            L.append(f"- *(+{bin_n} binary/asset file(s))*")
        L.append("")

    L.append("---")
    L.append("")
    L.append(f"*{len(files)} tracked files mapped. Generated by `scripts/gen_codemap.py`.*")

    OUT.write_text("\n".join(L) + "\n", encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)} — {len(files)} files, "
          f"{len(by_area)} areas, commit {sha}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
