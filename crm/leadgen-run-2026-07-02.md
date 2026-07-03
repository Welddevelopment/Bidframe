# CRM lead generation run - 2026-07-02

Guardrails for this run:

- Reserved IDs start at `L-0401`.
- Add only firms with a real public email on the firm's own site or an official public supplier listing.
- Every row needs public-sector evidence: council, NHS, school, housing association, framework, approved-supplier list or award notice.
- Exclude bid consultancies, big national suppliers, and no-email rows.
- Prefer 10-20 very small targets over volume.
- Use no more than three research subagents at a time; subagents are research-only and do not edit files.
- If hit rate drops below roughly one good candidate per 10-12 checked firms, stop and re-plan before continuing.

## Batch A

Started with three research-only subagents:

- School ICT / AV / edtech infrastructure providers.
- Occupational health SMEs.
- Translation / interpreting SMEs.

Main-agent local seam: small transport / driver services with school, council or NHS contract evidence.

Outcome:

- Added `L-0401` through `L-0412` to `crm/leads.csv`.
- Created same-day free-read drafts in `crm/drafts/L-0401.md` through `L-0412.md`.
- Mix: 4 transport, 3 school ICT, 3 occupational health, 2 interpreting/translation.
- Conversion split: 8 High, 4 Medium; 11 verified, 1 partial (`L-0409`, public source was official but website had template noise).
- Stopped after the first clean batch rather than stretching into lower-confidence seams.

## Batch B re-plan after low hit rate

Broad searches for school catering, surveying/architecture and extra interpreting started returning too many large suppliers, no-email firms, or firms already covered in `crm/leads.csv`. Per guardrail, stop the broad sweep and restart with source-led searches.

Restart plan:

1. **Use procurement evidence first, then company website.**
   - Search terms should include award/framework/client evidence such as `site:bidstats.uk`, `site:find-tender.service.gov.uk`, council approved lists, `framework supplier`, `school contract`, `NHS contract`, `housing association`, and `academy trust`.
   - Only after a candidate has public-sector evidence, open the firm's own website to verify email and fit.

2. **Primary seam: micro surveying and building-survey practices.**
   - Look for condition surveys, measured building surveys, access audits, stock-condition surveys, asbestos-adjacent surveying, party-wall/building consultancy, clerk-of-works and small RICS practices.
   - Public-sector evidence targets: schools condition surveys, council estate surveys, housing stock surveys, NHS/community estate work, academy trusts.
   - Exclude large multidisciplinary consultancies and anything that looks like a procurement/bid advisory firm.

3. **Secondary seam: small specialist education suppliers with tenders.**
   - AP/SEND support, alternative provision transport-adjacent services, school AV/ICT micro-suppliers not already in CRM, school furniture/equipment specialists.
   - Only keep if a direct email plus school/council/framework evidence is visible.

4. **Tertiary seam: interpreting/access only where micro and evidenced.**
   - Focus on BSL/deaf-access co-ops, local community-language providers, local council/NHS contract evidence.
   - Skip broad national language providers even when emailable.

5. **Batch size and abort rule.**
   - Aim for 6-10 leads only.
   - If fewer than 2 keepers appear in the first 20 checked candidates, stop and re-plan again instead of forcing volume.
   - Use at most 2 subagents on restart: one surveying/building-survey seam, one SEND/education supplier seam. Main agent verifies and writes.

Batch B restart also follows `codex-leadgen-handoff.md`: retry transient failures, switch seams when one goes dry, skip any action needing Joel's approval while he is asleep, and keep the overnight loop to find -> verify -> dedupe -> personalise -> commit.

## Batch B outcome

Added `L-0413` through `L-0418` after the low-hit-rate re-plan.

- Mix: 2 access/inclusive-design consultancies, 2 building/measured-survey practices, 1 commercial blinds/glazing firm, 1 signage/wayfinding firm.
- Conversion split: 4 High, 2 Medium; all 6 verified.
- Kept the batch small because the subagents found good leads but both advised against padding with weaker rows.
- Skipped RedboxVR, Barker Associates, Sun-X, Norsign, isGroup and Court Catering for this batch because size or public-sector proof was weaker than the top candidates.
- Closed both Batch B research subagents after collecting results.

## Batch C - 2026-07-03 demo-day expansion

Continued from `codex-continue-2026-07-03.md` with IDs `L-0419+`.

- Seam: sports surfaces, playgrounds and school/council outdoor estate suppliers.
- Added `L-0419` through `L-0424` to `crm/leads.csv`.
- Created same-day free-pilot drafts in `crm/drafts/L-0419.md` through `L-0424.md`.
- Mix: 2 sports-surface/MUGA firms, 1 sports-turf drainage firm, 3 playground/surfacing/outdoor-learning firms.
- Conversion split: 2 High, 4 Medium; all 6 verified.
- PERFECT label held back deliberately. `L-0420` and `L-0422` are the strongest fits, but the batch is logged as High/Medium rather than inflated because most firms are not clearly tiny owner-operator shops.
- Dedupe checked against `crm/leads.csv`, `crm/perfect_leads.md` and `outreach-micro-targets.md` before adding.
