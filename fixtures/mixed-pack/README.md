# Mixed-pack QA fixtures

Synthetic tender-pack files for the mixed-pack ingestion sprint (`ops/mixed-pack-04-release-qa.md`).
**All content is invented** — no real tender text — so they're safe to commit. Each file plants explicit
disqualifier language so backend extraction + the deterministic net (`engine.gating_scan`) have real gates
to catch, proving the pipeline works on non-PDF sources. Regenerate: see the sprint QA log.

Represents a realistic pack: a PDF ITT (use any existing `data/tenders/*.pdf` as the PDF part) **plus**
these Word / Excel / CSV companions.

## Expected extraction (ground truth for the other lanes)

### `sample-return-forms.docx`
| # | Requirement (planted) | Type | Deal-breaker? |
|---|---|---|---|
| 1 | Tenders received **no later than 12:00 noon on 30 Sept 2025**; late tenders rejected | mandatory | **yes** (deadline) |
| 2 | **Employer's Liability insurance ≥ £5,000,000 — Pass/Fail** | mandatory | **yes** (insurance) |
| 3 | **Public Liability insurance ≥ £10,000,000 (Pass/Fail)** | mandatory | **yes** (insurance) |
| 4 | **Form of Tender** completed, signed, returned; failure → disqualified | mandatory | **yes** (return) |
| 5 | Two client references (optional but scored) | optional | no |

### `sample-pricing-schedule.xlsx` (sheet `Pricing`)
| # | Requirement (planted) | Type | Deal-breaker? |
|---|---|---|---|
| 1 | All pricing rows **completed and returned**; omitting a price / altering the schedule → **rejected** | mandatory | **yes** (return/rejection) |
| 2 | Priced schedule submitted **by the deadline**; late/incomplete → **excluded** | mandatory | **yes** (deadline) |

Also: a 3-row price table (Item / Description / Unit / Rate / Annual Total) with empty rate cells to fill.

### `sample-compliance.csv`
| ref | Requirement (planted) | Type | Deal-breaker? |
|---|---|---|---|
| C1 | Signed **anti-collusion certificate**; failure → **exclusion** | mandatory | **yes** (exclusion) |
| C2 | Optional social-value initiatives | optional | no |

## What "good" looks like on ingest
- Every extracted requirement carries `source_filename` = the origin file (not the PDF).
- The **7 planted deal-breakers** above are all flagged gating (the deterministic net catches the
  pass/fail / rejection / exclusion / deadline language even if the LLM extraction misses one).
- Non-PDF rows show a **source excerpt + locator** (page/sheet/row) but **no fake PDF highlight**.
