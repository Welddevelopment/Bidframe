# Outreach quality pass - 2026-07-01

Goal: make the existing CRM safer to send by re-verifying contacts, tightening conversion scoring, and
rewriting outreach so Joel needs minimal editing.

## Safety rules

- Main agent edits files; subagents return read-only verification reports.
- Do not invent names, emails, phones or proof. If a contact cannot be confirmed, mark it honestly.
- Commit in chunks: planning/work packets, verification outputs, then draft/send-plan refreshes.
- Keep generated or temporary scripts out of the final commit unless they are useful as repeatable tooling.
- Pull/rebase before every push and check comms for stop/hold messages before each batch.

## Subagent packets

Five read-only packets, capped at five agents total:

1. `L-0001-L-0080`
2. `L-0081-L-0160`
3. `L-0161-L-0240`
4. `L-0241-L-0320`
5. `L-0321-L-0400`

Each packet checks email-bearing rows first, then no-email rows only if they are marked High or have obvious
outreach value. The output should include corrections, confidence downgrades, better source URLs, top free-pilot
candidates, paid-customer candidates, and draft-personalisation hooks.

## Conservative conversion model

Harsh lower-end estimates for cold email:

- Top free-pilot ask, named/team email + strong public-framework pain: 2.0% to accepted pilot.
- Good free-pilot ask, generic domain email + clear public-sector tender pain: 1.25%.
- Medium free-pilot ask, generic/other email or weaker proof: 0.6%.
- Direct paid ask before proof/testimonial: 0.15% to 0.4% to a serious buying conversation.

Working send plan: ask the best 150 leads for a free pilot. At a blended 1.4%-1.8% pilot acceptance rate,
that is roughly 2.1-2.7 pilots, enough to target 2-3. The remaining reachable leads should be written as paid
customer outreach and queued after the pilot/testimonial proof exists.

## Current snapshot

- CRM max: L-0400.
- Rows: 347.
- Email-bearing rows: 315.
- Drafts: 318.
- Statuses: all `Not contacted`.

