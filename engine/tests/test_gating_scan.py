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


def test_no_gates_means_no_candidates():
    pages = [(1, "The service runs Monday to Friday. Staff wear uniforms. Bins are emptied daily.")]
    assert uncovered_gating([{"text": "irrelevant"}], pages) == []
