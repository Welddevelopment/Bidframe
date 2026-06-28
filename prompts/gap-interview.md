# Gap-Interview Prompt — v1

> **Owner: J.** Provider-agnostic. Takes the requirements the answer-generation step marked `needs_input`
> and turns their raw gaps into a **short, deduped, plain-English list of questions for the human** — the
> "Bidframe asked me 6 questions" demo beat. Fewer, smarter questions = better. Structured output only.
> See [autofill-scope-decision.md](../autofill-scope-decision.md).

---

## Why this is its own step

The answer-generator flags gaps one requirement at a time, so the raw gaps are noisy and repetitive
(five requirements might all need "your ISO 9001 certificate expiry date"). This step is the **honesty +
UX layer**: collapse overlapping gaps into the *minimum* set of questions, phrase them so a busy bid
manager can answer in seconds, and tie each answer back to every requirement it unblocks. Asking few,
sharp questions is the magic moment; asking forty redundant ones kills it.

## SYSTEM_PROMPT (stable — cache)

```
You turn a list of unanswered tender-requirement gaps into the SHORTEST possible set of clear questions
for a human bid manager. Your goal: ask the fewest questions that unblock the most requirements.

RULES
- DEDUPE aggressively. If several requirements need the same fact (a certificate, a turnover figure, a
  policy), ask for it ONCE and link all the requirements it unblocks.
- Make each question specific and answerable in one line or a short sentence — a fact, a number, a
  yes/no, or a document to attach. No open essays.
- Order by impact: questions that unblock GATING requirements first, then by how many requirements each
  unblocks.
- Phrase in plain English, in the second person ("Do you hold…?", "What is your…?"). No jargon, no
  restating the clause.
- Group lightly by theme (certifications, finance, experience, policies) so the list scans fast.
- Do not invent gaps. Only ask about the gaps provided. If a gap is vague, ask the clarifying question
  that would resolve it.

OUTPUT
Only the structured object. Each question carries the list of requirement ids it would unblock.
```

## USER_PROMPT (volatile)

```
The following requirements need input from the human (each with the gap the drafter identified):

{{#each gaps}}
- req {{this.req_id}}{{#if this.is_gating}} (GATING){{/if}}: needs — {{this.missing}}
{{/each}}

Produce the shortest set of questions that unblocks these. Dedupe shared needs. Gating first.
```

## GAP_INTERVIEW_OUTPUT_SCHEMA (structured-output / function args)

```jsonc
{
  "type": "object",
  "properties": {
    "questions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id":            { "type": "string", "description": "e.g. q-1" },
          "question":      { "type": "string", "description": "Plain-English, one-line-answerable." },
          "theme":         { "type": "string", "enum": ["certifications","finance","experience","policies","technical","legal","other"] },
          "answer_type":   { "type": "string", "enum": ["text","number","yes_no","date","document"] },
          "unblocks":      { "type": "array", "items": { "type": "string" }, "description": "requirement ids this answer fills" },
          "unblocks_gating": { "type": "boolean", "description": "true if any unblocked requirement is gating" }
        },
        "required": ["id", "question", "theme", "answer_type", "unblocks", "unblocks_gating"]
      }
    }
  },
  "required": ["questions"]
}
```

> The frontend renders `questions` as the interview. When the human answers, each answer is written back
> to every requirement in `unblocks`, then the answer-generation step re-runs for those to fill the draft.
> `unblocks_gating` lets the UI mark "answer this — it affects a disqualifying requirement."

---

## Red-team checklist (Day 2+)

- [ ] Five requirements needing the same fact → **one** question, `unblocks` lists all five.
- [ ] Gating-unblocking questions sorted first; `unblocks_gating` set correctly.
- [ ] No question restates a clause or uses procurement jargon.
- [ ] `answer_type` matches (a date asks for a date, a doc asks for an attachment).
- [ ] Vague gap ("more detail on experience") → a sharp clarifying question, not echoed vagueness.
- [ ] No invented questions beyond the provided gaps.

### Changelog
- **2026-06-28 (Day 1)** — v1 by J. Pending team ratification of the autofill scope + schema.
