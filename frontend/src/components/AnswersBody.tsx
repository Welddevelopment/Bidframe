"use client";

import { useMemo, useState } from "react";
import { useRequirements } from "@/context/RequirementsContext";
import { isApiEnabled } from "@/lib/api";
import {
  compareWeakestFirst,
  deriveReadiness,
  matchesFilters,
  type AnswerFilterKey,
} from "@/lib/answers";
import { AutofillButton } from "./AutofillButton";
import { CapabilityUpload } from "./CapabilityUpload";
import { AnswerFilterBar } from "./AnswerFilterBar";
import { AnswerWorkspace } from "./AnswerWorkspace";
import { ReadinessLedger } from "./ReadinessLedger";
import { NoTenderLoaded } from "./NoTenderLoaded";

// The answers response workspace. Live product with no tender loaded shows the
// onboarding empty state; otherwise: draft action + evidence upload, then the
// readiness ledger, the answer-centric filter/sort bar, and the answer cards
// (drafted prose + evidence receipts + inline gaps). The mock showcase build
// runs the same surface on the seeded sample.
export function AnswersBody() {
  const { requirements, capabilityDocs, tenderId, title } = useRequirements();
  const [active, setActive] = useState<Set<AnswerFilterKey>>(new Set());
  const [weakestFirst, setWeakestFirst] = useState(true);

  // The complete response, in the order the user is viewing it. Export and the
  // filter counts read this full list; the workspace shows the filtered slice.
  const sorted = useMemo(() => {
    if (!weakestFirst) return requirements; // document (source) order
    return [...requirements].sort(compareWeakestFirst);
  }, [requirements, weakestFirst]);

  const visible = useMemo(
    () =>
      active.size === 0
        ? sorted
        : sorted.filter((req) => matchesFilters(req, active)),
    [sorted, active]
  );

  const counts = useMemo(() => deriveReadiness(requirements), [requirements]);

  if (isApiEnabled() && !tenderId) {
    return (
      <NoTenderLoaded
        heading="No answers to draft yet"
        body="Upload a tender first. Bidframe drafts each answer from your own documents and lists the gaps it needs you to fill."
      />
    );
  }

  function toggleFilter(key: AnswerFilterKey) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function selectFilter(key: AnswerFilterKey | null) {
    setActive(key ? new Set([key]) : new Set());
  }

  return (
    <>
      <p className="max-w-[64ch] text-sm text-ink-muted">
        Your response, built from your own documents — read each drafted answer
        with its evidence, and fill the gaps we still need from you.
      </p>

      {/* The draft action is the single primary action; capability upload sits
          beneath it as a quiet secondary panel. Both are workspace controls,
          not part of the printed response. */}
      <div className="no-print mt-6 flex flex-col gap-4">
        <AutofillButton />
        <CapabilityUpload />
      </div>

      <div className="mt-8">
        <ReadinessLedger counts={counts} onSelect={selectFilter} />
      </div>

      <div className="mt-4">
        <AnswerFilterBar
          requirements={sorted}
          capabilityDocs={capabilityDocs}
          tenderTitle={title}
          active={active}
          onToggle={toggleFilter}
          weakestFirst={weakestFirst}
          onToggleSort={setWeakestFirst}
        />
      </div>

      <div className="mt-6">
        <AnswerWorkspace requirements={visible} filtered={active.size > 0} />
      </div>
    </>
  );
}
