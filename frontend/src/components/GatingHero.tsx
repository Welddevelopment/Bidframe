"use client";

import { useRequirements } from "@/context/RequirementsContext";
import { alsoCitedLabel, collapseDuplicates } from "@/lib/dedupe";

// The deal-breaker callout (layout.md sections 3, 7; design-language). A lifted,
// grainy sheet with a deep oxblood-frame reading edge and bright oxblood alarm
// dots: the stakes are carried entirely by the status system (the frame edge and
// the fill dots), never by a coloured slab on chrome. Depth means focus, so this
// is the one element that lifts above the matrix. Conditional on gating items.
//
// The recall-first extractor emits the same disqualifier several times (the SPSO
// 06/11/2013 deadline alone appears on multiple rows). We collapse near-duplicates
// for display via collapseDuplicates so the hero shows the TRUE unique
// deal-breakers and an honest count — nothing is dropped, each surviving row notes
// the other pages the same requirement was cited on. See lib/dedupe.ts.

export function GatingHero({ onSelect }: { onSelect?: (id: string) => void }) {
  const { requirements } = useRequirements();
  const { representatives: gating, meta } = collapseDuplicates(
    requirements.filter((r) => r.is_gating)
  );

  if (gating.length === 0) {
    return null;
  }

  return (
    <section className="surface-grain mb-8 rounded-r-lg border-y border-r border-hairline border-l-[3px] border-l-signal-oxblood-frame bg-paper-raised p-5 shadow-[var(--depth-sheet)]">
      <p className="font-mono text-xs font-medium uppercase tracking-wide text-signal-oxblood">
        Deal-breaker{gating.length !== 1 ? "s" : ""}
      </p>
      <h2 className="mt-2 font-serif text-lg font-semibold leading-snug text-ink">
        {gating.length} requirement{gating.length !== 1 ? "s" : ""} that would
        disqualify the bid if missed
      </h2>

      <ul className="mt-4 flex flex-col gap-2.5">
        {gating.map((req) => {
          const alsoOn = alsoCitedLabel(meta.get(req.id)?.alsoCitedOn ?? []);
          return (
            <li
              key={req.id}
              className="grid grid-cols-[auto_1fr] items-start gap-x-2.5 text-sm text-ink"
            >
              <span
                className="mt-[5px] h-[11px] w-[11px] shrink-0 rounded-full bg-signal-oxblood shadow-[0_0_0_1px_rgba(33,29,23,0.5),inset_0_1px_1px_rgba(255,255,255,0.3),0_1px_2px_rgba(33,29,23,0.3)]"
                aria-hidden
              />
              <button
                type="button"
                onClick={() => onSelect?.(req.id)}
                className={`text-left leading-snug ${
                  onSelect
                    ? "transition-colors hover:text-forest hover:underline"
                    : ""
                }`}
              >
                {req.text}
                <span className="ml-2 font-mono text-xs text-ink-muted">
                  p.{req.source_page}
                  {req.source_clause ? ` · ${req.source_clause}` : ""}
                  {alsoOn ? ` · ${alsoOn}` : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* The track record, in the mono record voice. A measured benchmark, not a
          claim about the tender on screen: it backs the catch above. The numbers
          are the locked, honest ones (demo-narrative.md): gating recall 1.0 and
          the needs_review honesty, said the way the demo says them. */}
      <p className="mt-5 border-t border-hairline pt-3 font-mono text-xs leading-relaxed text-ink-muted">
        Measured on a real public-sector tender, Bidframe caught every
        deal-breaker and flagged the rest for you.
      </p>
    </section>
  );
}
