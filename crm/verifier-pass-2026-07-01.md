# CRM verifier pass - 2026-07-01

Safety log for the second verifier sweep across existing leads. Corrections below are the durable
changes applied to `crm/leads.csv`; draft regeneration is handled by `crm/build_outreach_send_plan.py`.

## Send-safety decisions

- `human_review` and `human_review_no_send` are no longer eligible for generated send batches.
- Free-pilot asks stay capped at 150 because the harsh lower-end model needs about 150 asks for 2-3 accepted pilots.
- Paid outreach is held as `paid_later`; it should be sent only after the free-pilot batch produces proof, feedback or a testimonial.
- Named greetings are removed when the verifier could confirm the email but not the named person.

## Applied corrections

| Lead | Decision |
|------|----------|
| L-0001 | Promoted Tsaks Consulting to verified; Jason Cooney/source confirmed. |
| L-0002 | Added `admin@tendervictory.co.uk`; verified; high free-pilot fit. |
| L-0013 | Kept reachable but downgraded to partial because Hudson/Succeed/Tender Consultants branding is mixed. |
| L-0014 | Switched GovData route to `winbusiness@govdata.co.uk`; partial; generic greeting. |
| L-0017 | Promoted to Medium but kept partial; email confirmed, Barkers/Mike Baron link unconfirmed. |
| L-0021-L-0025 | Added St Helens care-provider-list emails and verification statuses. |
| L-0042 | Corrected Fareport to `info@fareport.co.uk`. |
| L-0043 | Added Runway Training `enquiries@runwaytraining.co.uk` from UKRLP record. |
| L-0117 | Moved Cooper Weston to `human_review_no_send`; exact email not publicly confirmed. |
| L-0152 | Promoted Branching Out to verified high. |
| L-0183 | Corrected Guideline/KLEEMANN route to `uk@kleemannlifts.com`; medium paid-later fit. |
| L-0195 | Corrected Advantage Catering route but set `human_review` before send. |
| L-0232 | Corrected Denby contact to Richard Garfitt. |
| L-0238 | Corrected Award route but set `human_review` before send. |
| L-0265 | Corrected FD Fire Door to `enquiries@fdfiredoor.co.uk`. |
| L-0276 | Set to `human_review`; email confirmed but named contact unconfirmed. |
| L-0278, L-0283, L-0290, L-0302, L-0303, L-0306 | Removed unconfirmed named greetings; send generic if otherwise eligible. |
| L-0391 | Added Lauren Meston as Future Pathways CIC named contact. |

## Drafting direction

The regenerated drafts should sound like a human checked the company, not a mail merge. Keep the
first line grounded in the actual sector signal, use the free pilot ask only for the first 150, and
avoid claiming certainty about a named person unless the verifier confirmed it.
