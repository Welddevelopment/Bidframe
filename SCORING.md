# Conduct Track Scoring Audit — 4 Jul 2026

Brutal read: Bidframe is competitive, but the last-mile work is now mostly story, rehearsal, and repo hygiene rather than new features.

The product is real: PDF ingest, extraction, reconcile/dedupe, source traceability, evidence-backed drafting, open questions, auth, a frozen Bradwell showcase, and a meaningful test/eval story. The biggest risk is positioning. The Conduct brief is about making slow enterprise change processes faster while keeping the expert in control. If we sound like only an SME tender helper, we undersell the fit. Frame Bidframe as the controlled first-read layer for bid, compliance, and commercial teams handling large tender packs.

## Estimated Rubric Score

| Criterion | Estimate | Why |
|---|---:|---|
| Technical execution | **29 / 35** | Strong real pipeline, eval harness, source proof, autofill, OCR fallback, and tests. Risk: live extraction is too slow/rate-limited for stage; one eval command can understate gating unless explained. |
| Impact and speed-up | **23 / 30** | "Days/weeks of tender first-read into hours" is credible. Needs harder before/after numbers and a clearer enterprise story. |
| User stays in control | **17 / 20** | Strong if shown live: approve, edit, flag, source proof, explicit limits, open questions. Weak if it is only narrated. |
| Demo | **15 / 20** | `/showcase` on Bradwell is a good live surface. Needs a clean 90-second before/after and no live upload risk. |

**Current total: about 84 / 105, roughly 80%.**

With disciplined polish today, this can plausibly move to **91-94 / 105**. If the pitch drifts into feature-tour mode or the repo/demo looks unstable, it can fall toward **75%** despite strong engineering.

## Deliverable Read

| Deliverable | Estimate | Main risk |
|---|---:|---|
| Live demo | **8 / 10** | Strong if driven from `/showcase`; risky if anyone attempts live upload or over-explains. |
| Demo video | **6.5 / 10** | Needs a crisp before/after, not a feature tour. |
| Pitch deck | **7 / 10** | Good proof spine; needs sharper enterprise/control framing and fewer caveats in the main flow. |
| GitHub repo | **8.5 / 10** | Strong README/code/tests. Risk: dirty worktree or confusing eval output. |

## Focus Now

1. **Lead with enterprise control.**
   Say: "Enterprise bid and compliance teams spend days turning 100-page tender packs into a risk register. Miss one pass/fail clause and the bid dies. Bidframe turns that first read into a controlled review workflow."

2. **Make the before/after undeniable.**
   Show a raw Bradwell clause, then the matrix lifting out insurance, disqualification, and the page-31 pricing landmine. This is the judge's "I get it" moment.

3. **Show control live.**
   In `/showcase`: click a deal-breaker, open source, approve with confirmation, edit or flag, answer the open question, and point at the control tally. The line is: "The agent drafts and flags. The user decides."

4. **Do not run live extraction on stage.**
   Use frozen Bradwell. Live upload is for Q&A only if already preloaded and calm.

5. **Make metrics honest but confident.**
   Main claim: "Every tested deal-breaker caught; broader requirement extraction is recall-first and still benchmark-growing." Do not headline overall precision.

6. **Clean the repo before submission.**
   Commit or park in-flight frontend changes intentionally. Judges should not see a broken build, stale demo route, or confusing uncommitted state.

## Best 90-Second Story

Bidframe turns the slow first read of a tender into a controlled, source-backed compliance matrix. The expert stays at the wheel, but the bid-killers surface in minutes.

