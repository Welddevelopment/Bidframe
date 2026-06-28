from pathlib import Path

from engine.eval import load_gold_csv

REPO_ROOT = Path(__file__).resolve().parents[2]
SPSO_GOLD = REPO_ROOT / "gold-set" / "spso-cleaning.labels.csv"


def test_loads_spso_gold_skipping_comments():
    gold = load_gold_csv(SPSO_GOLD, tender_id="spso")
    reqs = gold["requirements"]
    # 19 labelled requirements (g1..g19); comment lines ignored
    assert len(reqs) == 19
    assert gold["tender_id"] == "spso"
    assert reqs[0]["gold_id"] == "g1"


def test_is_gating_yes_no_mapped_to_bool():
    reqs = load_gold_csv(SPSO_GOLD)["requirements"]
    by_id = {r["gold_id"]: r for r in reqs}
    # g17 (deadline) and g19 (conformance gate) are the only gating ones
    gating = {r["gold_id"] for r in reqs if r["is_gating"]}
    assert gating == {"g17", "g19"}
    assert by_id["g1"]["is_gating"] is False
    assert by_id["g17"]["source_page"] == 6
