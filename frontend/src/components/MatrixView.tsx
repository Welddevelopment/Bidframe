"use client";

import { useState } from "react";
import { useRequirements } from "@/context/RequirementsContext";
import { ComplianceMatrix } from "./ComplianceMatrix";
import { GatingHero } from "./GatingHero";
import { RequirementDrawer } from "./RequirementDrawer";

export function MatrixView() {
  const { requirements } = useRequirements();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = requirements.find((r) => r.id === selectedId) ?? null;

  return (
    <>
      <GatingHero />
      <ComplianceMatrix
        requirements={requirements}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <RequirementDrawer
        requirement={selected}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}
