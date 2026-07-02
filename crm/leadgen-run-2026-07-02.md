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
