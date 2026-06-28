"use client";

import { createContext, useContext, useState } from "react";
import type {
  CapabilityDoc,
  Requirement,
} from "@/types/requirement";
import { mockTender } from "@/data/mock-requirements";

interface RequirementsContextValue {
  requirements: Requirement[];
  capabilityDocs: CapabilityDoc[];
  updateRequirement: (id: string, patch: Partial<Requirement>) => void;
  approve: (id: string) => void;
  editRequirement: (id: string, note: string) => void;
  flag: (id: string, note: string) => void;
  editAnswer: (id: string, text: string) => void;
  answerOpenQuestion: (
    reqId: string,
    questionId: string,
    answerText: string
  ) => void;
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

  // Static for now; comes from the tender response. Swap to API later alongside requirements.
  const capabilityDocs = mockTender.capability_docs ?? [];

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

  // Human revises the drafted answer — record it as human-edited and keep the
  // deprecated draft_answer alias in sync.
  function editAnswer(id: string, text: string) {
    setRequirements((prev) =>
      prev.map((req) => {
        if (req.id !== id || !req.answer) return req;
        return {
          ...req,
          draft_answer: text,
          answer: { ...req.answer, text, state: "human_edited" },
        };
      })
    );
  }

  // Human answers a gap question the tool flagged.
  function answerOpenQuestion(
    reqId: string,
    questionId: string,
    answerText: string
  ) {
    setRequirements((prev) =>
      prev.map((req) => {
        if (req.id !== reqId || !req.open_questions) return req;
        return {
          ...req,
          open_questions: req.open_questions.map((q) =>
            q.id === questionId
              ? {
                  ...q,
                  answer: answerText,
                  answered_at: new Date().toISOString(),
                }
              : q
          ),
        };
      })
    );
  }

  return (
    <RequirementsContext.Provider
      value={{
        requirements,
        capabilityDocs,
        updateRequirement,
        approve,
        editRequirement,
        flag,
        editAnswer,
        answerOpenQuestion,
      }}
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
