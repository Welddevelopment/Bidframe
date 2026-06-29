"use client";

import { useEffect, useRef } from "react";
import { useRequirements } from "@/context/RequirementsContext";
import { deriveTriage } from "@/lib/triage";
import { ComplianceMatrix } from "@/components/ComplianceMatrix";
import { GatingHero } from "@/components/GatingHero";

// The page's one animated moment (landing-page-brief §6): the real product
// resolving, not a faked graphic. The actual GatingHero and ComplianceMatrix
// render over the demo tender; the register settles once on load and the oxblood
// deal-breaker settles last and heaviest (it carries the longer delay). The card
// is inert (non-interactive, out of the tab order and the a11y tree) with a plain
// text description for screen readers, because here it is an illustration, not
// the working worklist. Reduced motion and no-JS both land on the final resolved
// state: .hr-settle only animates under prefers-reduced-motion: no-preference, so
// without motion the rows are simply already in place.

const noop = () => {};

export function HeroResolve() {
  const { requirements } = useRequirements();
  const cardRef = useRef<HTMLDivElement>(null);

  // Remove the illustration from the tab order and the a11y tree once mounted.
  useEffect(() => {
    if (cardRef.current) cardRef.current.inert = true;
  }, []);

  const triage = deriveTriage(requirements);
  // Trim to a compact register: a few rows per group, so the card reads as a
  // page, not the full worklist.
  const groups = triage.groups
    .map((g) => ({ ...g, items: g.items.slice(0, 3) }))
    .filter((g) => g.items.length > 0);

  return (
    <figure className="m-0">
      <span className="sr-only">
        A public-sector tender resolving into a checklist of requirements, with the
        disqualifying deal-breaker settled at the top.
      </span>
      <div
        ref={cardRef}
        aria-hidden="true"
        className="rounded-lg border border-hairline bg-paper-raised p-5 shadow-[0_1px_0_rgba(33,29,23,0.04),0_10px_28px_-14px_rgba(33,29,23,0.20)]"
      >
        {/* The deal-breaker callout sits on top but settles last (longer delay). */}
        <div className="hr-settle" style={{ animationDelay: "560ms" }}>
          <GatingHero />
        </div>
        {/* The register fills in first. */}
        <div className="hr-settle mt-6" style={{ animationDelay: "140ms" }}>
          <ComplianceMatrix
            groups={groups}
            selectedId={null}
            onSelect={noop}
            onApprove={noop}
            activeFilter={null}
          />
        </div>
      </div>
    </figure>
  );
}
