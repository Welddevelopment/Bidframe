# CRM lead generation run - 2026-07-04

## Batch D - 50 verified micro-targets migrated into the CRM

Goal: make the strongest researched micro-targets operationally sendable in `crm/leads.csv`, with one draft per lead and a compact send list.

Guardrails followed:

- Used only targets already recorded as verified in `outreach-micro-targets.md`.
- Skipped `MT-57` because the current priority review flags its send-to email as unverified.
- Dedupe checked against existing `crm/leads.csv` by firm and email before assigning IDs.
- No invented contacts: where only a generic greeting was present, `contact_person` is `not_found`.
- Rows are `L-0425` through `L-0474`.

Outcome:

- Added 50 leads to `crm/leads.csv`.
- Split: 38 High / PERFECT micro-targets, 12 Medium / GOOD micro-targets.
- Created drafts in `crm/drafts/L-0425.md` through `crm/drafts/L-0474.md`.
- Created a compact send list: `crm/sendable-list-2026-07-04.csv`.

Recommended first sends from this batch:

- `L-0425` - Midland Fire Ltd - sales@midland-fire.co.uk - compliance trades / fire, water, drainage and grounds
- `L-0426` - Cropper Grounds Maintenance - info@grounds-maintenance.com - compliance trades / fire, water, drainage and grounds
- `L-0427` - Exjet - info@exjet.co.uk - compliance trades / fire, water, drainage and grounds
- `L-0428` - H2O Hygiene Ltd - info@h2ohygiene.co.uk - compliance trades / fire, water, drainage and grounds
- `L-0429` - Hallifax Care - info@hallifaxcare.co.uk - care
- `L-0430` - Devon & Cornwall Care Services (DACCS) - info@daccservices.com - care
- `L-0431` - Home Care Wales - info@homecarewales.com - care
- `L-0432` - Charles Walker Construction Ltd - hello@charleswalkerconstruction.co.uk - building, grounds and property-care
- `L-0433` - Top Garden Services - info@topgardenservices.com - building, grounds and property-care
- `L-0434` - Headcorn Heating Ltd - mail@headcornheating.co.uk - heating, plumbing and electrical
- `L-0435` - Reids Playground Maintenance Ltd - rpm@reidsplayground.co.uk - playground inspection, repair and install
- `L-0436` - TK Play Ltd - enquiries@tkplay.co.uk - playground inspection, repair and install

Validation notes:

- The lead rows parse as CSV.
- Draft count for this batch is 50.
- `MT-57 Hall Aspects` remains manual-follow-up only until a public email is verified.
