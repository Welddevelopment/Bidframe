"use client";

import { useState } from "react";
import { useRequirements } from "@/context/RequirementsContext";

// The "Autofill with AI" CTA. On upload the API already drafts grounded answers with
// the free mock answerer; this re-runs the draft with the OpenAI answerer for precise,
// evidence-cited prose. Hidden on the mock default (no live tender to draft against).
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
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={run}
        disabled={drafting}
        className="inline-flex items-center gap-2 rounded-md bg-forest px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-forest-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {drafting ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper"
              aria-hidden
            />
            Drafting grounded answers&hellip;
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M10 1.5l1.6 4.3 4.3 1.6-4.3 1.6L10 13.3 8.4 9 4.1 7.4l4.3-1.6L10 1.5zM4.5 12.5l.8 2.1 2.1.8-2.1.8-.8 2.1-.8-2.1L1.6 15.4l2.1-.8.8-2.1z" />
            </svg>
            Autofill with AI
          </>
        )}
      </button>
      {failed && (
        <span className="text-xs text-signal-oxblood">
          Couldn&rsquo;t reach the autofill service. Try again.
        </span>
      )}
    </div>
  );
}
