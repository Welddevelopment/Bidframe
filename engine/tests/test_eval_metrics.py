from engine.eval import score


def test_headline_metrics(eval_gold_syn, eval_output_syn):
    s = score(eval_gold_syn, eval_output_syn)
    assert s["tp"] == 3
    assert s["fn"] == 1
    assert s["fp"] == 1
    assert s["recall"] == 0.75
    assert s["precision"] == 0.75
    assert s["f1"] == 0.75


def test_gating_metrics(eval_gold_syn, eval_output_syn):
    s = score(eval_gold_syn, eval_output_syn)
    assert s["gating_accuracy"] == 0.6667   # 2 of 3 matched pairs agree on is_gating
    assert s["gating_recall"] == 0.3333     # 1 of 3 gold gating reqs caught AND flagged


def test_gating_counts_for_aggregation(eval_gold_syn, eval_output_syn):
    s = score(eval_gold_syn, eval_output_syn)
    assert s["gating_gold"] == 3        # gs-1, gs-2, gs-4 are gating
    assert s["gating_caught"] == 1      # only gs-1 caught AND flagged
    assert s["dangerous_misses"] == 1   # gs-4 (gating) unmatched entirely


def test_empty_output_does_not_crash(eval_gold_syn):
    s = score(eval_gold_syn, {"requirements": []})
    assert s["recall"] == 0.0
    assert s["precision"] == 0.0
    assert s["f1"] == 0.0
    assert s["dangerous_misses"] == 3   # all 3 gold gating reqs missed
