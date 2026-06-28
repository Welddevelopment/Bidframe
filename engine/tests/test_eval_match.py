from engine.eval import match_requirements


def test_three_expected_matches(eval_gold_syn, eval_output_syn):
    matches, _ug, _uo = match_requirements(eval_gold_syn, eval_output_syn)
    pairs = {(g["gold_id"], o["id"]) for g, o in matches}
    assert pairs == {("gs-1", "req-0001"), ("gs-2", "req-0002"), ("gs-3", "req-0003")}


def test_turnover_gold_is_the_only_miss(eval_gold_syn, eval_output_syn):
    _matches, unmatched_gold, _uo = match_requirements(eval_gold_syn, eval_output_syn)
    assert [g["gold_id"] for g in unmatched_gold] == ["gs-4"]


def test_english_output_is_the_only_false_positive(eval_gold_syn, eval_output_syn):
    _matches, _ug, unmatched_output = match_requirements(eval_gold_syn, eval_output_syn)
    assert [o["id"] for o in unmatched_output] == ["req-0004"]


def test_matching_is_one_to_one_and_deterministic(eval_gold_syn, eval_output_syn):
    a = match_requirements(eval_gold_syn, eval_output_syn)
    b = match_requirements(eval_gold_syn, eval_output_syn)
    pa = {(g["gold_id"], o["id"]) for g, o in a[0]}
    pb = {(g["gold_id"], o["id"]) for g, o in b[0]}
    assert pa == pb
    golds = [g["gold_id"] for g, _ in a[0]]
    outs = [o["id"] for _, o in a[0]]
    assert len(golds) == len(set(golds))   # no gold matched twice
    assert len(outs) == len(set(outs))     # no output matched twice
