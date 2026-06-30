// Assemble crm/leads.csv from the per-lead JSON the build workflow wrote to crm/rows/.
// Sorted by conversion (High>Medium>Low), then email_type (gmail>domain>other>none), then firm.
// Run: node crm/_rows-to-csv.js
const fs = require('fs');
const path = require('path');

const CRM = __dirname;
const ROWS = path.join(CRM, 'rows');
const OUT = path.join(CRM, 'leads.csv');

const COLS = ['id','firm','contact_person','segment','sub_sector','region','size_signal','email',
  'email_type','website','linkedin','phone','public_tender','conversion_estimate',
  'conversion_rationale','source','verification_status','status','notes'];

const convRank = e => ({High:0, Medium:1, Low:2}[e] ?? 3);
const emailRank = e => ({gmail:0, domain:1, other:2, none:3}[e] ?? 3);

function seg(sub) {
  const s = String(sub || '').toLowerCase();
  return (s.includes('consult') || s.includes('freelance') || s.includes('bid writ')) ? 'Consultancy' : 'SME';
}
function esc(v) {
  const s = (v === undefined || v === null || v === '') ? '' : String(v);
  return '"' + s.replace(/"/g, '""').replace(/\r?\n/g, ' ') + '"';
}

if (!fs.existsSync(ROWS)) { console.error('no rows dir'); process.exit(1); }
const files = fs.readdirSync(ROWS).filter(f => f.endsWith('.json'));
const leads = [];
for (const f of files) {
  try {
    const o = JSON.parse(fs.readFileSync(path.join(ROWS, f), 'utf8'));
    o.segment = o.segment || seg(o.sub_sector);
    o.status = o.status || 'Not contacted';
    leads.push(o);
  } catch (e) { console.error('skip ' + f + ': ' + e.message); }
}

leads.sort((a, b) =>
  convRank(a.conversion_estimate) - convRank(b.conversion_estimate) ||
  emailRank(a.email_type) - emailRank(b.email_type) ||
  String(a.firm).localeCompare(String(b.firm)));

const lines = [COLS.join(',')];
for (const l of leads) lines.push(COLS.map(c => esc(l[c])).join(','));
fs.writeFileSync(OUT, lines.join('\n') + '\n', 'utf8');

const withEmail = leads.filter(l => l.email && l.email !== 'not_found' && l.email_type !== 'none').length;
const high = leads.filter(l => l.conversion_estimate === 'High').length;
console.log('leads.csv: ' + leads.length + ' rows | ' + withEmail + ' with a public email | ' + high + ' High-conversion');
