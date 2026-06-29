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


# disambiguate route/package files whose basename repeats (page.tsx, __init__.py, …)
AMBIGUOUS = {"page.tsx", "layout.tsx", "route.ts", "index.ts", "index.tsx", "__init__.py"}


def smart_label(p: str) -> str:
    parts = p.split("/")
    base = parts[-1]
    if base in AMBIGUOUS and len(parts) >= 2:
        return "/".join(parts[-2:])
    return base


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


# ----------------------------------------------------- interactive html (tier 2)

HTML_OUT = ROOT / "frontend" / "public" / "codemap.html"


def node_area(p: str) -> str:
    if p.startswith("frontend/"):
        return "frontend"
    if p.startswith("backend/"):
        return "backend"
    if p.startswith("engine/"):
        return "engine"
    return "other"


def build_graph_data(by_area: dict, sha: str, cdate: str) -> dict:
    fe = sorted(f for f in by_area.get("frontend", [])
                if Path(f).suffix in {".ts", ".tsx", ".js", ".jsx", ".mjs"} and "/src/" in f)
    py = sorted(f for f in (by_area.get("backend", []) + by_area.get("engine", [])) if f.endswith(".py"))
    py_app = [f for f in py if "/tests/" not in f
              and not f.split("/")[-1].startswith("test_")
              and f.split("/")[-1] != "__init__.py"]
    code = fe + py_app
    nodes = [{"id": f, "label": smart_label(f), "area": node_area(f),
              "desc": describe(f), "loc": line_count(f)} for f in code]
    edges = ts_edges(fe) + py_edges(py_app)
    links = [{"source": a, "target": b, "kind": "import"} for a, b in edges]
    api, be_main = "frontend/src/lib/api.ts", "backend/app/main.py"
    code_set = set(code)
    if api in code_set and be_main in code_set:  # the HTTP boundary that imports can't see
        links.append({"source": api, "target": be_main, "kind": "http"})
    return {"meta": {"sha": sha, "date": cdate, "nodes": len(nodes), "links": len(links)},
            "nodes": nodes, "links": links}


# Self-contained: no CDN, no build step, no external fonts. Open the file directly
# or hit /codemap.html on the Vercel deploy. DATA is injected between the two halves.
HTML_HEAD = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CODEMAP — interactive codebase graph</title>
<style>
*{box-sizing:border-box}html,body{margin:0;height:100%;font:14px/1.4 system-ui,"Segoe UI",Roboto,sans-serif;color:#0f172a;background:#f8fafc}
#bar{position:fixed;inset:0 0 auto 0;height:56px;display:flex;align-items:center;gap:14px;padding:0 16px;background:#ffffffe6;backdrop-filter:blur(6px);border-bottom:1px solid #e2e8f0;z-index:5}
.title{font-weight:700;font-size:15px;letter-spacing:.3px}.sub{font-weight:400;color:#64748b;font-size:12px;margin-left:8px}
#search{margin-left:auto;width:200px;padding:6px 10px;border:1px solid #cbd5e1;border-radius:8px;font:inherit}
#legend{display:flex;gap:6px}
.chip{display:flex;align-items:center;gap:6px;border:1px solid #e2e8f0;background:#fff;border-radius:999px;padding:4px 10px;font-size:12px;cursor:pointer;color:#334155}
.chip i{width:10px;height:10px;border-radius:50%;background:var(--c)}.chip.off{opacity:.4}
.hint{position:fixed;bottom:10px;left:16px;font-size:11px;color:#94a3b8;z-index:5}
#svg{position:fixed;inset:56px 0 0 0;width:100%;height:calc(100% - 56px);cursor:grab;touch-action:none}#svg:active{cursor:grabbing}
.link{stroke:#cbd5e1;stroke-width:1.2}.link.http{stroke:#94a3b8;stroke-dasharray:5 4}.link.dim{opacity:.06}
.node{cursor:pointer}.node circle{stroke:#fff;stroke-width:1.5}
.node .lbl{font-size:10px;fill:#475569;text-anchor:middle;paint-order:stroke;stroke:#f8fafc;stroke-width:3px;pointer-events:none}
.node.sel circle{stroke:#0f172a;stroke-width:2.5}.node.dim{opacity:.12}.node.hide{display:none}
#tip{position:fixed;z-index:9;max-width:300px;background:#0f172a;color:#f1f5f9;padding:8px 10px;border-radius:8px;font-size:12px;pointer-events:none;box-shadow:0 6px 24px #0003}
#tip .p{color:#94a3b8;font-size:11px;word-break:break-all}#tip .m{color:#cbd5e1;font-size:11px}
#panel{position:fixed;bottom:16px;right:16px;width:300px;max-height:62%;overflow:auto;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;box-shadow:0 10px 40px #0002;z-index:6}
#panel h3{margin:0 0 2px;font-size:15px;word-break:break-all}#panel .path{color:#64748b;font-size:11px;word-break:break-all;margin-bottom:8px}
#panel .meta2{color:#475569;font-size:12px;margin:6px 0}#panel p{margin:6px 0;color:#334155}
#panel .x{position:absolute;top:8px;right:10px;border:0;background:none;font-size:18px;cursor:pointer;color:#94a3b8}
#panel h4{margin:10px 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#94a3b8}
#panel ul{margin:0;padding-left:16px}#panel li{font-size:12px;margin:2px 0}
</style></head><body>
<header id="bar"><div class="title">CODEMAP<span class="sub" id="meta"></span></div>
<input id="search" placeholder="search files…"><div id="legend"></div></header>
<svg id="svg" xmlns="http://www.w3.org/2000/svg"><defs>
<marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
<path d="M0 0 L10 5 L0 10 z" fill="#94a3b8"/></marker></defs>
<g id="view"><g id="links"></g><g id="nodes"></g></g></svg>
<div class="hint">scroll = zoom · drag background = pan · drag node = move · click node = focus · click a legend chip to toggle an area</div>
<aside id="panel" hidden></aside><div id="tip" hidden></div>
<script>
"""

HTML_JS = r"""
const AREA_COLORS={frontend:'#2563eb',backend:'#d97706',engine:'#7c3aed',other:'#64748b'};
const AREA_LABEL={frontend:'Frontend (TS / React)',backend:'Backend (FastAPI)',engine:'Engine (Python)'};
const $=id=>document.getElementById(id);
const svg=$('svg'),view=$('view'),gL=$('links'),gN=$('nodes'),tip=$('tip'),panel=$('panel');
$('meta').textContent=`map of commit ${DATA.meta.sha} · ${DATA.meta.nodes} files · ${DATA.meta.links} edges`;
const NS='http://www.w3.org/2000/svg';
const nodes=DATA.nodes,links=DATA.links,byId=new Map(nodes.map(n=>[n.id,n]));
links.forEach(l=>{l.s=byId.get(l.source);l.t=byId.get(l.target);});
const adj=new Map(nodes.map(n=>[n.id,new Set()]));
links.forEach(l=>{if(l.s&&l.t){adj.get(l.s.id).add(l.t.id);adj.get(l.t.id).add(l.s.id);}});
nodes.forEach(n=>n.deg=adj.get(n.id).size);
const esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rnd=mulberry32(42);
let W=svg.clientWidth||1100,H=svg.clientHeight||640;
const cx={frontend:W*0.26,backend:W*0.74,engine:W*0.5,other:W*0.5};
nodes.forEach(n=>{n.x=(cx[n.area]||W/2)+(rnd()-0.5)*240;n.y=H/2+(rnd()-0.5)*440;n.vx=0;n.vy=0;});
const R=n=>6+Math.min(20,Math.sqrt(n.loc||1));
const linkEls=links.map(l=>{const e=document.createElementNS(NS,'line');e.setAttribute('class','link'+(l.kind==='http'?' http':''));e.setAttribute('marker-end','url(#arrow)');gL.appendChild(e);return e;});
const nodeEls=nodes.map(n=>{const g=document.createElementNS(NS,'g');g.setAttribute('class','node');const c=document.createElementNS(NS,'circle');c.setAttribute('r',R(n));c.setAttribute('fill',AREA_COLORS[n.area]||'#64748b');const t=document.createElementNS(NS,'text');t.setAttribute('class','lbl');t.setAttribute('dy',-R(n)-4);t.textContent=n.label;g.appendChild(c);g.appendChild(t);gN.appendChild(g);n._g=g;return g;});
let vx=0,vy=0,vk=1;const applyView=()=>view.setAttribute('transform',`translate(${vx},${vy}) scale(${vk})`);applyView();
let alpha=1,running=true;
function stepForce(){for(const n of nodes){n.vx+=((cx[n.area]||W/2)-n.x)*0.0009*alpha;n.vy+=(H/2-n.y)*0.0007*alpha;}
for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j];let dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy||0.01,d=Math.sqrt(d2),f=2800/d2,fx=dx/d*f,fy=dy/d*f;a.vx+=fx;a.vy+=fy;b.vx-=fx;b.vy-=fy;}
for(const l of links){if(!l.s||!l.t)continue;let dx=l.t.x-l.s.x,dy=l.t.y-l.s.y,d=Math.hypot(dx,dy)||0.01,f=(d-95)/d*0.05*alpha,fx=dx*f,fy=dy*f;l.s.vx+=fx;l.s.vy+=fy;l.t.vx-=fx;l.t.vy-=fy;}
for(const n of nodes){if(n._pin)continue;n.x+=n.vx;n.y+=n.vy;n.vx*=0.82;n.vy*=0.82;}alpha*=0.986;}
function draw(){for(let i=0;i<links.length;i++){const l=links[i],e=linkEls[i];if(!l.s||!l.t)continue;let dx=l.t.x-l.s.x,dy=l.t.y-l.s.y,d=Math.hypot(dx,dy)||1,r1=R(l.s)+2,r2=R(l.t)+6;e.setAttribute('x1',l.s.x+dx/d*r1);e.setAttribute('y1',l.s.y+dy/d*r1);e.setAttribute('x2',l.t.x-dx/d*r2);e.setAttribute('y2',l.t.y-dy/d*r2);}
for(const n of nodes)n._g.setAttribute('transform',`translate(${n.x},${n.y})`);}
function loop(){for(let k=0;k<2;k++)stepForce();draw();if(alpha>0.012)requestAnimationFrame(loop);else running=false;}
function reheat(a){alpha=Math.max(alpha,a||0.5);if(!running){running=true;loop();}}
loop();
// ---- interaction ----
let selected=null;const hidden=new Set();
function render(){const q=$('search').value.trim().toLowerCase();const nbr=selected?new Set([selected,...adj.get(selected)]):null;
nodes.forEach(n=>{let dim=false;if(hidden.has(n.area))dim=true;if(nbr&&!nbr.has(n.id))dim=true;if(q&&!(n.label.toLowerCase().includes(q)||n.id.toLowerCase().includes(q)))dim=true;n._g.setAttribute('class','node'+(selected===n.id?' sel':'')+(dim?' dim':'')+(hidden.has(n.area)?' hide':''));});
links.forEach((l,i)=>{if(!l.s||!l.t)return;let dim=false;if(hidden.has(l.s.area)||hidden.has(l.t.area))dim=true;if(selected)dim=dim||!(l.s.id===selected||l.t.id===selected);linkEls[i].setAttribute('class','link'+(l.kind==='http'?' http':'')+(dim?' dim':''));});}
function lst(title,arr){return arr.length?`<h4>${title} (${arr.length})</h4><ul>${arr.map(x=>'<li>'+esc(x)+'</li>').join('')}</ul>`:'';}
function showPanel(id){if(!id){panel.hidden=true;return;}const n=byId.get(id);const out=links.filter(l=>l.s&&l.s.id===id&&l.t).map(l=>l.t.label).sort();const inc=links.filter(l=>l.t&&l.t.id===id&&l.s).map(l=>l.s.label).sort();panel.hidden=false;panel.innerHTML=`<button class="x" onclick="select(null)">×</button><h3>${esc(n.label)}</h3><div class="path">${esc(n.id)}</div>${n.desc?'<p>'+esc(n.desc)+'</p>':''}<div class="meta2">${n.loc} lines · ${n.area}</div>${lst('imports',out)}${lst('imported by',inc)}`;}
window.select=function(id){selected=id;render();showPanel(id);};
// build legend
Object.keys(AREA_LABEL).forEach(a=>{const b=document.createElement('button');b.className='chip';b.style.setProperty('--c',AREA_COLORS[a]);b.innerHTML='<i></i>'+AREA_LABEL[a];b.onclick=()=>{hidden.has(a)?hidden.delete(a):hidden.add(a);b.classList.toggle('off');render();reheat(0.25);};$('legend').appendChild(b);});
$('search').addEventListener('input',render);
// zoom
svg.addEventListener('wheel',e=>{e.preventDefault();const r=svg.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top,k2=Math.min(4,Math.max(0.2,vk*(1-e.deltaY*0.0015)));vx=mx-(mx-vx)*(k2/vk);vy=my-(my-vy)*(k2/vk);vk=k2;applyView();},{passive:false});
// pan + drag
let dragN=null,panning=false,last=null,down=null,moved=false;
svg.addEventListener('pointerdown',e=>{const nd=e.target.closest('.node');down=last={x:e.clientX,y:e.clientY};moved=false;if(nd){dragN=nodes[nodeEls.indexOf(nd)];dragN._pin=true;}else panning=true;svg.setPointerCapture(e.pointerId);});
svg.addEventListener('pointermove',e=>{if(!dragN&&!panning)return;if(dragN){const r=svg.getBoundingClientRect();dragN.x=(e.clientX-r.left-vx)/vk;dragN.y=(e.clientY-r.top-vy)/vk;reheat(0.2);draw();}else{vx+=e.clientX-last.x;vy+=e.clientY-last.y;applyView();}if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>4)moved=true;last={x:e.clientX,y:e.clientY};});
svg.addEventListener('pointerup',e=>{if(dragN){dragN._pin=false;dragN=null;}panning=false;});
// hover tooltip
gN.addEventListener('mousemove',e=>{const nd=e.target.closest('.node');if(!nd){tip.hidden=true;return;}const n=nodes[nodeEls.indexOf(nd)];tip.hidden=false;tip.innerHTML=`<b>${esc(n.label)}</b><br><span class="p">${esc(n.id)}</span>${n.desc?'<br>'+esc(n.desc):''}<br><span class="m">${n.loc} lines · ${n.deg} link(s)</span>`;tip.style.left=Math.min(e.clientX+14,innerWidth-300)+'px';tip.style.top=(e.clientY+14)+'px';});
gN.addEventListener('mouseleave',()=>tip.hidden=true);
// click to focus (ignore if it was a drag)
svg.addEventListener('click',e=>{if(moved)return;const nd=e.target.closest('.node');if(nd){const n=nodes[nodeEls.indexOf(nd)];select(n.id===selected?null:n.id);}else select(null);});
addEventListener('resize',()=>{W=svg.clientWidth;H=svg.clientHeight;});
</script></body></html>
"""


def write_html(data: dict) -> None:
    import json
    payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    HTML_OUT.parent.mkdir(parents=True, exist_ok=True)
    HTML_OUT.write_text(HTML_HEAD + "const DATA=" + payload + ";\n" + HTML_JS,
                        encoding="utf-8", newline="\n")


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
    L.append("> **Interactive graph:** [`frontend/public/codemap.html`](frontend/public/codemap.html) — "
             "drag / zoom / click-to-focus; served at `/codemap.html` on the Vercel deploy. "
             "(The diagrams below render right here on GitHub.)")
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

    OUT.write_text("\n".join(L) + "\n", encoding="utf-8", newline="\n")

    graph = build_graph_data(by_area, sha, cdate)
    write_html(graph)

    print(f"wrote {OUT.relative_to(ROOT)} — {len(files)} files, {len(by_area)} areas, commit {sha}")
    print(f"wrote {HTML_OUT.relative_to(ROOT)} — {graph['meta']['nodes']} nodes, {graph['meta']['links']} edges")
    return 0


if __name__ == "__main__":
    sys.exit(main())
