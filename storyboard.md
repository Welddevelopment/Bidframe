# Bidframe Demo Day Storyboard

> 3-minute investor presentation for Conduct "Make Legacy Move" Demo Day.
> Goal: make non-procurement judges understand the tender workflow quickly, show the market is large enough to matter, then make the product feel like a guided path through a dense tender forest.

## Core Pitch

Bidframe turns a UK public-sector tender into a verified, source-linked compliance matrix in minutes. It surfaces the deal-breakers that can disqualify a bid, flags uncertainty instead of guessing, and drafts answers only from evidence the bidder can cite. The human approves every call.

## Story Feeling

The deck should feel like a journey through dense woodland, not a flat civic filing cabinet.

**Metaphor:** a tender is a thick forest of clauses. Bidframe is the marked trail: it finds the red danger markers, opens a clearing around the source evidence, and leaves the bid manager with a map they can trust.

**Visual rhythm:**

1. **Trailhead:** define the tender and the stakes.
2. **Dense woods:** show the long PDF and manual bid-work mess.
3. **Red marker:** the deal-breaker emerges in oxblood.
4. **Clearing:** source clause and evidence become visible.
5. **Canopy map:** requirements connect to scoring and future bids.
6. **Summit / ask:** bring us your tender.

Keep the official-record structure, but let the forest carry the emotional arc: pine, moss, fern edges, paper as a field notebook, oxblood as the trail warning.

## Audience Assumption

The room may include investors who understand enterprise software but not procurement language. Do not assume they know what an ITT, compliance matrix, pass/fail gate, or evidence pack is. Define the workflow before showing the product.

## Plain-English Terms

Use these definitions in the deck and script.

| Term | Plain-English Explanation |
|---|---|
| Tender / ITT | The instruction pack a public buyer publishes when it wants to buy something. It says what they need, what suppliers must prove, and how bids will be scored. |
| Bid | The supplier's response to that tender. This is how they try to win the contract. |
| Requirement | One thing the supplier must do, prove, return, price, or answer. |
| Deal-breaker / pass-fail gate | A mandatory rule where getting it wrong can disqualify the whole bid before the good parts are read. |
| Compliance matrix | The checklist bid teams build to track every requirement and whether the supplier can meet it. |
| Evidence | The supplier's own documents: certificates, policies, method statements, case studies, insurance, references. |
| Source traceability | Every requirement links back to the exact page and clause in the tender. |
| Auditable autofill | Drafted answers that cite the bidder's own evidence. If there is no evidence, Bidframe asks a question instead of inventing an answer. |

## Statistics To Weave In

Use only 2 or 3 statistics on stage. Keep the rest for Q&A or backup slides.

### Market Stats

| Stat | Why It Matters | Suggested Wording |
|---|---|---|
| UK public bodies spent about **GBP 341bn** on procurement from the private sector in 2023-24, around **32% of public spending**. | This is a real, enormous workflow, not a niche admin task. | "This is not a tiny paperwork problem. UK public procurement is a GBP 300bn-plus market." |
| The new UK Procurement Act regime went live on **24 February 2025**. | Fresh regulation means suppliers need help understanding rules and compliance. | "The rules are changing now, which makes compliance tooling timely." |
| Crown Commercial Service material reported that **72% of suppliers available through its commercial agreements were micro, small, or medium-sized enterprises**. | Supports the SME wedge. | "This is not only a big-prime market. SMEs are all over the supplier base." |
| G-Cloud reached **GBP 2.91bn** annual sales in 2024-25, and has historically been SME-heavy. | Public-sector frameworks can create big software and services markets. | "Frameworks like G-Cloud show how large these public-sector routes can become." |

**Source notes to verify before final deck:** market figures are from public procurement summaries citing House of Commons Library / Cabinet Office / Crown Commercial Service materials. Before submission, replace this note with primary links if the slides quote these numbers directly.

Useful starting links:

- UK public procurement overview and current headline spend figure: https://en.wikipedia.org/wiki/Government_procurement_in_the_United_Kingdom
- Procurement Act 2023 primary legislation: https://www.legislation.gov.uk/ukpga/2023/54/contents
- G-Cloud overview and sales history: https://en.wikipedia.org/wiki/UK_Government_G-Cloud

Do not leave Wikipedia as the final slide source if there is time to chase the House of Commons Library / Cabinet Office primary references.

### Product Stats

| Stat | Where It Comes From | How To Say It |
|---|---|---|
| **Every deal-breaker caught** on the hero tender. | `demo-narrative.md`, `STATUS.md`, pre-baked SPSO run. | "On our worked example, every disqualifying gate is surfaced." |
| **Zero dangerous misses** on the hero tender. | Eval harness and hand-labelled gold set. | "The eval does not just count matches. It flags missed deal-breakers as dangerous." |
| **0 invented answers** in groundedness checks. | `engine/eval_answers.py`; demo docs cite evidence. | "If Bidframe cannot cite evidence, it asks. It does not bluff." |
| **18 / 19 requirements found** on first measured tender. | README and demo narrative. | "We measured against a hand-labelled answer key, not vibes." |
| **183 requirements, 109 grounded answers, 0 bluffs** in the pre-baked SPSO demo fixture. | `STATUS.md` and `/demo` fixture notes. | "The stage demo is a real prior pipeline run, not fabricated sample data." |

**Honesty rule:** product stats are worked-example proof, not a universal guarantee. Use "on the hero tender" or "in our worked example" when quoting them.

## Narrative Spine

1. Public tenders are high-stakes instruction packs.
2. They feel like a dense forest of rules, forms, deadlines, certificates, and scoring criteria.
3. Bid teams manually turn that forest into a compliance matrix.
4. The expensive failure is missing the red marker: a deal-breaker.
5. Bidframe reads the tender and builds the path automatically.
6. Every line is checkable against the source.
7. Answers are drafted only when backed by evidence.
8. The user's decisions become reusable context for the next bid.

## 3-Minute Timing

| Time | Beat | Screen / Slide | Owner |
|---|---|---|---|
| 0:00-0:20 | Trailhead: define tender and stakes | Slide 1: "Never lose a bid to a deal-breaker you missed" | Joel |
| 0:20-0:45 | Dense woods: tender 101 + market stat | Slide 2: Tender to bid workflow | Joel |
| 0:45-1:20 | Product demo: matrix | Slide 3 or live app: compliance matrix + deal-breaker hero | Jawad |
| 1:20-1:50 | Clearing: source proof + metrics | Slide 4 or live app: source panel + proof ledger | Bobby |
| 1:50-2:20 | Evidence trail: autofill with receipts | Slide 5 or live app: answer citations + gap questions | Jawad / Bobby |
| 2:20-2:45 | Canopy view: market and wedge | Slide 6: SME public-sector bidders and bid consultancies | Joel |
| 2:45-3:00 | Summit: ask | Final line and pilot ask | Joel |

## Slide-by-Slide Storyboard

### Slide 1 - Trailhead / Hook

**Title:** Never lose a bid to a deal-breaker you missed.

**Subtitle:** Bidframe reads public-sector tenders, finds the mandatory requirements, and links every line to its source.

**Visual:** A woodland trailhead over warm paper: pine-dark top band, faint clause text as the "forest floor", Bidframe clause-frame logo, one oxblood trail marker.

**Speaker note:**

> "A tender is how a council, NHS trust, or school buys services. Suppliers respond with a bid. Miss one mandatory rule, and the bid can be rejected before anyone reads the good parts."

**Purpose:** Teach the stakes in one sentence before showing software.

**Forest cue:** The viewer has arrived at the edge of the forest. The tender looks dense but navigable.

### Slide 2 - Dense Woods / Tender 101

**Title:** What happens before a supplier can bid?

**Visual flow:**

`Public buyer publishes tender -> Supplier reads rules -> Bid team builds compliance matrix -> Deal-breakers checked -> Bid submitted`

Add one small market figure in the corner:

> UK public procurement: GBP 300bn-plus annual private-sector spend.

**Use labels:**

- Tender: the buyer's instruction pack.
- Compliance matrix: the bidder's checklist.
- Deal-breaker: miss it and you may be out.

**Speaker note:**

> "Today this is mostly manual. A bid manager reads a long PDF, extracts every requirement into a spreadsheet, works out which ones are pass/fail, and then coordinates evidence and answers. That can take days or weeks."

**Purpose:** Make the product legible to investors who do not speak procurement.

**Forest cue:** This is the dense part of the forest: many paths, hidden deadlines, forms, certificates, and scoring rules.

### Slide 3 - The Marked Path / Bidframe Builds The Matrix

**Title:** Bidframe turns the tender into a worklist.

**Visual:** Product screenshot or live `/demo` showing the pre-baked SPSO compliance matrix and `GatingHero`.

**On-screen callouts:**

- Every requirement extracted.
- Deal-breakers shown first.
- Uncertain items flagged.
- Human approves, edits, or flags.

**Speaker note:**

> "We upload a real public-sector tender. Bidframe reads it into a compliance matrix: every requirement, its source, its confidence, and its status. The deal-breaker is not buried in row 84. It is the first thing you see."

**Purpose:** Deliver the hero moment quickly.

**Forest cue:** The confusing forest becomes a marked path. The oxblood deal-breaker is the red trail warning.

### Slide 4 - The Clearing / Source-Linked And Measured

**Title:** Do not trust the AI. Check the record.

**Visual:** Requirement drawer or source verification overlay showing the exact page and clause. Add a small proof ledger.

**Proof ledger:**

- Every deal-breaker caught on the hero tender.
- Zero dangerous misses.
- 0 invented answers in groundedness checks.
- 18 / 19 requirements found on the first measured tender, with the missing/uncertain item surfaced for review.

**Speaker note:**

> "The important difference is auditability. One click shows the exact sentence and page. We also built an eval harness, because the bid manager's real fear is not a prettier answer. It is a missed disqualifier."

**Honesty note:** If asked, do not overclaim a broad benchmark. Say the strongest numbers are from measured worked examples and the validation set is expanding.

**Forest cue:** The product opens a clearing around the clause. The viewer can finally see the exact line, page, and evidence without pushing through the document.

### Slide 5 - Evidence Trail / Autofill With Receipts

**Title:** Answers, with receipts.

**Visual:** `/answers` screen with an answer card, evidence citation, and open questions.

**On-screen callouts:**

- Drafted from your capability documents.
- Evidence citation: document, page, excerpt.
- If evidence is missing, Bidframe asks a question.
- Human signs off every answer.

**Speaker note:**

> "Bidframe does draft answers, but not as a black-box bid writer. It drafts only from the supplier's own documents and cites the evidence. Where the evidence is missing, it asks a question. That is why we call it auditable autofill."

**Purpose:** Pre-empt the "is this just AutogenAI?" objection.

**Forest cue:** The trail continues from tender requirement to bidder evidence. Every answer has a visible footprint.

### Slide 6 - Canopy View / Wedge And Market

**Title:** Built for SME public-sector bidders.

**Visual:** Two-column wedge.

| Incumbent tools | Bidframe |
|---|---|
| Enterprise bid-writing suites | SME-scale compliance control |
| Generate prose | Build a verifiable requirement record |
| Black-box reading step | Every requirement links to source |
| Requires trust | Lets the bid manager verify |

**Target users:**

- Small public-sector bidders in care, cleaning, security, catering, IT, training, grounds, and FM.
- Small bid-writing consultancies that handle many tenders and need repeatable first-pass review.

**Market proof options:**

- Public procurement is a GBP 300bn-plus annual market in the UK.
- SMEs are a major supplier base on public-sector frameworks.
- The first outreach list already targets bid consultancies and SME bidders across care, cleaning, security, catering, IT, training, grounds, and FM.

**Speaker note:**

> "AutogenAI writes bids for large firms. Bidframe gives the SME bidder a source-linked compliance matrix and evidence-backed drafts, so they can trust the work before they submit."

**Forest cue:** Zoom out above the canopy. The single path through one tender becomes repeatable infrastructure for a market.

### Slide 7 - Summit / Ask

**Title:** Bring us a tender.

**Visual:** Pine closing band, warm paper record, Bidframe URL and booking link. This should feel like reaching the top of the trail and seeing the route clearly behind you.

**Close line:**

> "Three weeks of reading and disqualifier risk becomes a verified worklist in minutes, with the expert still approving every step."

**Ask:**

- Free pilots with real SME bidders and bid consultancies.
- Bring a public-sector tender, and Bidframe will prepare the deal-breaker checklist before the call.

**Forest cue:** The audience leaves with a clear next path: bring a tender, get the map.

## Optional Live Demo Choreography

Use the pre-baked `/demo` path by default. It is a real prior pipeline run and avoids venue wifi, public API key, and rate-limit risk.

1. Start on slide 1 or landing hero.
2. Move to `/demo` or `/review` for the matrix.
3. Point to the oxblood deal-breaker hero.
4. Click "See a deal-breaker in the document" or open the source drawer.
5. Move to `/answers` for evidence-backed draft answers.
6. Return to final slide for market and ask.

**Honest wording for the pre-baked path:**

> "For stage reliability, this is the cached output from our real backend pipeline. The same schema and UI are used for live uploads."

Do not say the model is running live unless the Render key has been tested that day.

## Visual Direction

Blend the product's civic-record identity with the landing/demo woodland world. The civic record gives credibility; the forest gives movement and memory.

**Colours:**

- Paper: `#F6F2E9`
- Paper raised: `#FBF8F1`
- Ink: `#211D17`
- Forest: `#2C5640`
- Hairline: `#E4DDCE`
- Oxblood: `#B42D24`
- Oxblood frame: `#8A2D2A`
- Pine: `#1D3A2B`
- Pine deep: `#16301F`
- Moss: `#E8EBDD`
- Accent/source teal: `#2F5D63`

**Type:**

- Fraunces for titles.
- Chillax for body.
- IBM Plex Mono for page refs, clause refs, metrics, and proof ledgers.

**Slide rules:**

- Use real product screenshots, not abstract AI imagery.
- One firm 2px ink rule per slide.
- Oxblood appears only for deal-breakers or danger.
- Forest appears only for approval, action, or brand accent.
- Pine and moss can carry the journey atmosphere: section bands, forest edges, closing ground.
- Use fern, pine, paper grain, and faint ledger grids as edge texture, not decoration in the content path.
- Do not show raw confidence scores like `0.92`.
- Avoid generic pitch-deck gradients, purple/blue AI styling, and oversized vague icons.

## Journey Motifs By Slide

| Slide | Motif | What It Communicates |
|---|---|---|
| 1 | Trailhead sign | The viewer is entering a high-stakes workflow. |
| 2 | Dense clause forest | Manual tender review is hard because the important line is hidden among ordinary lines. |
| 3 | Oxblood trail marker | Bidframe finds the danger first. |
| 4 | Clearing around the source | Trust comes from visibility, not blind faith. |
| 5 | Evidence footprints | Draft answers must leave a trail back to documents. |
| 6 | Canopy map | This is a repeatable market, not a one-off demo. |
| 7 | Summit / open route | The ask is simple: bring a tender, get the map. |

## Backup Stat Slide

If the judges want market scale, add one optional slide after Slide 6.

**Title:** The forest is huge.

**Three proof cards:**

1. **GBP 341bn** - UK public procurement from the private sector in 2023-24.
2. **32%** - share of UK public spending represented by that procurement figure.
3. **72% SME supplier base** - CCS commercial agreements reported a majority micro, small, or medium supplier base.

**Speaker note:**

> "We are starting narrow, with SME bidders and bid consultancies, but the workflow sits inside one of the largest document-heavy markets in the country."

**Caution:** verify primary source links before putting this slide in the final deck.

## Q&A Anchors

**"What is a tender?"**

> "It is the buyer's instruction pack for a public contract. It tells suppliers what they must provide, what documents they must submit, and how they will be scored."

**"Is this just ChatGPT on PDFs?"**

> "No. Chat gives a summary. Bidframe produces structured requirements, source links, confidence routing, human decisions, grounded answers, and deterministic evaluation against hand-labelled tenders."

**"Is this AutogenAI?"**

> "AutogenAI is a generative bid-writing suite for larger organisations. Bidframe starts earlier: the auditable compliance matrix, deal-breaker catch, source traceability, and evidence-backed autofill for SME bidders."

**"How do you know it works?"**

> "We built an eval harness. It scores output against human-labelled tender answer keys and highlights dangerous misses. On the hero tender, the deal-breakers are caught and the drafted answers do not invent citations."

**"Why public sector?"**

> "Public-sector tenders have a consistent pain: hard mandatory gates, transparent scoring, and a long tail of SME bidders who cannot afford enterprise bid software."

**"Who pays?"**

> "Frequent SME bidders and small bid consultancies. Consultancies are especially strong because they process many bids, so every saved first-pass review compounds."

## Do Not Say

- "We write your bid for you."
- "Fully automated submission."
- "Guaranteed to catch every possible requirement."
- "The model is running live" unless it is actually live.
- "Customers" unless there are signed or paying customers. Use "pilots", "targets", or "outreach" honestly.

## One-Sentence Version

Bidframe is the source-linked compliance matrix and auditable autofill layer for SME public-sector bidders: it finds the deal-breakers, shows the evidence, and keeps the expert in control.
