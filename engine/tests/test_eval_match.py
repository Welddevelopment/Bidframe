from engine._io import read_json
from engine.eval import match_requirements

GOLD = read_json("engine/tests/fixtures/eval_gold_syn.json")
OUTPUT = read_json("engine/tests/fixtures/eval_output_syn.json")


def _pairs(matches):
    return [(g["gold_id"], o["id"]) for g, o in matches]


def test_match_requirements_finds_three_expected_pairs():
    matches, _, _ = match_requirements(GOLD, OUTPUT)
    assert _pairs(matches) == [
        ("gs-1", "req-0001"),
        ("gs-2", "req-0002"),
        ("gs-3", "req-0003"),
    ]


def test_match_requirements_leaves_turnover_unmatched_gold():
    _, unmatched_gold, _ = match_requirements(GOLD, OUTPUT)
    assert [g["gold_id"] for g in unmatched_gold] == ["gs-4"]


def test_match_requirements_leaves_english_false_positive_unmatched_output():
    _, _, unmatched_output = match_requirements(GOLD, OUTPUT)
    assert [o["id"] for o in unmatched_output] == ["req-0004"]


def test_match_requirements_is_deterministic():
    first = match_requirements(GOLD, OUTPUT)
    second = match_requirements(GOLD, OUTPUT)
    assert first == second
