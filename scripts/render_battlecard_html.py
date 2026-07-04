#!/usr/bin/env python3
"""Render the demo-day Q&A markdown into a self-contained HTML battlecard.

Source of truth stays `demo/q-and-a-battlecard.md`; this script emits a readable,
printable, WhatsApp-sendable artifact at `demo/q-and-a-battlecard.html`.
"""
from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "demo" / "q-and-a-battlecard.md"
OUT = ROOT / "demo" / "q-and-a-battlecard.html"


CSS = r"""
:root {
  --paper: #f7f0e4;
  --sheet: #fffaf1;
  --ink: #201815;
  --muted: #6f6257;
  --line: #ded0bd;
  --line-strong: #c4ad94;
  --forest: #214e3a;
  --forest-soft: #e5eee8;
  --oxblood: #9e2f27;
  --oxblood-soft: #f5dfdc;
  --gold: #b7832f;
  --gold-soft: #f5ead7;
  --shadow: 0 18px 60px rgba(42, 28, 18, 0.10);
}

* { box-sizing: border-box; }

html {
  scroll-behavior: smooth;
  background: var(--paper);
  color: var(--ink);
}

body {
  margin: 0;
  font: 17px/1.62 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(158, 47, 39, 0.08), transparent 34rem),
    linear-gradient(180deg, #fbf5ea 0%, var(--paper) 44%, #f4eadb 100%);
}

a { color: var(--forest); text-decoration-thickness: 0.08em; text-underline-offset: 0.18em; }

.page {
  width: min(1180px, calc(100vw - 32px));
  margin: 0 auto;
  padding: 28px 0 64px;
}

.hero {
  border: 1px solid var(--line);
  background: rgba(255, 250, 241, 0.94);
  border-radius: 28px;
  padding: clamp(24px, 4vw, 46px);
  box-shadow: var(--shadow);
}

.eyebrow {
  color: var(--oxblood);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h1, h2, h3 {
  font-family: Georgia, "Times New Roman", serif;
  line-height: 1.08;
  margin: 0;
}

h1 {
  max-width: 820px;
  margin-top: 10px;
  font-size: clamp(2.35rem, 7vw, 5.7rem);
  letter-spacing: -0.055em;
}

.subtitle {
  max-width: 780px;
  margin: 20px 0 0;
  color: var(--muted);
  font-size: clamp(1.05rem, 2.4vw, 1.28rem);
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fffdf7;
  color: var(--ink);
  padding: 8px 12px;
  font-size: 0.86rem;
  font-weight: 800;
  white-space: nowrap;
}

.pill strong { color: var(--forest); }

.source-note {
  margin-top: 24px;
  border-left: 5px solid var(--forest);
  background: var(--forest-soft);
  color: #173629;
  border-radius: 16px;
  padding: 16px 18px;
  font-size: 0.96rem;
}

.layout {
  display: grid;
  grid-template-columns: 254px minmax(0, 1fr);
  gap: 24px;
  margin-top: 26px;
  align-items: start;
}

.toc {
  position: sticky;
  top: 18px;
  border: 1px solid var(--line);
  background: rgba(255, 250, 241, 0.86);
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(42, 28, 18, 0.06);
}

.toc h2 {
  margin-bottom: 12px;
  font-size: 1.02rem;
  letter-spacing: -0.02em;
}

.toc a {
  display: block;
  border-radius: 12px;
  color: var(--ink);
  padding: 8px 10px;
  text-decoration: none;
  font-size: 0.92rem;
}

.toc a:hover, .toc a:focus {
  background: var(--gold-soft);
  outline: none;
}

.print-button {
  width: 100%;
  margin-top: 14px;
  border: 0;
  border-radius: 14px;
  background: var(--ink);
  color: #fffaf1;
  cursor: pointer;
  padding: 11px 13px;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 900;
}

.section {
  scroll-margin-top: 20px;
  margin-bottom: 28px;
}

.section > h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0 14px;
  color: var(--ink);
  font-size: clamp(1.55rem, 3.4vw, 2.35rem);
  letter-spacing: -0.04em;
}

.section > h2::before {
  content: "";
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--oxblood);
  box-shadow: 0 0 0 6px var(--oxblood-soft);
  flex: 0 0 auto;
}

.card {
  border: 1px solid var(--line);
  border-radius: 24px;
  background: rgba(255, 250, 241, 0.96);
  box-shadow: 0 8px 26px rgba(42, 28, 18, 0.07);
  padding: clamp(18px, 3vw, 26px);
  margin-bottom: 14px;
}

.card.priority {
  border-color: var(--oxblood);
  background: linear-gradient(135deg, #fffaf1 0%, #fff7ef 58%, var(--oxblood-soft) 100%);
}

.question-line {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 14px;
}

.question {
  margin: 0;
  font-size: clamp(1.12rem, 2.2vw, 1.48rem);
  font-weight: 950;
  line-height: 1.22;
  letter-spacing: -0.02em;
}

.owner {
  flex: 0 0 auto;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: #fffdf8;
  color: var(--forest);
  padding: 6px 10px;
  font-size: 0.78rem;
  font-weight: 950;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.answer {
  border-left: 5px solid var(--forest);
  background: #fffffb;
  border-radius: 16px;
  margin: 0;
  padding: 16px 18px;
  color: #2d211b;
}

.answer p { margin: 0; }

.section > p,
.card p {
  margin: 0 0 12px;
}

.route-list,
.guardrail-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.route-list li {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: #fffdf8;
  padding: 16px 18px;
}

.route-list strong {
  color: var(--forest);
  font-weight: 950;
}

.route-list em {
  color: var(--oxblood);
  font-style: normal;
  font-weight: 950;
}

.guardrail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: #fffdf8;
}

.guardrail div {
  padding: 15px 17px;
}

.guardrail .bad {
  border-right: 1px solid var(--line);
  background: var(--oxblood-soft);
}

.guardrail .good {
  background: var(--forest-soft);
}

.label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.72rem;
  font-weight: 950;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.bad .label { color: var(--oxblood); }
.good .label { color: var(--forest); }

code {
  border: 1px solid var(--line);
  border-radius: 7px;
  background: #fff7ea;
  padding: 0.08em 0.32em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.92em;
}

footer {
  margin-top: 34px;
  color: var(--muted);
  font-size: 0.9rem;
}

@media (max-width: 820px) {
  .page { width: min(100vw - 22px, 680px); padding-top: 12px; }
  .layout { grid-template-columns: 1fr; }
  .toc { position: static; }
  .question-line { display: block; }
  .owner { display: inline-flex; margin-top: 12px; }
  .guardrail { grid-template-columns: 1fr; }
  .guardrail .bad { border-right: 0; border-bottom: 1px solid var(--line); }
}

@media print {
  html, body { background: #fff; }
  body { font-size: 12pt; }
  .page { width: auto; padding: 0; }
  .hero, .card, .toc, .route-list li, .guardrail { box-shadow: none; }
  .layout { display: block; }
  .toc, .print-button { display: none; }
  .section { break-inside: avoid; page-break-inside: avoid; }
  .card { break-inside: avoid; page-break-inside: avoid; }
  a { color: inherit; text-decoration: none; }
}
"""


def slug(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "section"


def inline(markdown: str) -> str:
    """Tiny inline-markdown renderer for this controlled source file."""
    placeholders: list[str] = []

    def stash(fragment: str) -> str:
        token = f"@@HTML{len(placeholders)}@@"
        placeholders.append(fragment)
        return token

    def code_repl(match: re.Match[str]) -> str:
        return stash(f"<code>{html.escape(match.group(1))}</code>")

    def link_repl(match: re.Match[str]) -> str:
        label = html.escape(match.group(1))
        href = html.escape(match.group(2), quote=True)
        return stash(f'<a href="{href}">{label}</a>')

    markdown = re.sub(r"`([^`]+)`", code_repl, markdown)
    markdown = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link_repl, markdown)
    rendered = html.escape(markdown)
    rendered = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", rendered)
    rendered = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<em>\1</em>", rendered)

    # Links may contain inline-code labels, so restoring a link placeholder can
    # reveal a code placeholder that was hidden inside the link fragment.
    changed = True
    while changed:
        changed = False
        for idx, fragment in enumerate(placeholders):
            token = f"@@HTML{idx}@@"
            if token in rendered:
                rendered = rendered.replace(token, fragment)
                changed = True
    return rendered


def quote_html(text: str) -> str:
    return f'<blockquote class="answer"><p>{inline(text)}</p></blockquote>'


def collect_quote(lines: list[str], index: int) -> tuple[str, int]:
    parts: list[str] = []
    while index < len(lines):
        line = lines[index]
        if not line.startswith(">"):
            break
        parts.append(line[1:].strip())
        index += 1
    return " ".join(part for part in parts if part).strip(), index


def guardrail_item(text: str) -> str:
    clean = text.strip()
    if clean.startswith("❌") and "→ ✅" in clean:
        bad, good = clean.split("→ ✅", 1)
        bad = bad.removeprefix("❌").strip()
        good = good.strip()
        return (
            '<li class="guardrail">'
            f'<div class="bad"><span class="label">Do not say</span>{inline(bad)}</div>'
            f'<div class="good"><span class="label">Say instead</span>{inline(good)}</div>'
            "</li>"
        )
    return f"<li>{inline(clean)}</li>"


def render_body(markdown: str) -> tuple[str, list[tuple[str, str]], str]:
    lines = markdown.splitlines()
    title = "Q&A Battlecard — Bidframe, Demo Day"
    sections: list[tuple[str, str]] = []
    body: list[str] = []
    intro = ""
    current_heading = ""
    section_open = False
    list_open: str | None = None

    def close_list() -> None:
        nonlocal list_open
        if list_open:
            body.append("</ul>")
            list_open = None

    def close_section() -> None:
        nonlocal section_open
        close_list()
        if section_open:
            body.append("</section>")
            section_open = False

    i = 0
    while i < len(lines):
        stripped = lines[i].strip()
        if not stripped:
            i += 1
            continue

        if stripped.startswith("# "):
            title = stripped[2:].strip()
            i += 1
            continue

        if stripped.startswith(">") and not section_open and not intro:
            intro, i = collect_quote(lines, i)
            continue

        if stripped.startswith("## "):
            close_section()
            current_heading = stripped[3:].strip()
            section_id = slug(current_heading)
            sections.append((section_id, current_heading))
            priority = " priority-section" if "on-stage arithmetic" in current_heading.lower() else ""
            body.append(f'<section class="section{priority}" id="{section_id}">')
            body.append(f"<h2>{inline(current_heading)}</h2>")
            section_open = True
            i += 1
            continue

        question = re.match(r'^\*\*(.*?)\*\*\s+—\s+\*(.*?)\*\s*$', stripped)
        if question:
            close_list()
            q_text = question.group(1)
            owner = question.group(2)
            answer = ""
            j = i + 1
            while j < len(lines) and not lines[j].strip():
                j += 1
            if j < len(lines) and lines[j].startswith(">"):
                answer, j = collect_quote(lines, j)
            is_priority = "visible on the screen" in current_heading.lower() or "arithmetic" in current_heading.lower()
            card_class = "card priority" if is_priority else "card"
            body.append(f'<article class="{card_class}">')
            body.append('<div class="question-line">')
            body.append(f'<p class="question">{inline(q_text)}</p>')
            body.append(f'<span class="owner">{inline(owner)}</span>')
            body.append("</div>")
            if answer:
                body.append(quote_html(answer))
            body.append("</article>")
            i = j
            continue

        if stripped.startswith("- "):
            item_text = stripped[2:].strip()
            desired_list = "guardrail-list" if "do not say" in current_heading.lower() else "route-list"
            if list_open != desired_list:
                close_list()
                body.append(f'<ul class="{desired_list}">')
                list_open = desired_list
            if desired_list == "guardrail-list":
                body.append(guardrail_item(item_text))
            else:
                body.append(f"<li>{inline(item_text)}</li>")
            i += 1
            continue

        close_list()
        body.append(f"<p>{inline(stripped)}</p>")
        i += 1

    close_section()
    return "\n".join(body), sections, intro


def render_page() -> str:
    markdown = SRC.read_text(encoding="utf-8")
    body, sections, intro = render_body(markdown)
    toc = "\n".join(f'<a href="#{sid}">{inline(label)}</a>' for sid, label in sections)
    source_link = "demo/q-and-a-battlecard.md"
    intro_html = inline(intro) if intro else "Short answers first. Route depth to the owner. Do not guess."
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Readable Bidframe demo-day Q&A battlecard for judge questions.">
  <title>Bidframe Q&amp;A Battlecard</title>
  <style>{CSS}</style>
</head>
<body>
  <div class="page">
    <header class="hero">
      <div class="eyebrow">Bidframe · Demo Day · Judge Q&amp;A</div>
      <h1>Q&amp;A Battlecard</h1>
      <p class="subtitle">Use the first sentence as the answer. Use the rest only if the judge keeps pushing. Route technical depth to the named owner.</p>
      <div class="meta-row" aria-label="Key proof points">
        <span class="pill"><strong>10/10</strong> Bradwell labelled deal-breakers caught</span>
        <span class="pill"><strong>12/12</strong> deterministic gold catch</span>
        <span class="pill"><strong>42/42</strong> citations verified</span>
        <span class="pill"><strong>0</strong> bluffs</span>
        <span class="pill">Cached real run, not venue-wifi luck</span>
      </div>
      <div class="source-note">{intro_html}</div>
    </header>

    <div class="layout">
      <aside class="toc" aria-label="Table of contents">
        <h2>Battlecard map</h2>
        {toc}
        <button class="print-button" type="button" onclick="window.print()">Print / Save PDF</button>
      </aside>

      <main>
        {body}
      </main>
    </div>

    <footer>
      Rendered from <code>{source_link}</code>. Edit the markdown source first, then rerun
      <code>python3 scripts/render_battlecard_html.py</code>.
    </footer>
  </div>
</body>
</html>
"""


def main() -> None:
    OUT.write_text(render_page(), encoding="utf-8")
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
