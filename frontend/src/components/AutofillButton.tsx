"use client";

import { useState } from "react";
import { useRequirements } from "@/context/RequirementsContext";

// The primary action for the answers surface. On upload the API already drafts
// answers from your documents with the free mock answerer; this re-runs the
// draft with the OpenAI answerer for precise, evidence-cited prose. Hidden on
// the mock default (no live tender to draft against).
export function AutofillButton() {
  const { tenderId, drafting, draftAnswers } = useRequirements();
  const [failed, setFailed] = useState(false);

  if (!tenderId) return null;

  async function run() {
    setFailed(false);
    try {
      await draftAnswers("openai");
    } catch {
      setFailed(true);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={run}
        disabled={drafting}
        className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-forest-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {drafting ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper"
              aria-hidden
            />
            Drafting answers from your documents&hellip;
          </>
        ) : (
          "Draft my answers"
        )}
      </button>
      {failed && (
        <span className="text-xs text-signal-oxblood">
          Couldn&rsquo;t reach the server. Try again.
        </span>
      )}
    </div>
  );
}
