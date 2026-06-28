from engine.eval import format_report


def test_report_has_headline_metrics(eval_gold_syn, eval_output_syn):
    r = format_report(eval_gold_syn, eval_output_syn)
    assert r["recall"] == 0.75
    assert r["precision"] == 0.75
    assert r["gating_recall"] == 0.3333


def test_report_lists_the_dangerous_miss(eval_gold_syn, eval_output_syn):
    r = format_report(eval_gold_syn, eval_output_syn)
    assert [m["gold_id"] for m in r["misses"]] == ["gs-4"]
    miss = r["misses"][0]
    assert miss["is_gating"] is True
    assert miss["dangerous"] is True       # a missed GATING requirement is dangerous


def test_report_lists_the_false_positive(eval_gold_syn, eval_output_syn):
    r = format_report(eval_gold_syn, eval_output_syn)
    assert [fp["id"] for fp in r["false_positives"]] == ["req-0004"]
