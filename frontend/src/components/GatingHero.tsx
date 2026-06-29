"use client";

import { useRequirements } from "@/context/RequirementsContext";

// The deal-breaker callout (layout.md sections 3, 7; design-language). A lifted,
// grainy sheet with a 2px oxblood reading edge and glossy oxblood dots: the
// stakes are carried entirely by the status system (the oxblood edge and dots),
// never by a coloured slab on chrome. Depth means focus, so this is the one
// element that lifts above the matrix. Conditional on gating items existing.

export function GatingHero() {
  const { requirements } = useRequirements();
  const gating = requirements.filter((r) => r.is_gating);

  if (gating.length === 0) {
    return null;
  }

  return (
    <section className="surface-grain mb-8 rounded-r-lg border-y border-r border-hairline border-l-2 border-l-signal-oxblood bg-paper-raised p-5 shadow-[var(--depth-sheet)]">
      <p className="font-mono text-xs font-medium uppercase tracking-wide text-signal-oxblood">
        Deal-breaker{gating.length !== 1 ? "s" : ""}
      </p>
      <h2 className="mt-2 font-serif text-lg font-semibold leading-snug text-ink">
        {gating.length} requirement{gating.length !== 1 ? "s" : ""} that would
        disqualify the bid if missed
      </h2>

      <ul className="mt-4 flex flex-col gap-2.5">
        {gating.map((req) => (
          <li
            key={req.id}
            className="grid grid-cols-[auto_1fr] items-start gap-x-2.5 text-sm text-ink"
          >
            <span
              className="mt-[5px] h-2.5 w-2.5 shrink-0 rounded-full bg-signal-oxblood shadow-[0_0_0_1px_rgba(33,29,23,0.35),inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_2px_rgba(33,29,23,0.3)]"
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
