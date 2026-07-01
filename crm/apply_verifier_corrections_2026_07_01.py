import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LEADS_PATH = ROOT / "crm" / "leads.csv"


CORRECTIONS = {
    "L-0001": {
        "source": "https://tsaksconsulting.com/our-director-jason-cooney/",
        "verification_status": "verified",
        "notes": "Verifier pass 2026-07-01: info@tsaksconsulting.com and Jason Cooney founder identity confirmed.",
    },
    "L-0002": {
        "email": "admin@tendervictory.co.uk",
        "email_type": "domain",
        "website": "tendervictory.co.uk",
        "source": "https://tendervictory.co.uk/",
        "verification_status": "verified",
        "conversion_estimate": "High",
        "notes": "Verifier pass 2026-07-01: public admin@ email confirmed; founder-led bid consultancy.",
    },
    "L-0013": {
        "source": "https://www.tenderconsultants.co.uk/opening-our-us-head-office/; https://hudson-bidwriters.com/contact-bid-writers/",
        "verification_status": "partial",
        "conversion_estimate": "Medium",
        "notes": "Verifier pass 2026-07-01: hi@tenderconsultants.co.uk confirmed, but Hudson/Succeed/Hudson Outsourcing brand path is mixed; keep copy brand-neutral.",
    },
    "L-0014": {
        "email": "winbusiness@govdata.co.uk",
        "email_type": "domain",
        "source": "https://govdata.co.uk/about-us/; https://govdata.co.uk/lead-the-way-in-uk-tech/",
        "verification_status": "partial",
        "conversion_estimate": "Medium",
        "notes": "Verifier pass 2026-07-01: prefer public winbusiness@ route; use generic greeting and avoid over-personalising.",
    },
    "L-0017": {
        "verification_status": "partial",
        "conversion_estimate": "Medium",
        "notes": "Verifier pass 2026-07-01: info@bidwritingservice.com confirmed; Barkers/Mike Baron link remains unconfirmed, so keep copy generic.",
    },
    "L-0018": {
        "verification_status": "verified",
        "conversion_estimate": "High",
        "conversion_rationale": "Public email confirmed; reachable bid consultancy with strong first-read tender review fit",
        "notes": "Verifier pass 2026-07-01: info@ confirmed; keep free-pilot copy focused on bid-pack review, no unsupported pricing claims.",
    },
    "L-0021": {
        "email": "sthelenscare@cahg.co.uk",
        "email_type": "domain",
        "source": "St Helens Council care provider list PDF",
        "verification_status": "verified",
        "conversion_estimate": "High",
        "notes": "Verifier pass 2026-07-01: provider-list email confirmed; care-framework proof makes this a strong free-pilot candidate.",
    },
    "L-0022": {
        "email": "CareCoordinator@luminacare.co.uk",
        "email_type": "domain",
        "website": "luminacare.co.uk",
        "source": "St Helens Council care provider list PDF",
        "verification_status": "verified",
        "conversion_estimate": "High",
        "notes": "Verifier pass 2026-07-01: provider-list email confirmed; care tender evidence/admin pain is relevant.",
    },
    "L-0023": {
        "email": "enquiries@ablesupport.co.uk",
        "email_type": "domain",
        "website": "ablesupport.co.uk",
        "source": "St Helens Council care provider list PDF",
        "verification_status": "verified",
        "conversion_estimate": "High",
        "notes": "Verifier pass 2026-07-01: provider-list email confirmed; strong care-sector pilot fit.",
    },
    "L-0024": {
        "email": "sthelens@yes-care.co.uk",
        "email_type": "domain",
        "website": "yes-care.co.uk",
        "source": "St Helens Council care provider list PDF",
        "verification_status": "verified",
        "conversion_estimate": "High",
        "notes": "Verifier pass 2026-07-01: provider-list email confirmed; strong care-sector pilot fit.",
    },
    "L-0025": {
        "email": "sthelens@bluebirdcare.co.uk",
        "email_type": "domain",
        "website": "bluebirdcare.co.uk",
        "source": "St Helens Council care provider list PDF",
        "verification_status": "verified",
        "conversion_estimate": "Medium",
        "notes": "Verifier pass 2026-07-01: provider-list email confirmed; larger franchise signal means medium conversion.",
    },
    "L-0042": {
        "email": "info@fareport.co.uk",
        "email_type": "domain",
        "source": "https://www.fareport.co.uk/contact-us/",
        "verification_status": "verified",
        "conversion_estimate": "High",
        "notes": "Verifier pass 2026-07-01: corrected public email to info@fareport.co.uk.",
    },
    "L-0043": {
        "email": "enquiries@runwaytraining.co.uk",
        "email_type": "domain",
        "source": "https://www.ukrlp.co.uk/ukrlp/ukrlp_provider.page_pls_provDetails?pn_p_id=10049149&pv_status=VERIFIED&pv_vis_code=L",
        "verification_status": "verified",
        "conversion_estimate": "High",
        "notes": "Verifier pass 2026-07-01: public enquiries@ route confirmed through UKRLP provider record.",
    },
    "L-0117": {
        "verification_status": "human_review_no_send",
        "conversion_estimate": "Low",
        "notes": "Verifier pass 2026-07-01: firm is real, but exact cooper@ email was not publicly confirmed; do not send until rechecked.",
    },
    "L-0152": {
        "verification_status": "verified",
        "conversion_estimate": "High",
        "source": "https://branchingoutservices.co.uk/groundsmaintenance/; https://branchingoutservices.co.uk/contact/",
        "notes": "Verifier pass 2026-07-01: kerrie@branchingoutservices.co.uk treated as confirmed named route; strong grounds-maintenance pilot candidate.",
    },
    "L-0158": {
        "email": "operations@vitaoh.co.uk",
        "email_type": "domain",
        "source": "https://ayleshambusinessnetwork.co.uk/member-directory/vita-occupational-health-ltd/",
        "verification_status": "verified",
        "conversion_estimate": "High",
        "notes": "Verifier pass 2026-07-01: operations@ confirmed; avoid irrelevant US/Texas wording and use Aylesham directory/public-sector OH hook.",
    },
    "L-0159": {
        "source": "https://price-buckland.co.uk/",
        "verification_status": "verified",
        "conversion_estimate": "High",
        "notes": "Verifier pass 2026-07-01: sales@price-buckland.co.uk confirmed; school uniform tender fit.",
    },
    "L-0160": {
        "source": "https://workwearltd.com/pages/contact; https://uk.linkedin.com/company/workwear-east-anglia",
        "verification_status": "verified",
        "conversion_estimate": "High",
        "notes": "Verifier pass 2026-07-01: sales@workwearltd.com and David Tennens public signals confirmed.",
    },
    "L-0183": {
        "email": "uk@kleemannlifts.com",
        "email_type": "domain",
        "source": "https://kleemannlifts.com/company/contact/guideline-lift-services-ltd-trading-kleemann",
        "verification_status": "verified",
        "conversion_estimate": "Medium",
        "notes": "Verifier pass 2026-07-01: Guideline now trades through KLEEMANN UK; use uk@kleemannlifts.com and slower-enterprise wording.",
    },
    "L-0195": {
        "email": "sales@advantagecateringequipment.co.uk",
        "email_type": "domain",
        "source": "https://ceda.co.uk/members/advantage-catering-equipment-ltd/; https://www.catering-equipment-repair.co.uk/terms-conditions/",
        "verification_status": "human_review",
        "conversion_estimate": "High",
        "notes": "Verifier pass 2026-07-01: official/CEDA route points to sales@advantagecateringequipment.co.uk; verify one more time before sending.",
    },
    "L-0232": {
        "contact_person": "Richard Garfitt",
        "source": "https://www.tuco.ac.uk/procurement/our-suppliers/denby-catering-equipment-limited-design-and-installation",
        "verification_status": "verified",
        "conversion_estimate": "High",
        "notes": "Verifier pass 2026-07-01: corrected public contact to Richard Garfitt via TUCO supplier page.",
    },
    "L-0238": {
        "email": "info@awardrefrigeration.co.uk",
        "email_type": "domain",
        "source": "https://www.awardfm.com/",
        "verification_status": "human_review",
        "conversion_estimate": "Medium",
        "notes": "Verifier pass 2026-07-01: possible corrected trading email info@awardrefrigeration.co.uk; verify before sending.",
    },
    "L-0265": {
        "email": "enquiries@fdfiredoor.co.uk",
        "email_type": "domain",
        "source": "https://www.fdfiredoor.co.uk/",
        "verification_status": "verified",
        "conversion_estimate": "High",
        "notes": "Verifier pass 2026-07-01: corrected email from info@ to public enquiries@.",
    },
    "L-0276": {
        "contact_person": "not_found",
        "verification_status": "human_review",
        "conversion_estimate": "Medium",
        "notes": "Verifier pass 2026-07-01: email confirmed but named contact unconfirmed; use generic greeting and verify before sending.",
    },
    "L-0278": {
        "contact_person": "not_found",
        "notes": "Verifier pass 2026-07-01: email confirmed but named contact unconfirmed; use generic greeting.",
    },
    "L-0283": {
        "contact_person": "not_found",
        "notes": "Verifier pass 2026-07-01: email confirmed but named contact unconfirmed; use generic greeting.",
    },
    "L-0290": {
        "contact_person": "not_found",
        "notes": "Verifier pass 2026-07-01: named contact unconfirmed; use generic greeting.",
    },
    "L-0302": {
        "contact_person": "not_found",
        "notes": "Verifier pass 2026-07-01: named contact unconfirmed; use generic greeting.",
    },
    "L-0303": {
        "contact_person": "not_found",
        "notes": "Verifier pass 2026-07-01: named contact unconfirmed; use generic greeting.",
    },
    "L-0306": {
        "contact_person": "not_found",
        "notes": "Verifier pass 2026-07-01: named contact unconfirmed; use generic greeting.",
    },
    "L-0391": {
        "contact_person": "Lauren Meston",
        "source": "https://www.futurepathwayscic.com/contact",
        "verification_status": "verified",
        "conversion_estimate": "High",
        "notes": "Verifier pass 2026-07-01: Lauren Meston public named contact/email confirmed; strong AP pilot candidate.",
    },
}


def append_note(existing: str, note: str) -> str:
    existing = (existing or "").strip()
    if not existing:
        return note
    if note in existing:
        return existing
    return f"{existing} | {note}"


def main() -> None:
    with LEADS_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames or []

    touched = []
    for row in rows:
        update = CORRECTIONS.get(row["id"])
        if not update:
            continue
        touched.append(row["id"])
        for key, value in update.items():
            if key == "notes":
                row[key] = append_note(row.get(key, ""), value)
            else:
                row[key] = value

    missing = sorted(set(CORRECTIONS) - set(touched))
    if missing:
        raise SystemExit(f"Missing lead ids: {', '.join(missing)}")

    with LEADS_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"applied verifier corrections: {len(touched)} rows")


if __name__ == "__main__":
    main()
