"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRequirements } from "@/context/RequirementsContext";
import { deriveTriage } from "@/lib/triage";
import { ComplianceMatrix } from "@/components/ComplianceMatrix";
import { GatingHero } from "@/components/GatingHero";

// The hero showpiece (landing-page-brief §6): the real product resolving, not a
// faked graphic, presented as a tilted sheet filed into the register (the
// supabase-style product tilt, on our warm paper). The actual GatingHero and
// ComplianceMatrix render over the demo tender; the register settles on load and
// the oxblood deal-breaker settles last and heaviest.
//
// The card is inert (non-interactive, out of the tab order and the a11y tree)
// with a plain text description for screen readers, because here it is an
// illustration, not the working worklist. Reduced motion and no-JS both land on
// the composed resting tilt.

const noop = () => {};

export function HeroResolve() {
  const { requirements } = useRequirements();
  const cardRef = useRef<HTMLDivElement>(null);

  // Remove the illustration from the tab order and the a11y tree once mounted.
  useEffect(() => {
    if (cardRef.current) cardRef.current.inert = true;
  }, []);

  const triage = deriveTriage(requirements);
  // Trim to a compact register: a few rows per group, so the sheet reads as a
  // page, not the full worklist.
  const groups = triage.groups
    .map((g) => ({ ...g, items: g.items.slice(0, 3) }))
    .filter((g) => g.items.length > 0);

  return (
    <figure className="hero-stage relative m-0">
      <span className="sr-only">
        A public-sector tender resolving into a checklist of requirements, with
        the disqualifying deal-breaker settled at the top.
      </span>
      {/* The whole product shot is an obvious one-click entry into the worked
          example on the mock tender, so outreach traffic with no PDF of their own
          can feel the product in seconds. The inner sheet stays inert and
          aria-hidden (an illustration); the Link carries the accessible name. */}
      <Link
        href="/demo"
        aria-label="Open the worked example on the demo tender"
        className="hero-product-halo relative isolate block [perspective:1600px] rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-4 focus-visible:ring-offset-paper"
      >
        <div
          ref={cardRef}
          aria-hidden="true"
          className="hero-sheet surface-grain relative mx-auto max-w-[1100px] overflow-hidden rounded-xl border border-forest/55 bg-paper-raised p-5 shadow-[var(--depth-hero-sheet)] sm:p-7 lg:p-8"
        >
          <span aria-hidden="true" className="hero-resolve-scan" />
          {/* The deal-breaker callout sits on top but settles last (longer delay). */}
          <div className="hr-settle" style={{ animationDelay: "560ms" }}>
            <GatingHero />
          </div>
          {/* The register fills in first. It now composes to the available width
              on phones, with the row status dropping under the requirement
              text instead of relying on a cropped fixed-width sheet. */}
          <div className="hr-settle mt-6" style={{ animationDelay: "140ms" }}>
            <div className="hero-matrix">
              <ComplianceMatrix
                groups={groups}
                selectedId={null}
                onSelect={noop}
                onApprove={noop}
                activeFilter={null}
                density="compact"
              />
            </div>
          </div>
        </div>
      </Link>
    </figure>
  );
}
