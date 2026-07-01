"use client";

import { useState } from "react";
import { useRequirements } from "@/context/RequirementsContext";
import { isApiEnabled } from "@/lib/api";
import { MarksView } from "./MarksView";
import { GraphView } from "./GraphView";
import { NoTenderLoaded } from "./NoTenderLoaded";

// The /graph surface. The default is the reframed ledger ("Marks & structure" —
// where the marks live + the answer-order chains), with the original bespoke
// relationship map kept one quiet toggle away for anyone who wants the wiring
// diagram. On the live product with no tender loaded, neither is shown — just the
// upload prompt.

type Tab = "marks" | "map";

export function StructureView() {
  const { tenderId } = useRequirements();
  const [tab, setTab] = useState<Tab>("marks");

  if (isApiEnabled() && !tenderId) {
    return (
      <NoTenderLoaded
        heading="Nothing to map yet"
        body="Upload a tender and Bidframe shows where the marks concentrate, where the deal-breakers sit, and what has to be answered in order."
      />
    );
  }

  return (
    <div>
      <nav
        aria-label="Graph view"
        className="mb-7 flex items-center gap-2 text-sm"
      >
        <TabButton active={tab === "marks"} onClick={() => setTab("marks")}>
          Marks &amp; structure
        </TabButton>
        <span aria-hidden className="text-hairline">
          ·
        </span>
        <TabButton active={tab === "map"} onClick={() => setTab("map")}>
          Relationship map
        </TabButton>
      </nav>

      {tab === "marks" ? <MarksView /> : <GraphView />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-sm px-1 py-0.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
        active
          ? "font-medium text-ink underline decoration-forest decoration-2 underline-offset-4"
          : "text-ink-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
