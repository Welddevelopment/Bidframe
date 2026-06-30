export const meta = {
  name: 'bidframe-crm-build',
  description: 'Expand, verify, and draft outreach for a focused first wave of UK SME bidder leads',
  phases: [
    { title: 'Expand', detail: 'a few parallel sector research agents find named SME leads' },
    { title: 'Process', detail: 'one agent per lead: verify the contact, re-score, draft DM + email' },
  ],
}

const BASE = 'c:/Users/Sue Kim/ICL hack/Tender_Breakdown_AI-Agent/crm'
const PIPELINE_CAP = 48 // first-wave size: verify + draft this many top leads (keeps token use modest)

const POSITIONING = `Bidframe turns a public-sector tender into a verified, source-linked requirements
checklist in minutes: it catches the pass/fail requirement that would disqualify the whole bid, flags
what it is unsure about instead of guessing, and drafts the response from the bidder's own evidence with
every claim cited. The human approves every call. Built for SME bidders and small bid consultancies that
enterprise tools (e.g. AutogenAI) price out. We compete on auditability + the loud disqualifier catch +
measured recall, never on "we write your bid".`

const STYLE = `STYLE RULES (hard): British spelling. No hype, no exclamation marks, no emoji. NO em dashes
(use a comma or full stop). Lead with trust/traceability, never prose quality. The ask is soft: ~10
minutes, run it live on a tender they recognise, an honest expert read, no hard sell. Keep the DM under
~120 words and the email under ~160 words. Address the named person if known, else a warm role greeting.`

const LEADS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    leads: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          firm: { type: 'string' },
          contact_person: { type: 'string' },
          sub_sector: { type: 'string' },
          region: { type: 'string' },
          size_signal: { type: 'string' },
          email: { type: 'string' },
          email_type: { type: 'string', enum: ['gmail', 'domain', 'other', 'none'] },
          website: { type: 'string' },
          linkedin: { type: 'string' },
          phone: { type: 'string' },
          public_tender: { type: 'string' },
          conversion_estimate: { type: 'string', enum: ['High', 'Medium', 'Low'] },
          conversion_rationale: { type: 'string' },
          source: { type: 'string' },
          verification_status: { type: 'string', enum: ['verified', 'partial', 'unverified'] },
          notes: { type: 'string' },
        },
        required: ['firm', 'sub_sector', 'email', 'email_type', 'website', 'conversion_estimate', 'source', 'verification_status'],
      },
    },
  },
  required: ['leads'],
}

const RULES = `ABSOLUTE RULES (fabricated data is worse than no data):
- NEVER invent or guess an email, person name, or phone. Only record contact details found on a REAL public web page.
- Every email and key fact MUST have a source URL in the "source" field.
- "not_found" is an acceptable, expected value. An honest row with no email beats a fake one.
- Prefer SMALL / SME / sole-trader / regional firms that bid for UK public-sector contracts. Avoid national giants.
- A company's own published "Contact us" email is fine to record (public, not private).
- A findable public EMAIL is the most valuable field (we are locked out of LinkedIn). Gmail/owner-read inboxes rank highest.`

function expandPrompt(sector, idx) {
  return `You are a B2B lead-research analyst for Bidframe. ${POSITIONING}

YOUR SECTOR: ${sector}

Find REAL, named UK SME firms in this sector (aim 12-18, quality over quantity), each with publicly-available
contact info, using WebSearch + WebFetch. Mine Contracts Finder / Find a Tender award notices, council
framework awardee lists, and the firms' own websites for a public contact email.

CRASH-RESILIENCE (important): as soon as you have confirmed a few leads, write your running list to
"${BASE}/rows_raw/expand-${idx}.json" (a JSON array of lead objects) and REWRITE that file each time you add
more. This way the work survives if you are interrupted before your final answer. Your final structured
return should match that file.

${RULES}

Conversion scoring: High = small/solo, bids often into public frameworks, AND a findable public email
(esp. gmail). Medium = real SME bidder but only website/contact-form found, OR strong target that is
LinkedIn-only. Low = larger/slower or no contact path. Set verification_status = "verified" only when you
fetched a page showing the email + identity; "partial" if some fields sourced; "unverified" otherwise.

Return ONLY the structured object. Do not pad with fake rows.`
}

const EXPAND = [
  'UK SME domiciliary / home-care and supported-living providers that bid for council care frameworks.',
  'UK SME commercial cleaning + FM firms that bid for school / council / NHS cleaning contracts.',
  'UK SME contract caterers that bid for school / academy-trust / council catering contracts.',
  'UK SME IT managed-service providers (G-Cloud / academy-trust ICT) that bid for public-sector ICT.',
  'UK SME training / employability providers that bid for Skills Bootcamp and DWP contracts.',
  'UK SME security (manned guarding) and grounds-maintenance firms that bid for council / school contracts.',
  'Small and solo UK bid-writing / tender consultancies and freelance bid writers (often Gmail-reachable).',
]

function normKey(firm) {
  return String(firm || '')
    .toLowerCase()
    .replace(/\b(ltd|limited|llp|plc|services|group|uk|the)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

function collect(waveResults) {
  const out = []
  for (const r of (waveResults || []).filter(Boolean)) for (const l of (r.leads || [])) out.push(l)
  return out
}

function dedupe(leads, seenKeys) {
  const fresh = []
  for (const l of leads) {
    const k = normKey(l.firm)
    if (!k || seenKeys.has(k)) continue
    seenKeys.add(k)
    fresh.push(l)
  }
  return fresh
}

const rank = (e) => (e === 'High' ? 0 : e === 'Medium' ? 1 : 2)

// One agent per lead: independently verify the contact, re-score conversion, then write the row + drafts.
function processLead(lead) {
  const rec = JSON.stringify(lead)
  const prompt = `You handle one sales lead for Bidframe end to end: verify it, then write its record + outreach. ${POSITIONING}

LEAD (id ${lead.id}): ${rec}

STEP 1 - VERIFY (WebSearch + WebFetch, do not trust the prior research blindly):
- Open the source URL and the firm's website. Confirm the email actually appears on a real public page for
  THIS firm. Correct it if the page shows a better address; if you cannot confirm any public email, use
  "not_found". NEVER invent one.
- Confirm it is a real UK SME that plausibly bids for public-sector work.
- Re-score conversion (High/Medium/Low) on small/decides-fast + bids-often + reachable-by-email-now (we are
  locked out of LinkedIn, so email-reachable scores higher). Set verification_status: "verified" only if you
  confirmed email + identity on a fetched page; "partial" if some; "unverified" if not.

STEP 2 - WRITE TWO FILES:
1. FIRST write "${BASE}/rows/${lead.id}.json" as a single-line compact JSON object with these keys (use your
   verified values): id, firm, contact_person, sub_sector, region, size_signal, email, email_type, website,
   linkedin, phone, public_tender, conversion_estimate, conversion_rationale, source, verification_status,
   notes. Use "not_found"/"" for anything unknown. Base it on the LEAD above with your corrections applied.
2. THEN write "${BASE}/drafts/${lead.id}.md" with two personalised, ready-to-send messages tailored to THIS
   firm, its sub_sector (${lead.sub_sector}) and its public_tender if present. Structure:

# ${lead.firm} (${lead.id})
- Segment: ${lead.sub_sector} | Conversion: <your score> | Email: <verified email or not_found>

## LinkedIn cold DM
<the DM>

## Cold email
Subject: <subject line>

<the email body, signed off as "Joel, Bidframe">

${STYLE}

If the email is not_found, still write both (the email is then a template for when an address is found).
After both writes, reply with just: ok ${lead.id}`
  return agent(prompt, { agentType: 'general-purpose', model: 'sonnet', effort: 'low', phase: 'Process', label: 'lead:' + lead.id })
}

// ---- run ----
phase('Expand')
log('Expansion: ' + EXPAND.length + ' sector research agents')
const wave = await parallel(EXPAND.map((s, i) => () => agent(expandPrompt(s, i), { schema: LEADS_SCHEMA, agentType: 'general-purpose', model: 'sonnet', phase: 'Expand', label: 'expand:' + s.slice(0, 26) })))

const seen = new Set()
let leads = dedupe(collect(wave), seen)
leads.sort((a, b) => rank(a.conversion_estimate) - rank(b.conversion_estimate))
leads = leads.map((l, i) => ({ ...l, id: 'L-' + String(i + 1).padStart(4, '0') }))
log('Deduped leads: ' + leads.length)

const pipe = leads.slice(0, PIPELINE_CAP)
const dropped = leads.length - pipe.length
if (dropped > 0) log('NOTE: ' + dropped + ' lower-ranked leads found but beyond the ' + PIPELINE_CAP + '-lead first-wave cap (not auto-processed)')

phase('Process')
await parallel(pipe.map((l) => () => processLead(l)))

return {
  total_leads_found: leads.length,
  verified_and_drafted: pipe.length,
  not_auto_processed: dropped,
  rows_dir: BASE + '/rows',
  drafts_dir: BASE + '/drafts',
}
