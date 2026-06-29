from engine.scripts.eval_all import aggregate


def test_aggregate_micro_average():
    rows = [
        {"tp": 3, "fn": 1, "fp": 1, "gating_gold": 3, "gating_caught": 1, "dangerous_misses": 1, "recall": 0.75},
        {"tp": 5, "fn": 0, "fp": 0, "gating_gold": 2, "gating_caught": 2, "dangerous_misses": 0, "recall": 1.0},
    ]
    a = aggregate(rows)
    assert a["tenders"] == 2
    assert a["recall"] == round(8 / 9, 4)          # (3+5) / (8+1)
    assert a["precision"] == round(8 / 9, 4)        # (3+5) / (8+1)
    assert a["gating_recall"] == round(3 / 5, 4)    # (1+2) / (3+2)
    assert a["gating_caught"] == 3 and a["gating_gold"] == 5
    assert a["dangerous_misses"] == 1
    assert a["macro_recall"] == round((0.75 + 1.0) / 2, 4)


def test_aggregate_empty():
    a = aggregate([])
    assert a["tenders"] == 0
    assert a["recall"] == 0.0
    assert a["dangerous_misses"] == 0
