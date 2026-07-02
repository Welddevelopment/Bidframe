"""gating_scan safety net: surfaces disqualifier lines extraction missed, stays quiet when covered."""
from engine.gating_scan import scan_candidates, uncovered_gating

PAGES = [
    (1, "The contract is for cleaning two sites. Any tenderer engaged in collusive tendering "
        "shall be disqualified. Services run Monday to Friday."),
    (2, "Tenders must be received no later than 12:00 noon on 21 March 2016. Late tenders will "
        "not be considered."),
    (3, "3.2.1 Previous Relevant Experience (Pass/Fail). Describe similar prior contracts."),
]


def test_scan_finds_strong_disqualifier_signals():
    texts = " ".join(c["text"].lower() for c in scan_candidates(PAGES))
    assert "collusive" in texts and "disqualified" in texts
    assert "no later than" in texts or "not be considered" in texts
    assert "pass/fail" in texts.replace(" ", "") or "pass/fail" in texts


def test_taxonomy_catches_canonical_uk_ps_gate_vocabulary():
    """Canonical UK public-sector gate phrasings the 8-tender corpus may not all use verbatim,
    but real tenders will — the net must recognise them so recall generalises beyond the corpus."""
    pages = [
        (1, "A supplier deemed ineligible under the exclusion grounds cannot proceed."),
        (2, "Failure to sign the declaration will render your tender invalid."),
        (3, "Any bid that is void will be set aside."),
        # generalised submission-deadline phrasing (verb + words + 'no later than')
        (4, "You must submit your Tender no later than 23-Oct-2025 12:00."),
    ]
    joined = " ".join(c["text"].lower() for c in scan_candidates(pages))
    assert "ineligible" in joined
    assert "invalid" in joined
    assert "void" in joined
    assert "no later than" in joined


def test_form_layout_deadline_on_its_own_line_is_isolated():
    """Form/address layouts separate fields by NEWLINES, not punctuation. A submission-deadline
    gate on its own line ('Arrive no later than 12.00 noon ...') must be surfaced as its own unit,
    not swallowed into the address block — otherwise its signal dilutes below the match threshold
    (this was the SPSO g17 deterministic miss). Also pins 'arrive' as a recognised deadline verb."""
    pages = [(6, "Facilities Administrator\n4 Melville Street\nEDINBURGH\nEH3 7NS\n\n"
                 "Arrive no later than 12.00 noon 06/11/2013\n\nYour submission must be complete.")]
    texts = [c["text"] for c in scan_candidates(pages)]
    assert any("Arrive no later than 12.00 noon 06/11/2013" == t for t in texts), \
        "the deadline line must be isolated as its own candidate, not merged into the address"


def test_uncovered_gating_surfaces_what_extraction_missed():
    # extraction only caught the innocuous line -> the collusion + deadline + pass/fail gates are missed
    extracted = [{"text": "The service runs Monday to Friday."}]
    extra = uncovered_gating(extracted, PAGES)
    joined = " ".join(c["text"].lower() for c in extra)
    assert "collusive" in joined
    assert all(c["is_gating"] and c["needs_review"] and c["confidence"] <= 0.6 for c in extra)


def test_covered_disqualifier_is_not_re_added():
    extracted = [
        {"text": "Any tenderer engaged in collusive tendering shall be disqualified from the process."},
        {"text": "Tenders must be received no later than 12:00 noon on 21 March 2016; late tenders "
                 "will not be considered."},
        {"text": "Tenderers must answer 3.2.1 Previous Relevant Experience (Pass/Fail)."},
    ]
    joined = " ".join(c["text"].lower() for c in uncovered_gating(extracted, PAGES))
    assert "collusive" not in joined  # already covered -> not duplicated


def test_passfail_gate_never_suppressed_by_a_generic_covering_req():
    # museum g61-63: a distinct "3.2.x (Pass/Fail)" selection gate was masked because a
    # generic "submit the documents" req shared >=60% boilerplate tokens. A Pass/Fail gate
    # is a hard disqualifier and must surface anyway (recall-first). (G-038)
    pages = [(24, "3.2.2 Quality Standard (Pass/Fail). Describe your quality management systems.")]
    cand = scan_candidates(pages)[0]["text"]
    # a generic req that token-CONTAINS the candidate (containment 1.0 -> old rule would suppress)
    extracted = [{"text": cand + " plus additional unrelated submission paperwork details."}]
    out = uncovered_gating(extracted, pages)
    assert any("3.2.2" in c["source_excerpt"] for c in out), "Pass/Fail gate must not be suppressed"


def test_non_passfail_gate_still_suppressed_when_covered():
    # control: the coverage suppression still applies to non-pass/fail candidates.
    pages = [(1, "Any tenderer engaged in collusive tendering shall be disqualified.")]
    extracted = [{"text": "Any tenderer engaged in collusive tendering shall be disqualified "
                          "from the whole procurement process without exception."}]
    joined = " ".join(c["text"].lower() for c in uncovered_gating(extracted, pages))
    assert "collusive" not in joined


def test_no_gates_means_no_candidates():
    pages = [(1, "The service runs Monday to Friday. Staff wear uniforms. Bins are emptied daily.")]
    assert uncovered_gating([{"text": "irrelevant"}], pages) == []
