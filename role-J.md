# Role: J — Orchestration, Narrative, Traction, Glue

*Read the master plan first. You're the connective tissue and the GTM. Your code is prompts + orchestration (prompt-heavy, suits you); your bigger value is keeping everyone unblocked, owning the story Conduct's judges hear, and walking in with real bidders who want this.*

## What you own
The extraction/classification **prompts** + agent **orchestration** · the **demo narrative** + the Conduct thesis-bridge · **traction** (real bid managers on record) · **glue** (standup, integration, submission). Plus your share of the sourcing sprint + one gold-set label.

## Day-by-day

**Day 1 — schema, niche, sprint, standup.** Co-lock the requirement schema + raw-extraction format with backend + generalist. **Lock the niche** (construction ITTs vs UK public-sector) — it shapes which tenders to source and the whole framing. Do your share of the sourcing sprint + label one tender. Run the first 10-min standup. Name the tool.

**Day 2 — prompt quality + narrative start.** Own the extraction + classification **prompts** — iterate them against the test tenders until extraction is solid (this is your highest-leverage code contribution; it directly moves the 35%). Start drafting the **demo narrative** and the thesis-bridge: *"Conduct captures the context of IT's decisions; we capture the bid manager's decisions on a tender."*

**Day 3 — orchestration + framing.** Refine the agent loop and the flag-for-human thresholds with backend + generalist. Write the **README**: the prior-art note (per Ming — "similar tools exist, here's how we differ") and the **context-graph framing**. Firm up the 90-second demo script.

**Day 4 — traction (build is solid → go).** LinkedIn outreach to SME bid managers / bid consultants in the niche: *"can I show you something — watch it dissect a tender you know, and tell me if you'd use it?"* Aim for 3–5 real conversations. This doubles as **recall verification** — a real bidder confirming nothing material was missed. Lock the demo narrative.

**Day 5 — capture + submit + rehearse.** Capture traction artifacts (quotes, short screen-recordings of reactions — "I'd pay for this" on camera is gold). Finalise the submission (demo video, README, repo link, accuracy number). Run full demo rehearsals. Prep the "judges pick the tender live" version.

## Guardrails
- **Traction is gated on a solid build** — don't start outreach with a tool that stumbles; a bad demo burns a warm contact. Keep it parallel so the engineers never get pulled off the build.
- **Label traction honestly** — interest is interest, a pilot is a pilot. Enterprise judges smell inflation instantly; an honest "3 bid managers said they'd pilot it" beats an inflated "we have customers."
- Keep prompts simple and robust — your job is reliable extraction, not clever prompting that breaks on the next tender.

## Instructions for your AI (paste into Claude Code / Cursor — for the prompt/orchestration work)

> I'm leading a 4-person hackathon team building a tool for the Conduct "Make Legacy Move" track that extracts **requirements** from **tenders** (50–150 page procurement PDFs), classifies mandatory vs optional, flags "gating" requirements that disqualify a bid if missed, and grounds each to its source. I own the **extraction/classification prompts and orchestration** that the backend calls.
>
> **Stack:** Python, the [OpenAI/Anthropic/Gemini] API with structured output (JSON-schema/function-calling).
>
> **Output schema** the prompts must produce: [paste the JSON schema from master plan §3].
>
> **Help me with:** (1) An **extraction prompt** that, given a chunk of tender text (with page numbers), returns every requirement as structured JSON matching the schema, with an exact source_excerpt and source_page, and a confidence score. (2) A **classification prompt** that labels each requirement mandatory vs optional and flags is_gating, anchored on signal words like "shall / must / mandatory / pass-fail". (3) Orchestration logic that runs these over all chunks and hands a raw extraction list onward. (4) Help me red-team the prompts against messy real tenders so they don't miss requirements buried in tables or dense sections.
>
> **Hard rules:** prioritise **recall** (missing a requirement is fatal — a missed mandatory one disqualifies a bid) and accurate source grounding. Keep prompts robust and simple, not clever-but-fragile. When the model is unsure, it should output a low confidence rather than guess confidently. Start by drafting the extraction prompt and testing it on a tender chunk I'll give you.
