"use client";

import { useRequirements } from "@/context/RequirementsContext";

// A flat, honest callout above the grouped matrix (layout.md section 3, 7). No
// card, no solid oxblood slab, no shadow: the stakes are carried by weight and
// the oxblood dot, not a coloured block. Conditional on gating items existing.

export function GatingHero() {
  const { requirements } = useRequirements();
  const gating = requirements.filter((r) => r.is_gating);

  if (gating.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 border-b border-hairline pb-5">
      <h2 className="font-serif text-lg font-semibold leading-snug text-ink">
        {gating.length} deal-breaker{gating.length !== 1 ? "s" : ""}. Miss any
        one and the bid is disqualified
      </h2>

      <ul className="mt-3 flex flex-col gap-1.5">
        {gating.map((req) => (
          <li
            key={req.id}
            className="grid grid-cols-[auto_1fr] items-baseline gap-x-2.5 text-sm text-ink"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 self-start rounded-full bg-signal-oxblood"
              aria-hidden
            />
            <span className="leading-snug">
              {req.text}
              <span className="ml-2 font-mono text-xs text-ink-muted">
                p.{req.source_page}
                {req.source_clause ? ` · ${req.source_clause}` : ""}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
