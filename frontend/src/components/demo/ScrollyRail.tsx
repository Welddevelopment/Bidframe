"use client";

import { STEPS } from "./steps";

// Progress register for the pinned scroll story: a real <nav> (not decoration),
// one entry per narrative beat, active entry tracking the IntersectionObserver
// in DemoScrolly. Clicking scrolls the matching [data-step] section into the
// centre of the viewport — which is exactly the observer's trigger band, so the
// active state updates through the existing observer with no new state here.
//
// This rail is enhanced-path only, deliberately absent from the stacked
// fallback: in the stacked layout every step is fully visible in normal flow,
// so a progress register would duplicate the document outline and add a second
// (sticky) navigation to viewports that never pin anything. The narrative copy
// remains the a11y source of truth in both paths.

export function ScrollyRail({ active }: { active: number }) {
  return (
    <nav aria-label="Story progress">
      <ol className="flex flex-col gap-4 border-l border-hairline pl-4">
        {STEPS.map((step, i) => {
          const current = i === active;
          return (
            <li key={step.id}>
              <button
                type="button"
                aria-current={current ? "step" : undefined}
                onClick={() => {
                  document
                    .querySelector(`[data-step="${i}"]`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className={`flex items-baseline gap-2 text-left font-mono text-[11px] uppercase tracking-wide transition-colors duration-300 ${
                  current
                    ? "text-forest"
                    : "text-ink-muted/60 hover:text-ink-muted"
                }`}
              >
                <span className="tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step.kicker}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
