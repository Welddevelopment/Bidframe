"""usage_log.py — cheap OpenAI spend visibility (J-055).

We have no access to the billing dashboard for the shared key, so this is the only way
to see tokens/$ per call while staying under a couple of dollars. One log line per call
plus a running process-lifetime total. USD/1M-token prices are approximate list prices;
update PRICES if the model roster changes.
"""
from __future__ import annotations

# USD per 1M tokens: (prompt, completion). Extend as new models get used.
PRICES = {
    "gpt-4o": (2.50, 10.00),
    "gpt-4o-mini": (0.15, 0.60),
}

_running_total_usd = 0.0


def log_usage(resp, model: str, label: str) -> None:
    """Log tokens + estimated $ for one OpenAI chat.completions response."""
    global _running_total_usd
    usage = getattr(resp, "usage", None)
    if usage is None:
        return
    prompt_price, completion_price = PRICES.get(model, (0.0, 0.0))
    cost = (usage.prompt_tokens / 1_000_000 * prompt_price) + (
        usage.completion_tokens / 1_000_000 * completion_price
    )
    _running_total_usd += cost
    print(
        f"[usage] {label} model={model} prompt={usage.prompt_tokens} "
        f"completion={usage.completion_tokens} total={usage.total_tokens} "
        f"cost=${cost:.4f} running_total=${_running_total_usd:.4f}"
    )
