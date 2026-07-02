import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LEADS_PATH = ROOT / "crm" / "leads.csv"
DRAFTS_DIR = ROOT / "crm" / "drafts"
BOOKING_URL = "https://cal.com/joel-jeon-o29lfr/bidframe"


LEADS = [
    {
        "id": "L-0401",
        "firm": "Contract Plus (S.W) Ltd",
        "contact_person": "not_found",
        "segment": "SME",
        "sub_sector": "SEN school and social-care passenger transport",
        "region": "Launceston / Cornwall and Devon",
        "size_signal": "family-run local-authority transport firm, 24 private-hire licensed vehicles",
        "email": "contractplus-sw@outlook.com",
        "email_type": "other",
        "website": "contractplus-sw.co.uk",
        "linkedin": "not_found",
        "phone": "not_found",
        "public_tender": "Cornwall Council Passenger Transport Unit approved school and social-service contracts",
        "conversion_estimate": "High",
        "conversion_rationale": "Very small family-run operator with local-authority school/SEND transport contracts and a public email",
        "source": "https://www.contractplus-sw.co.uk/",
        "verification_status": "verified",
        "status": "Not contacted",
        "notes": "2026-07-02 Codex micro-lead batch A; excellent free live tender read fit around local-authority transport compliance.",
        "draft_hook": "your Cornwall Council passenger-transport work for school, SEND and social-service journeys",
        "pain": "safeguarding, DBS checks, passenger assistants, route cover, vehicle standards, insurance and local-authority procedures",
    },
    {
        "id": "L-0402",
        "firm": "Westfield Minibuses",
        "contact_person": "not_found",
        "segment": "SME",
        "sub_sector": "home-to-school minibus and taxi transport",
        "region": "Stockport / Greater Manchester",
        "size_signal": "family-run local minibus and taxi operator",
        "email": "info@westfield-minibuses.co.uk",
        "email_type": "domain",
        "website": "westfield-minibuses.co.uk",
        "linkedin": "not_found",
        "phone": "0161 483 4088",
        "public_tender": "home-to-school transport with local-authority funded journeys and safeguarding procedures",
        "conversion_estimate": "Medium",
        "conversion_rationale": "Small and emailable with school transport fit; public-sector proof is softer than named council contracts",
        "source": "https://www.westfield-minibuses.co.uk/home-to-school",
        "verification_status": "verified",
        "status": "Not contacted",
        "notes": "2026-07-02 Codex micro-lead batch A; use generic greeting; quote H2S/local authority angle without overstating contract status.",
        "draft_hook": "your home-to-school transport work around Stockport and Manchester",
        "pain": "safeguarding, enhanced DBS, regular drivers, local-authority eligibility, passenger needs and short-notice route changes",
    },
    {
        "id": "L-0403",
        "firm": "Gwyn Jones & Son Ltd",
        "contact_person": "Mr Gwyn Jones",
        "segment": "SME",
        "sub_sector": "home-to-school coach and minibus transport",
        "region": "Bridgend / South Wales",
        "size_signal": "fourth-generation family coach operator",
        "email": "admin@gwynjonescoaches.wales",
        "email_type": "domain",
        "website": "gwynjonescoaches.co.uk",
        "linkedin": "not_found",
        "phone": "01656 720 300",
        "public_tender": "numerous home-to-school and college contracts; associated with the local authority since school transport was established",
        "conversion_estimate": "High",
        "conversion_rationale": "Family operator with explicit local-authority school transport contracts and direct email",
        "source": "https://gwynjonescoaches.co.uk/; https://gwynjonescoaches.co.uk/contact/",
        "verification_status": "verified",
        "status": "Not contacted",
        "notes": "2026-07-02 Codex micro-lead batch A; public page names present director Mr Gwyn Jones.",
        "draft_hook": "your long-running home-to-school and college contract work around Bridgend",
        "pain": "route schedules, safeguarding, compliant vehicles, passenger records, local-authority requirements and evidence of operator standards",
    },
    {
        "id": "L-0404",
        "firm": "LMS Travel Ltd",
        "contact_person": "not_found",
        "segment": "SME",
        "sub_sector": "school transport and local bus passenger services",
        "region": "Worcester / Worcestershire",
        "size_signal": "regional passenger transport operator",
        "email": "info@lmstravel.co.uk",
        "email_type": "domain",
        "website": "lmstravel.co.uk",
        "linkedin": "not_found",
        "phone": "01905 25252",
        "public_tender": "terms cover school transport contracts and Worcestershire County Council Passenger Transport review route",
        "conversion_estimate": "Medium",
        "conversion_rationale": "Relevant emailable transport operator, but less clearly micro or owner-led than the strongest rows",
        "source": "https://www.lmstravel.co.uk/terms-of-carriage/",
        "verification_status": "verified",
        "status": "Not contacted",
        "notes": "2026-07-02 Codex micro-lead batch A; keep as Medium due regional-bus scale.",
        "draft_hook": "your school transport contract terms and passenger-transport work in Worcestershire",
        "pain": "ticketing terms, accessibility, CCTV/data handling, school contract duties, complaints and passenger conduct requirements",
    },
    {
        "id": "L-0405",
        "firm": "Topological Ltd",
        "contact_person": "Andrew Hamer",
        "segment": "SME",
        "sub_sector": "school networking, WiFi, AV and access control",
        "region": "Runcorn / North West",
        "size_signal": "small experienced team established in 2006",
        "email": "info@topological.co.uk",
        "email_type": "domain",
        "website": "topological.co.uk",
        "linkedin": "not_found",
        "phone": "01928 572686",
        "public_tender": "approved supplier on DfE-approved Everything ICT framework for schools",
        "conversion_estimate": "High",
        "conversion_rationale": "Small school-infrastructure supplier with explicit framework approval and direct email",
        "source": "https://topological.co.uk/we-are-approved-by-everything-ict-suppliers-to-education/2023/09/17/; https://topological.co.uk/downloads/support/top-support-network.pdf; https://topological.co.uk/about-us/",
        "verification_status": "verified",
        "status": "Not contacted",
        "notes": "2026-07-02 Codex micro-lead batch A; top school ICT pick from subagent research.",
        "draft_hook": "your Everything ICT supplier approval for school networks, WiFi, firewalls and safeguarding systems",
        "pain": "DfE standards, cyber security, safeguarding systems, network coverage, insurance, GDPR and school implementation evidence",
    },
    {
        "id": "L-0406",
        "firm": "Evolve IT Support Ltd",
        "contact_person": "not_found",
        "segment": "SME",
        "sub_sector": "school ICT support, broadband, AV and cyber",
        "region": "Staffordshire / Cheshire / Derbyshire",
        "size_signal": "small local IT support provider serving schools since 2011",
        "email": "hello@evolveitsupport.co.uk",
        "email_type": "domain",
        "website": "evolveitsupport.co.uk",
        "linkedin": "not_found",
        "phone": "01782 898148",
        "public_tender": "education IT support for MATs, academies and maintained schools aligned to DfE standards",
        "conversion_estimate": "High",
        "conversion_rationale": "Small school IT provider with direct email and clear tender-style DfE standards/compliance pain",
        "source": "https://evolveitsupport.co.uk/contact/; https://evolveitsupport.co.uk/school-and-education-it-support-for-staffordshire-cheshire-and-derbyshire/",
        "verification_status": "verified",
        "status": "Not contacted",
        "notes": "2026-07-02 Codex micro-lead batch A; strong micro school-ICT target.",
        "draft_hook": "your school IT support work across Staffordshire, Cheshire and Derbyshire",
        "pain": "DfE digital standards, safeguarding, cyber protection, school broadband, wireless coverage, SLAs and trustee-facing evidence",
    },
    {
        "id": "L-0407",
        "firm": "Dataspire Solutions Ltd",
        "contact_person": "not_found",
        "segment": "SME",
        "sub_sector": "school WiFi, managed ICT and cloud infrastructure",
        "region": "Manchester / North West",
        "size_signal": "education ICT specialist; BETT finalist, not obviously enterprise-scale",
        "email": "info@dataspire.co.uk",
        "email_type": "domain",
        "website": "dataspire.co.uk",
        "linkedin": "not_found",
        "phone": "0345 603 1233",
        "public_tender": "DfE wireless standards and Connect the Classroom school infrastructure guidance",
        "conversion_estimate": "Medium",
        "conversion_rationale": "Strong school procurement pain, but less clearly owner-led than the top school ICT rows",
        "source": "https://www.dataspire.co.uk/contact/; https://www.dataspire.co.uk/blog/wireless-networks-in-education-a-guide-to-the-dfe-standards/",
        "verification_status": "verified",
        "status": "Not contacted",
        "notes": "2026-07-02 Codex micro-lead batch A; Medium due less obvious micro size.",
        "draft_hook": "your Connect the Classroom and DfE wireless-standards work for schools",
        "pain": "wireless coverage, network segmentation, security, BYOD, access points, funding evidence and implementation records",
    },
    {
        "id": "L-0408",
        "firm": "Harris Occupational Health",
        "contact_person": "Dr Paul Harris",
        "segment": "SME",
        "sub_sector": "occupational health and statutory medicals",
        "region": "Yorkshire / Northern England",
        "size_signal": "family-run small independent provider led by founder Dr Paul Harris",
        "email": "office@harrishealthcare.co.uk",
        "email_type": "domain",
        "website": "harrisoccupationalhealth.co.uk",
        "linkedin": "not_found",
        "phone": "07802 286940",
        "public_tender": "experience across NHS, schools, higher education, fire and rescue and local government",
        "conversion_estimate": "High",
        "conversion_rationale": "Tiny clinician-led OH provider with public-sector client proof and direct email",
        "source": "https://www.harrisoccupationalhealth.co.uk/",
        "verification_status": "verified",
        "status": "Not contacted",
        "notes": "2026-07-02 Codex micro-lead batch A; strongest OH fit.",
        "draft_hook": "your occupational-health work across NHS, schools, fire and rescue and local government",
        "pain": "fitness-to-work assessments, ill-health retirement, statutory medicals, report evidence, turnaround times and public-sector pension scheme rules",
    },
    {
        "id": "L-0409",
        "firm": "Occucare Ltd",
        "contact_person": "Dr Andrew Nwobodo",
        "segment": "SME",
        "sub_sector": "occupational health, police/NHS/local government medical assessments",
        "region": "Brentwood / Essex",
        "size_signal": "small specialist occupational-health provider led by a named consultant physician",
        "email": "admin@occucareoh.co.uk",
        "email_type": "domain",
        "website": "occucareoh.co.uk",
        "linkedin": "not_found",
        "phone": "01277 800118",
        "public_tender": "medical adviser experience across police forces, fire services, NHS Trusts and local authorities",
        "conversion_estimate": "High",
        "conversion_rationale": "Small specialist OH provider with explicit public-sector assessment evidence and public email",
        "source": "https://occucareoh.co.uk/contact/; https://occucareoh.co.uk/team/dr-andrew-nwobodo/",
        "verification_status": "partial",
        "status": "Not contacted",
        "notes": "2026-07-02 Codex micro-lead batch A; public details verified, but site has some template footer clutter so keep verification partial.",
        "draft_hook": "your medical-adviser work across police, NHS, fire-service and local-authority assessments",
        "pain": "ill-health retirement evidence, pension assessments, appointed doctor work, medical surveillance, report defensibility and public-sector governance",
    },
    {
        "id": "L-0410",
        "firm": "Everwell Occupational Health",
        "contact_person": "not_found",
        "segment": "SME",
        "sub_sector": "occupational health for schools, academies and colleges",
        "region": "Sandbach / Cheshire / UK clinics",
        "size_signal": "independent occupational-health provider with Sandbach base and UK clinics",
        "email": "enquiries@everwelloh.co.uk",
        "email_type": "domain",
        "website": "everwelloh.co.uk",
        "linkedin": "not_found",
        "phone": "01270 767880",
        "public_tender": "occupational health services for hundreds of schools, academies and colleges; public-sector and education bodies",
        "conversion_estimate": "Medium",
        "conversion_rationale": "Good school/OH overlap with direct email, but broader footprint makes it less micro than top rows",
        "source": "https://www.everwelloh.co.uk/occupational-health-for-schools; https://www.everwelloh.co.uk/",
        "verification_status": "verified",
        "status": "Not contacted",
        "notes": "2026-07-02 Codex micro-lead batch A; use school budget/pay-as-you-go hook.",
        "draft_hook": "your occupational-health support for schools, academies and colleges",
        "pain": "pre-employment checks, staff fitness assessments, ill-health retirement, school budgets, counselling support and transparent evidence for HR decisions",
    },
    {
        "id": "L-0411",
        "firm": "HITS / DCVS Trading Ltd",
        "contact_person": "not_found",
        "segment": "SME",
        "sub_sector": "public-service interpreting, translation and BSL",
        "region": "Hemel Hempstead / East of England",
        "size_signal": "social enterprise regional public-service interpreting provider",
        "email": "interpreting@communityactiondacorum.org.uk",
        "email_type": "domain",
        "website": "hertsinterpreting.org",
        "linkedin": "not_found",
        "phone": "01442 867212",
        "public_tender": "INTRAN partnership contract for county councils, NHS trusts, councils, housing associations and academies; Southend-on-Sea City Council contract",
        "conversion_estimate": "High",
        "conversion_rationale": "Regional social-enterprise provider with direct public email and active council/NHS interpreting contracts",
        "source": "https://www.hertsinterpreting.org/",
        "verification_status": "verified",
        "status": "Not contacted",
        "notes": "2026-07-02 Codex micro-lead batch A; use HITS name in outreach for recognition.",
        "draft_hook": "your INTRAN and Southend-on-Sea interpreting and translation contract work",
        "pain": "interpreter qualifications, DBS, data protection, call-off terms, BSL coverage, language coverage and public-service confidentiality",
    },
    {
        "id": "L-0412",
        "firm": "Signalise Co-op Limited",
        "contact_person": "not_found",
        "segment": "SME",
        "sub_sector": "BSL and deaf communication interpreting",
        "region": "Liverpool / UK",
        "size_signal": "registered multi-stakeholder co-operative for communication professionals and Deaf users",
        "email": "bookings@signalise.coop",
        "email_type": "domain",
        "website": "signalise.coop",
        "linkedin": "not_found",
        "phone": "0151 808 0373",
        "public_tender": "customers include NHS and councils; registered co-op providing BSL and remote interpreting services",
        "conversion_estimate": "High",
        "conversion_rationale": "Small co-op with direct bookings inbox, NHS/council fit and accessibility-framework evidence pain",
        "source": "https://signalise.coop/",
        "verification_status": "verified",
        "status": "Not contacted",
        "notes": "2026-07-02 Codex micro-lead batch A; BSL specialist, strong social-value and accessibility tender angle.",
        "draft_hook": "your NHS and council communication-access work through a co-operative BSL model",
        "pain": "registered communication professionals, accessibility requirements, social value, video interpreting, booking records and public-sector confidentiality",
    },
]


FIELDNAMES = [
    "id",
    "firm",
    "contact_person",
    "segment",
    "sub_sector",
    "region",
    "size_signal",
    "email",
    "email_type",
    "website",
    "linkedin",
    "phone",
    "public_tender",
    "conversion_estimate",
    "conversion_rationale",
    "source",
    "verification_status",
    "status",
    "notes",
]


def first_name(name: str) -> str:
    if not name or name == "not_found" or "/" in name or "&" in name:
        return ""
    first = name.replace("Dr ", "").replace("Mr ", "").split()[0]
    return first


def draft_text(lead: dict) -> str:
    greeting = f"Hi {first_name(lead['contact_person'])}," if first_name(lead["contact_person"]) else "Hi,"
    sector = lead["sub_sector"]
    subject = "Free tender read - today or tomorrow"
    return f"""# {lead['firm']} ({lead['id']})

> Email: {lead['email']} | {lead['conversion_estimate']} | status: {lead['status']}
> Phone: {lead['phone']} | Book a slot: {BOOKING_URL}
> Context: {sector}, {lead['region']}. {lead['draft_hook']}

## Cold email

Subject: {subject}

{greeting}

I found {lead['firm']} through {lead['draft_hook']}. That looks like exactly the kind of public-sector work where the tender is not just a price exercise. The hidden risk is usually in the pass/fail details: {lead['pain']}.

Bidframe reads the tender and pulls those deal-breakers to the top, with each one tied back to the exact clause. On a live public-sector tender it caught every disqualifier and invented nothing.

I am doing free 15-minute live tender reads today and tomorrow. If you send one tender you are bidding, I will show you on the call what would disqualify you and where it sits in the document.

A couple of free slots are open here: {BOOKING_URL}. Or just reply with a tender and a time that suits.

After this week I am treating these as paid pilots, so if there is a live bid on your desk now, this is the easiest time to try it.

Best,
Joel
Bidframe

## LinkedIn DM

Hi - I found {lead['firm']} through {lead['draft_hook']}. Bidframe reads a public-sector tender and flags the pass/fail deal-breakers first, each tied to its clause. I am running free 15-minute live reads today and tomorrow: send a tender you are bidding and I will show you what would disqualify you, live. Worth 15 minutes? {BOOKING_URL}
"""


def main() -> None:
    with LEADS_PATH.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    existing_ids = {row["id"] for row in rows}
    existing_firms = {row["firm"].lower() for row in rows}
    duplicate_ids = [lead["id"] for lead in LEADS if lead["id"] in existing_ids]
    duplicate_firms = [lead["firm"] for lead in LEADS if lead["firm"].lower() in existing_firms]
    if duplicate_ids or duplicate_firms:
        raise SystemExit(f"Duplicates found ids={duplicate_ids} firms={duplicate_firms}")

    with LEADS_PATH.open("a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        for lead in LEADS:
            writer.writerow({key: lead[key] for key in FIELDNAMES})

    DRAFTS_DIR.mkdir(exist_ok=True)
    for lead in LEADS:
        (DRAFTS_DIR / f"{lead['id']}.md").write_text(draft_text(lead), encoding="utf-8", newline="\n")

    print(f"added {len(LEADS)} leads and drafts: {LEADS[0]['id']} to {LEADS[-1]['id']}")


if __name__ == "__main__":
    main()
