# Prior Art — "similar tools exist, here's how we differ"

> Owned by J (per Ming: name the incumbents honestly, then show the wedge). Goes in the README + the
> submission. Honesty here is a credibility signal to enterprise judges — don't pretend we're first.

---

## The landscape (we are not first — and we say so)

| Tool / camp | What it does | Why it's not us |
|---|---|---|
| **AutogenAI** | Generative — "AI writes your bid". Enterprise-priced. | Generation black box; treats *reading the tender* as a solved pre-step. Priced out of the SME long tail. |
| **Loopio / Responsive** (RFP libraries) | Reuse past answers from a maintained content library. | Needs a curated library you must maintain; doesn't extract/verify the tender's requirements. |
| **Constructionline "X-Ray"** | Extracts requirements + flags missed items on **construction** packs (incl. drawings), ~10k firms. | Construction niche, drawing-heavy parsing. We deliberately chose **text-based public-sector** instead. |
| **NotebookLM / generic LLM chat** | Summarise/ask a PDF. | Closed, unmeasurable, no structured output, no grounding we control, no decision capture. Not a product we can claim. |

## How Bidframe differs (the wedge, in priority order)

1. **Auditable extraction.** Every requirement traces to the exact clause/page it came from — one click to
   verify. Both incumbent camps treat "read the tender → figure out the requirements" as a black box. *(Our
   most confident gap; it's also our strongest feature.)*
2. **The disqualifier catch as a loud, first-class feature.** Public tenders have hard pass/fail gates;
   tools bury them in a flat list. We grab you and say "miss this = disqualified."
3. **A completeness guarantee — measured recall.** "Found 98%, here are the 2% we flagged." Nobody else
   quantifies what they might have *missed* — and a missed requirement is the bid manager's real fear.
4. **Human-in-control compliance workflow** (approve/edit/flag each requirement) rather than "AI writes it
   for you." Conduct's exact thesis.
5. **Decision capture.** The judgment calls a bid manager makes evaporate today; we record them as reusable,
   compounding context. Our direct bridge to Conduct.
6. **Requirement → award-criterion → weighting mapping.** "Where do the most marks live." Bidders want it;
   tools rarely connect it.
7. **Affordability / segment** (positioning, not a feature). Built for the SME bidders + small consultancies
   AutogenAI prices out.

## The one-sentence differentiator (README headline)

> "AutogenAI writes bids for big firms at enterprise prices. Bidframe gives the SME bidder an **auditable**
> requirement breakdown and compliance matrix — every requirement traceable to its source clause, the
> disqualifying ones flagged, the human approving each — then drafts the response from their own evidence.
> So they can *trust* it, not just generate text."

## On the autofill extension (pre-empt the "so it's AutogenAI?" question)

We *do* draft answers — but the difference is **auditable autofill**: every claim is grounded in the
bidder's own evidence and traceable, and the tool asks rather than bluffs when it can't answer. We compete
on *trust and verifiability*, not on prose generation. (See `autofill-scope-decision.md`.)

### Changelog
- **2026-06-28 (Day 1)** — v1 by J. Verify AutogenAI/Loopio feature claims on their pages + in traction calls.
