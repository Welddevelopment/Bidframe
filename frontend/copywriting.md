# Bidframe Copywriting

How Bidframe talks. This is the working manual behind section 2 (Voice) of
[DESIGN-SYSTEM.md](DESIGN-SYSTEM.md), and it shares the [SLOP-CHECK.md](SLOP-CHECK.md) banned list for
copy. Section 2 is the short statement of intent. This file is the day-to-day reference: the principles,
the fixed vocabulary, the patterns, and a rewrite of the real strings currently on the site.

## The one idea

For Bidframe, copy is where trust is won or lost. The whole pitch is asking a busy non-expert to trust a
draft a machine made for their bid. The words earn that trust two ways, and every line should be doing one
of them:

1. **Show your work.** Say where a thing came from. "We drafted this from your Capability Statement, p.4."
2. **Never overclaim.** It is a draft you approve, not a finished answer. The tool says what it is sure of
   and what it is not.

AI slop does the opposite: vague, breathless, and silent about its sources. Anti-slop copy is honesty made
concrete.

## Who we write for

One person: a bid writer at a small company, not a procurement expert, working against a deadline. They
are capable but stretched, and they are nervous about getting a public-sector bid wrong. Write for that
person. Calm, specific, and never talking down to them.

## Voice in one line

Plain, specific, calm. Say the real thing, not the benefit. British spelling throughout (organise,
colour, licence, recognised). See DESIGN-SYSTEM section 2.

## Trust principles

Each is a rule you can check a string against.

1. **Show the source.** Anything the tool produced names where it came from, by document and page.
   - Good: "Drafted from your Capability Statement, p.4."
   - Not: "Here is your answer."
2. **Say the specific thing.** Use real nouns and counts, not benefit language.
   - Good: "We found 60 requirements. 8 need your input."
   - Not: "Streamline your entire tender workflow."
3. **Use provisional verbs.** In-product verbs signal that output is a draft you review, never something
   final or magical. Draft, suggest, find, check. Not autofill, generate, complete.
   - Good: "Draft my answers"
   - Not: "Autofill with AI"
4. **Be honest about uncertainty.** When the tool is unsure, say so plainly and say what to do.
   - Good: "Low confidence. Check this one yourself."
   - Not: "Looks good!"
5. **Stay calm.** No hype, no exclamation marks, no false urgency. The tool is the steady colleague, not a
   salesperson.
6. **Write in you, active, present.** The reader is "you". The tool acts in the present.
   - Good: "We drafted this. Check it before it goes in the bid."
   - Not: "This response has been automatically generated."
7. **"We" only narrates real actions.** Use "we" when the tool genuinely did something from a real source.
   Never "we" plus a feeling.
   - Good: "We pulled these from the tender."
   - Not: "We're excited to help you win."
8. **Count facts, never score judgement.** Count real things freely (60 requirements, 8 gaps, page 14).
   Never put a number on confidence or quality. A false-precise "0.92" claims the model knows more than it
   does, and confidence is carried by the dot and a word (DESIGN-SYSTEM section 4).

## The three lexicons

Fixed vocabulary, so the same idea reads the same everywhere. These are the canonical words. Where the
current UI disagrees, the UI changes, not these.

### Confidence (the four dot tiers, worst to best)

The word always sits beside the dot. These reconcile the UI's current High / Moderate / Low / Uncertain
with the four-tier model in DESIGN-SYSTEM section 4.

| Dot | Word | Plain gloss |
|---|---|---|
| Oxblood | Can't answer this | We could not draft an answer, or it is a deal-breaker with no good answer. Stop and look. |
| Amber | Low confidence | A rough draft. Check it properly. |
| Yellow | Fairly sure | Minor caution. Glance before you trust it. |
| Light-green | Confident | Quick read and approve. |

### Answer state (the schema `answer.state`)

| State | Badge word | Note |
|---|---|---|
| `auto` | Drafted for you | The tool drafted it from your documents. |
| `needs_input` | Needs your input | The tool needs an answer from you before it can draft. |
| `human_edited` | Edited by you | Your words now. The original draft is kept. |
| `empty` | No draft yet | Nothing drafted for this one. |

### Decision status (the schema `status`)

| Status | Word |
|---|---|
| `pending` | Needs your eye |
| `accepted` | Approved by you |
| `edited` | Edited by you |
| `flagged` | Flagged |

### Action verbs: use and avoid

- **Use:** draft, suggest, find, check, review, approve, edit, flag, add, upload.
- **Avoid:** autofill (as the button verb), generate, complete, leverage, unlock, supercharge,
  streamline, seamlessly, effortlessly, instantly, powerful, smart, intelligent (as filler).

## Patterns

### Buttons

Label the action in the reader's terms, one plain verb plus its object. The existing "Approve", "Edit",
"Flag", "Try again", "Upload another", "Add evidence docs" are the model: keep them.

- Good: "Draft my answers", "View extracted requirements", "Save edit"
- Not: "Autofill with AI", "Generate now", "Let's go"

### Headings

Short and human (Fraunces earns its warmth in a few words). Name the outcome, not the machinery, and never
leak internal or developer language.

- Good: "Upload a tender", "Answers, with receipts"
- Not: "Day 1 compliance matrix", "Compliance matrix · mock data"

### Empty states

Say what is not here yet and the one next step. Never a bare "No data".

- Good: "No evidence linked yet. Upload a capability document so this answer is backed and checkable."
- Not: "No supporting evidence linked yet, upload a capability document so this claim is backed and
  auditable." (jargon: "grounded", "auditable" to a non-expert)

### Errors

This is where trust is built or lost. Say what happened, why if known, and what to do, calmly. The current
extractor error is the model: keep that shape.

- Good: "Couldn't reach the server. Check it's running, then try again."
- Not: "Something went wrong!" or a raw stack trace.

### Loading

Name what is happening, with attribution where it helps. No spinner-only mystery.

- Good: "Drafting answers from your documents…", "Extracting requirements…"
- Not: "Re-grounding…", "Please wait…"

### The self-writing audit line

Factual, past tense, names the actor, timestamped. No adjectives. This line is a trust artifact, so it
stays dry.

- Good: "Approved by you, 14:32.", "Edited by you. The original draft is kept."
- Not: "Nicely done! You approved this."

### Source and confidence microcopy

Source refs are quiet and consistent: "p.14", "Section 4.2.1", set in the mono evidence style. Confidence
microcopy uses the lexicon above, never a number.

## Before and after: the live site

Recommendations against the real strings, with the reason. Frontend owns the final call.

### Must fix now (live SLOP-CHECK violations and a bug)

- **Grammar bug**, `app/upload/page.tsx`: "Drop in a tender PDF and we're pull out the requirements" should
  read "we'll pull out". This is live on the upload page.
- **Em dashes** (banned everywhere, replace with a comma, colon, or period):
  (the offending dash is shown as `[em dash]` below so this file itself stays clean):
  - `app/upload/page.tsx`: "requirements `[em dash]` deal-breakers flagged" to "requirements.
    Deal-breakers are flagged".
  - `GatingHero.tsx`: "deal-breaker `[em dash]` miss any one and the bid is disqualified" to
    "deal-breakers. Miss any one and the bid is disqualified".
  - `ComplianceMatrix.tsx` and `RequirementDrawer.tsx`: "Tool is unsure `[em dash]` verify manually" to
    "Low confidence. Check this one yourself."
  - `AnswerPanel.tsx`: "No supporting evidence linked yet `[em dash]` upload a capability document…" to "No
    evidence linked yet. Upload a capability document…".
  - `ConfidenceIndicator.tsx`: "Uncertain `[em dash]` needs review" to "Needs your eye".
  - `GapInterview.tsx`: "All clear `[em dash]` no open questions." to "All clear. No open questions."

### Tighten for trust and plain language

- `app/page.tsx`: "{n} requirements extracted · Day 1 compliance matrix" to "{n} requirements found in
  this tender". Drop "Day 1" (developer language).
- `Header.tsx`: "Compliance matrix · mock data" to "Compliance matrix". Drop "mock data" from anything a
  user sees.
- `AutofillButton.tsx`: "Autofill with AI" to "Draft my answers". "Drafting grounded answers…" to
  "Drafting answers from your documents…".
- `CapabilityUpload.tsx`: "Re-grounding…" to "Re-checking the evidence…". "Answers are grounded against {n}
  documents." to "Answers are backed by {n} of your documents."
- `answers/page.tsx`: subtitle "Grounded draft answers and the open questions the tool needs you to
  resolve" to "Draft answers built from your own documents, plus the gaps we need you to fill."
- `AnswerPanel.tsx`: "No draft generated yet. The autofill step will draft a grounded answer for this
  requirement." to "No draft yet. Run autofill and we'll draft an answer from your documents."
- `AnswerStateBadge.tsx`: "Auto-drafted" to "Drafted for you"; "No draft" to "No draft yet" (see lexicon).
- `GapInterview.tsx`: "Every drafted answer is fully grounded. Nothing needs your input right now." to
  "Every draft is backed by your evidence. Nothing needs you right now."
- `ComplianceMatrix.tsx`: status badges "Pending / Accepted" to "Needs your eye / Approved by you" (see
  lexicon). Keep "Edited" and "Flagged".
- `ConfidenceIndicator.tsx`: "High / Moderate / Low confidence" to the four-tier lexicon words above, so
  the words match the dot model.

### Keep (already good, use as the model)

"Approve", "Edit", "Flag", "Save edit", "Cancel", "Upload another", "Try again", "View extracted
requirements", "Couldn't reach the extractor" (rename "extractor" to "server"), "Edited by you", "Needs
your input", "Drop a tender PDF here, or click to browse".

## Banned words and punctuation

Shared with SLOP-CHECK.md, restated here for copy work.

- **No em dashes, anywhere.** Use a comma, a colon, or a period. For a number range use "to" (p.14 to 16).
- **No hype words:** supercharge, seamlessly, unlock, elevate, effortlessly, streamline, and three-word
  hype taglines.
- **No exclamation marks** and no vague benefit speak. Say the specific, real thing.
- **No emoji** in product copy, including the sparkle on AI features. The work is the signal, not a
  decoration.
- **No false urgency** ("act now", "don't miss out") and no developer language in user-facing strings
  ("Day 1", "mock data", "the extractor", "grounded" as jargon).

## The copy check

Run any new string past these four questions. Any "no" is a rewrite, not a nitpick.

1. **Source.** If the tool made this, does the copy say where it came from?
2. **Honesty.** Does it claim more certainty than the tool has? Could a non-expert be misled into trusting
   a rough draft?
3. **Plain.** Would the bid writer understand every word? Any jargon ("grounded", "auditable") that needs
   a plainer word?
4. **Clean.** No em dash, no hype word, no exclamation mark, no emoji, British spelling?
