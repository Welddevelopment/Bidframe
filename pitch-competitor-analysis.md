# Competitor Analysis — the pitch-deck slide (build spec + research base)

> **STATUS: WORKING DRAFT — a starting point, extend me.** Owner: J. This is *what we have now*: the
> 5-camp comparison matrix, the price/accessibility argument, the public-sector wedge, and the full
> build spec for Jawad's new deck slide.
>
> - **Jawad** builds the slide visual from this doc — everything you need (matrix data, copy, design
>   tokens, and the exact `PitchDeck.tsx` touch-points) is here; you shouldn't have to open another file.
> - **@Bobby (Generalist)** — read this, then **extend the competitive edge**. Deeper intel, sharper
>   axes, newer entrants, pressure-tested claims. Where to add is spelled out in **§10 "For Bobby —
>   where to extend."** Keep every claim sourced (an ex-Palantir judge will probe inflation).
>
> Evidence is already gathered and cited (see §9 Sources): `prior-art.md`,
> `positioning-and-traction.md`, `incumbent-pricing-research.md`, `traction-research.md` (Competitor
> watch + objection table), `demo/q-and-a-battlecard.md`, `features.md`, `demo-claim-ledger.md`.

---

## 1. Why this slide exists (and the policy it reverses)

The deck's whole argument is that Bidframe wins on **auditable extraction + measured recall + the loud
disqualifier catch, at SME/public-sector scale, at a price SMEs can actually reach.** That argument
currently lives only in our internal docs and the Q&A battlecard — **judges never see it on stage.** This
slide converts the moat from a defensive Q&A rebuttal into a proactive on-stage beat.

**⚠️ This is a deliberate reversal of a standing deck decision.** Today the deck **never names
competitors on stage** — by design. The Architecture appendix note literally reads *"Contrast with a PDF
chatbot without naming competitors,"* and the thin "Competitive wedge" appendix
(`PitchDeck.tsx:1224`) only uses generic framing ("Not a document chat / Not a writing toy / Not a static
spreadsheet"). We are choosing to name names now because the pricing/accessibility contrast is *specific
and defensible*, and a named matrix is far more persuasive than an abstraction — **provided every claim
is sourced or marked as the competitor's own public claim** (the guardrail that keeps this honest; see §8).

**The trade-off to own (flag to the team):** adding a 6th main slide breaks the rehearsed 3-minute
timing (see §2). Make the call deliberately — the slide is worth it only if we re-time and re-rehearse.

---

## 2. Where it goes in `PitchDeck.tsx` (technical integration)

New narrative order: **Problem → Use Case → Solution → Product → Competitors (new) → Ask.**
Insert the new slide as **index 4**, pushing the Ask slide from index 4 → 5.

All edits are in `frontend/src/components/pitch/PitchDeck.tsx`:

| What | Now | Change to |
|---|---|---|
| `MAIN_SLIDE_COUNT` (`:43`) | `5` | **`6`** |
| `SLIDE_BEATS` (`:51`) | `[1, 4, 2, 1, 1]` | **`[1, 4, 2, 1, 2, 1]`** (new slide = 2 beats, before the Ask's `1`) |
| `AUTOPLAY_SECONDS` (`:58`) | `[24, 30, 40, 46, 30]` = **170s** | add a budget + re-sum ≤180s (see below) |
| Number-key jump (`:485`) | `event.key >= "1" && event.key <= "5"` | **`… <= "6"`** |
| Help-card text (`:1524`) | `1`–`5` jump to slide | **`1`–`6`** |
| `slides` array (`:646`) | Ask object at `:1008` | **insert the new slide object immediately before the Ask object** |

- **`PRODUCT_INDEX`** (`= 3`, `:47`) is unaffected — the portal ("step inside the product") still lands on
  the Product slide. `PACE_STARTS`, `jumpToAsk`, and `MAIN_SLIDE_COUNT - 1` all derive automatically, so
  no other constant needs touching. Deep-link hashes shift by one (Ask becomes `#6`) — harmless.
- **The 2 beats** drive the reveal (see §7): beat 0 = matrix with only Bidframe's column lit; beat 1 =
  competitors' gaps + the price row land.

### ⚠️ Timing — this needs a re-time and re-rehearse
The current 170s (24/30/40/46/30) leaves 10s of slack inside the 3:00 window. A 6th slide must fit
**under 3:00**. Two options:
- **Add + trim** (recommended): e.g. `[24, 28, 36, 42, 28, 22]` = **180s** — shaves Use Case/Solution/
  Product slightly and gives the new slide 28s. Zero slack, so rehearse tight.
- **Absorb**: keep others, give the new slide ~10s — too rushed for a matrix; not recommended.

Whichever we pick, **`pitch-run-of-show.md`** (the 5-slide / 170s clock and the 24/30/40/46/30 pace
ghost) and **`demo/pitch-script.md`** (word-for-word) must be updated in lockstep, or the on-stage pace
ghost will lie. This is the real cost of the slide — decide before building.

### Slide object fields (fill these in the `slides` array)
```
{
  bucket: "Competitors",              // shows in the topline + trail
  title:  "Everyone else writes bids. We make sure you're allowed to.",  // see §6 for options
  speaker: "Pranav",                  // recommended: continues from his Product slide, hands to Jawad for Ask
  zone:   "moss",                     // sits between Product (moss 0.6) and Ask (clearing 1)
  light:  0.75,
  glyph:  "matrix",                   // or "clause"
  notes:  [ /* presenter notes — mirror the beats + the one-liner in §6 */ ],
  body:   ( /* the matrix + price panel — typeset TSX, see §3/§4/§7 */ ),
}
```
- **Speaker/handoff:** recommend **Pranav** presents it (he already owns Solution + Product), then the
  derived handoff chip shows **Jawad** for the Ask. Team to confirm — the alternative is Jawad presents
  it himself since he closes on Ask anyway.

### Downstream docs to update (so nothing goes stale — not part of the build, but list them)
- `pitch-run-of-show.md` (5→6 slides, new clock), `demo/pitch-script.md` (add the beat),
  `pitch-assets/canva/README.md` (slide asset map, if the Canva deck mirrors this).
- **The appendix "Competitive wedge" card** (`PitchDeck.tsx:1224`): keep it as a generic Q&A fallback
  (it's a different, name-free cut) — no need to delete, but know it now overlaps this slide.

---

## 3. The comparison matrix (core content — real data)

Six rows (Bidframe + five competitor camps) × six axes. **Every cell is a glyph + a short note — never
colour alone** (greyscale-safe, see §7). Legend: **✓** = does it well · **~** = partial / indirect ·
**✗** = doesn't do it.

| | Auditable extraction (click → exact clause + page) | Loud deal-breaker catch (first-class, not buried) | Measured recall (quantifies the miss) | Human-in-control (approve / edit / flag) | Price transparency (public / self-serve) | SME + public-sector fit |
|---|---|---|---|---|---|---|
| **Bidframe** | **✓** every requirement traces to its source clause, one click | **✓** disqualifiers surfaced first, as the hero | **✓** scores recall vs a hand-labelled key; flags what it's unsure of | **✓** approve/edit/flag each row; nothing auto-applies | **✓** built as the affordable first-read layer | **✓** text-based UK public-sector, for SMEs + small consultancies |
| **AutogenAI** | **~** *has* a "Qualify & Extract" step, but **black-box** — no click-to-clause | **✗** extraction treated as a solved pre-step; no loud gate | **✗** no published measure of what it missed | **~** generative ("AI writes your bid"), not a compliance-review gate | **✗** enterprise-priced, **demo-gated** (no public price) | **✗** built for large orgs; prices the SME long tail out |
| **mytender.io** | **✗** SME-facing AI bid drafting, not auditable extraction | **✗** not a deal-breaker tool | **✗** none published | **~** AI bid drafting | **✗** **no public /pricing page** (404, demo-gated) | **~** *targets* SMEs (closest by segment) but no self-serve compare |
| **Loopio / Responsive** | **✗** reuse a maintained answer library; doesn't read the tender's requirements | **✗** no tender-gate detection | **✗** n/a — library, not extraction | **~** content-approval workflow, not requirement gating | **✗** enterprise RFP software | **✗** enterprise RFP teams; sits *downstream* of us |
| **Constructionline "X-Ray"** | **✓** extracts requirements + flags missed items… | **~** flags missed items, on construction packs | **✗** no published recall measure | **~** review-oriented | **~** part of a paid membership | **✗** **construction** niche, drawing-heavy — a different domain by design |
| **NotebookLM / LLM chat** | **✗** summarise/ask a PDF; no structured output, no grounding we control | **✗** nothing surfaces a gate | **✗** unmeasurable, closed | **✗** no decision capture | **~** cheap/free but not a product | **✗** generic; no compliance artifact |

**Grounded notes behind the cells** (source: `prior-art.md`, `positioning-and-traction.md`,
`traction-research.md` Competitor watch + objection table):

- **AutogenAI** — enterprise **generative** ("Write More Winning Bids"); *their* public claims: **300+
  enterprise clients**, **70% faster drafting**, **241% higher win rate**; sectors construction/
  healthcare/gov. It **does** have a "Qualify & Extract" step — but it's **black-box** (you can't click a
  requirement to its exact source clause), it **doesn't measure what it missed**, and it's
  **enterprise-priced / demo-gated**. Our line is not "they don't read the tender" — it's *"their extract
  is a black box priced for big teams; we win on auditability + measured recall + the loud catch at SME
  scale."*
- **mytender.io** — SME-facing AI bid platform ("Win More Bids with mytender"); **our closest direct
  competitor by segment.** **No public pricing** (`/pricing` 404, demo-gated like AutogenAI) → SMEs can't
  self-serve-compare. It's a drafting tool, not an auditable-extraction / deal-breaker tool.
- **Loopio / Responsive** — RFP **answer libraries**: reuse past answers from a curated content library
  you must maintain. They don't read the tender and tell you what it requires, or catch the gate that
  disqualifies you. **We sit upstream of the answer library.**
- **Constructionline "X-Ray"** — genuinely extracts requirements + flags missed items on **construction**
  packs (incl. drawings), **~10k firms**. This is the one incumbent that does something adjacent to us —
  but on a different, drawing-heavy domain. We **deliberately chose text-based public sector** (lower
  parsing risk, the open gap). Name it honestly; it's a credibility signal that we know the landscape.
- **NotebookLM / generic LLM chat (ChatGPT)** — summarise or ask a PDF in a black box: no structured
  output, no grounding we control, no decision capture, nothing measured. *"Those summarise a PDF; we
  extract every requirement as structured data, link each to the exact clause/page, flag the pass/fail
  gates, and measure what we caught — none of which a chat tool does, or can prove."*

**The two-camp framing** (the spine of the whole slide): incumbents split into **generative** (AutogenAI,
mytender.io — "AI writes your bid," priced up-market) and **library** (Loopio/Responsive — reuse a
maintained library). **The gap between them — auditable extraction of the tender itself — is open.**
That's the wedge (see §5).

---

## 4. Price / accessibility panel (its own visual block)

This is the argument that lands hardest with judges — a **hard, sourced £ contrast.** Source:
`incumbent-pricing-research.md` (researched 2026-07-04) + `traction-research.md`.

| The market charges | Price | Source |
|---|---|---|
| Outsourced tender **review** (closest to our first-read) | **from £950 / tender** | Glaxtons |
| Full outsourced bid write, one tender | **£2,000–£8,000** (avg **~£4,000 + VAT**) | Executive Compass / JGP |
| Bid-writer contractor day rate | **£375 / day** | IT Jobs Watch |
| In-house bid writer salary | **£35k–£50k / year** | Glassdoor / talent.com / Bid Solutions |
| AutogenAI · mytender.io | **enterprise / demo-gated — no public price** | their sites (both demo-gated) |
| Time to prepare a bid | **2–8 weeks** (standard) | procurement guidance |

**The lines (pick per space):**
- **Accessibility (the headline for this panel):** *"A full-time bid writer is £35–50k a year; an
  outsourced review is £950+ a tender. A small firm that bids a few times a year can't justify either —
  so they bid blind. Bidframe is the first-read layer they can actually afford."*
- **The stakes:** *"A full bid averages ~£4,000 and 2–8 weeks — and one missed deal-breaker bins the
  whole thing. Catching every disqualifier is what protects that investment."*
- **The self-serve gap:** *"AutogenAI and mytender.io don't even publish a price — you have to book a
  demo. An SME can't self-serve-compare. That's the opening."*

---

## 5. The wedge / beachhead (public sector)

Show this as the **positioning payoff** beneath the matrix — optionally a **2×2 map**:

```
                 ENTERPRISE-priced
                        │
      AutogenAI ●       │       ● Loopio / Responsive
   (generative)         │         (library)
                        │
   ─────────── the auditable-extraction gap ───────────
                        │
                        │   ★ BIDFRAME
      mytender.io ●     │   (auditable extraction,
   (generative, SME)    │    SME + public sector)
                        │
                  SME-priced / self-serve
        generative ←───────────→ library
```

- **Beachhead (locked niche, per `positioning-and-traction.md`):** **UK public-sector procurement**,
  specialised for **SME bidders + small bid consultancies that enterprise tools price out.** Chosen
  because: construction is already served (Constructionline X-Ray, ~10k firms); public-sector ITTs are
  **mostly text** (lower execution risk); the strong incumbent (AutogenAI) is **generative + enterprise**,
  leaving the auditable-extraction end open; and SME public-sector bidders are **under-tooled and hungry.**
- **Market context** (for scale, if asked): SMEs won **£45.2bn of direct public-sector spend in 2025 (21%
  share, a six-year high)**; local government alone spent **£29.1bn with SMEs (34% share)** — these
  contracts are genuinely SME-winnable. (UK public procurement overall ≈ **£341bn**, 2023/24.)
- **The canonical differentiator sentence (verbatim — use it):**
  > *"AutogenAI writes bids for big firms at enterprise prices. Bidframe gives the SME bidder an
  > **auditable** requirement breakdown and compliance matrix — every requirement traceable to its source
  > clause, the disqualifying ones flagged, the human approving each — so they can **trust** it, not just
  > generate text."*

---

## 6. Copy block (slide-ready)

Obeys the house rules (`pitch-assets/canva/README.md` + `frontend/copywriting.md`): **no** "we write
your bid", **no** "98% accuracy", **no** "customers"; scope claims to the worked/held-out example; say
"drafts from your documents / asks instead of guessing." No em dashes in shipped slide copy.

- **Kicker:** `The competition`
- **Headline (pick one):**
  1. **"Everyone else writes bids. We make sure you're allowed to."** *(recommended — sharp, own-lane)*
  2. "The first-read layer nobody else builds."
  3. "Generative tools skip the read. We start there."
- **Subhead:** "Two camps own the bid-writing market. Neither reads the tender and proves what it found.
  That gap, at a price an SME can afford, is ours."
- **Matrix caption (mono, small):** "Competitor claims are their own published marketing. Pricing sourced
  (see notes)."
- **Price-panel line:** "£35–50k a year for an in-house writer, or £950+ a tender outsourced. Bidframe is
  the first-read layer a small firm can actually afford."
- **The closer one-liner** (differentiator sentence from §5, verbatim).

---

## 7. Visual / design spec (civic-record language — build, don't invent)

Map to `frontend/design-language.md` and the material tokens. The matrix **is** the message: treat it as
an **official comparison register**, the same civic-record voice as the product.

- **Structure:** masthead-style slide title (Fraunces 600), one **`--rule-strong`** (2px ink) rule under
  it, **`--rule-hair`** row lines. The matrix reads like a ruled schedule, not a marketing table.
- **Type voices:** **IBM Plex Mono (the record)** for competitor names, the ✓/~/✗ cells, price figures,
  and source refs; **Fraunces** for the title; body notes in the body face. This mirrors the product's
  "mono = the official record" rule, so the slide feels like Bidframe, not a pitch cliché.
- **Colour discipline (greyscale-safe — non-negotiable):** **oxblood** (`--color-signal-oxblood`
  `#B42D24`, frame tone `--color-signal-oxblood-frame` `#8A2D2A`) **only** on competitor gaps (✗) and the
  price wall; **forest** on Bidframe's ✓ column. **Never rely on colour alone** — every mark is a glyph
  (✓ / ~ / ✗) **and** a word, so it survives a washed-out projector or a colour-blind judge (the
  confidence-bead greyscale rule, applied to the matrix).
- **Bidframe's row/column should carry weight** — it's the focal point. Lift it subtly
  (`--depth-sheet`), keep competitors flat. Depth means focus; nothing floats decoratively.
- **Grain only on raised surfaces**; light paper only for the sheet (the slide's *zone* backdrop still
  follows the forest-walk scene like every other slide — `zone: "moss"`, `light: 0.75`).
- **Reveal choreography (the 2 beats from §2):**
  - **Beat 0:** the register with **only Bidframe's column filled** (all ✓, forest) — "here's the bar."
  - **Beat 1:** competitors' cells resolve in (the ✗/~ marks, oxblood on the gaps) **and** the price row
    lands — the contrast hits all at once. Keep it one clean motion, not a per-cell cascade.
- **Keep the matrix typeset TSX, not a screenshot** — crisp on any projector (same reason the before/
  after was rebuilt as TSX). If a supporting proof card helps, the existing `DealBreakerCard` /
  `ClauseCard` / `AnswerCardShot` components (`components/landing/ProductShots`) are available, but the
  matrix itself should stand alone.
- **Run the civic-record check** (`design-language.md`): reads as an official record at a glance? depth
  earning its place? every flourish backed by real data? one coherent shadow language? passes greyscale?
  took one real swing?

---

## 8. Honesty guardrails + pre-stage checklist

An ex-Palantir judge will probe any inflated competitor claim. Keep it clean:
- **Mark competitor performance claims as their own** ("AutogenAI *claims* 241% higher win rate; 300+
  enterprise clients") — never restate them as fact.
- **Be fair, don't strawman.** State plainly that AutogenAI **does** have an extract step — our point is
  it's *black-box + enterprise-priced*, not that it's absent. A judge who knows the space will respect the
  precision and distrust an overclaim.
- **Pricing is sourced** (§4); keep the source line on the slide (mono caption).
- **Pre-stage verify checklist** (do the morning of):
  - [ ] Re-confirm AutogenAI + mytender.io pricing is **still demo-gated** (no public price page appeared).
  - [ ] Confirm the £-figures against `demo-claim-ledger.md` / `incumbent-pricing-research.md`.
  - [ ] Confirm the "300+/70%/241%" AutogenAI figures are still their current published claims.

---

## 9. Sources

- **`prior-art.md`** — the landscape table (AutogenAI, Loopio/Responsive, Constructionline X-Ray,
  NotebookLM) + the differentiator sentence.
- **`positioning-and-traction.md`** — the two-camp gap analysis, the locked public-sector/SME niche, the
  positioning sentence.
- **`incumbent-pricing-research.md`** (2026-07-04) — every £ figure, with primary source links: IT Jobs
  Watch (day rate), Glaxtons (£950 review), Executive Compass / JGP (£4k full bid), Bid Solutions /
  Glassdoor / talent.com (salary), Tsaks (hourly / CWAS3).
- **`traction-research.md`** — Competitor watch (AutogenAI 300+/70%/241% + "Qualify & Extract";
  mytender.io demo-gated; Loopio; NotebookLM) + the objection-handling one-liners + the SME public-spend
  stats (£45.2bn / £29.1bn).
- **`demo/q-and-a-battlecard.md`** — the "isn't this just ChatGPT/NotebookLM?" rebuttal.
- **`demo-claim-ledger.md`** — the £341bn market figure (House of Commons Library) + the pricing/eval
  numbers, verified.
- **`features.md`** — the four product blocks + the "claims to avoid" list.

---

## 10. For Bobby — where to extend

Add on top of this; keep every addition sourced. Open threads worth deepening:

1. **Pin actual pricing for AutogenAI + mytender.io.** Both are demo-gated today (that's itself a point).
   A live fetch, a G2/Capterra pricing leak, a review, or a sales conversation that surfaces a real
   number would sharpen the price row from "demo-gated" to a figure — and date it.
2. **Newer entrants.** The AI-bid space moves fast. Any 2025/26 SME-facing tools we've missed? (Check
   APMP/BIDx chatter, G2 "proposal software" category, LinkedIn.) mytender.io is our closest — is there a
   second?
3. **Sharpen the "measured recall" column** with our actual eval numbers (deal-breaker benchmark 12/12,
   Bradwell held-out 10/10, 101/101 phrasing bank — from `demo-claim-ledger.md` / `SCORING.md`), so the
   one column no competitor can fill is quantified, not just asserted. (Mind J-083: `eval_all` understates
   gating — use the net-applied numbers.)
4. **G-Cloud / Digital Marketplace angle.** ~4,000 suppliers, ~90% SMEs — a distribution/where-they-live
   point that reinforces "reachable SME market." Does any competitor own that channel?
5. **Pressure-test each competitor claim** against its live source (feature pages, or the traction calls —
   the bid pros we're contacting *are* the people who'll tell us if the wedge is real). Flag anything that
   softens on inspection so we don't overclaim on stage.
6. **A second axis idea:** "deterministic guarantee" (our safety-net catches gates without the model) —
   arguably a 7th column none of them have. Worth adding if it doesn't overcrowd the matrix.
