"use client";

import { createContext, useContext, useState } from "react";
import type { Requirement } from "@/types/requirement";
import { mockTender } from "@/data/mock-requirements";

interface RequirementsContextValue {
  requirements: Requirement[];
  updateRequirement: (id: string, patch: Partial<Requirement>) => void;
  approve: (id: string) => void;
  editRequirement: (id: string, note: string) => void;
  flag: (id: string, note: string) => void;
}

const RequirementsContext = createContext<RequirementsContextValue | null>(null);

export function RequirementsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [requirements, setRequirements] = useState<Requirement[]>(
    () => mockTender.requirements
  );

  function updateRequirement(id: string, patch: Partial<Requirement>) {
    setRequirements((prev) =>
      prev.map((req) => (req.id === id ? { ...req, ...patch } : req))
    );
  }

  function approve(id: string) {
    updateRequirement(id, {
      status: "accepted",
      decision: {
        action: "approve",
        note: "",
        timestamp: new Date().toISOString(),
      },
    });
  }

  function editRequirement(id: string, note: string) {
    updateRequirement(id, {
      status: "edited",
      decision: {
        action: "edit",
        note,
        timestamp: new Date().toISOString(),
      },
    });
  }

  function flag(id: string, note: string) {
    updateRequirement(id, {
      status: "flagged",
      decision: {
        action: "flag",
        note,
        timestamp: new Date().toISOString(),
      },
    });
  }

  return (
    <RequirementsContext.Provider
      value={{ requirements, updateRequirement, approve, editRequirement, flag }}
    >
      {children}
    </RequirementsContext.Provider>
  );
}

export function useRequirements(): RequirementsContextValue {
  const context = useContext(RequirementsContext);
  if (context === null) {
    throw new Error(
      "useRequirements must be used within a RequirementsProvider"
    );
  }
  return context;
}
