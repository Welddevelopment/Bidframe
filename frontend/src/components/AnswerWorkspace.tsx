"use client";

import type { Requirement } from "@/types/requirement";
import { AnswerCard } from "./AnswerCard";

// The list of answer cards, already filtered and sorted by AnswersBody. Thin by
// design: it just maps the visible requirements to cards, with an honest empty
// state that distinguishes "a filter hid everything" from "there's genuinely
// nothing here".

export function AnswerWorkspace({
  requirements,
  filtered,
}: {
  requirements: Requirement[];
  // true when a filter is active, so the empty state reads correctly.
  filtered: boolean;
}) {
  if (requirements.length === 0) {
    return (
      <div className="max-w-[64ch]">
        <p className="text-sm font-medium text-ink">
          {filtered ? "No answers match this filter." : "No answers yet."}
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          {filtered
            ? "Clear the filter to see the full response."
            : "Upload a tender and draft your answers to get started."}
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {requirements.map((req) => (
        <AnswerCard key={req.id} requirement={req} />
      ))}
    </ul>
  );
}
