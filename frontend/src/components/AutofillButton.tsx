"use client";

import { useState } from "react";
import { useRequirements } from "@/context/RequirementsContext";

// The primary action for the answers surface. On upload the API already drafts
// answers from your documents with the free mock answerer; this re-runs the
// draft with the OpenAI answerer for precise, evidence-cited prose. In the mock
// default, keep the action visible but honest: the sample already includes
// drafted answers and no user documents are being processed.
export function AutofillButton() {
  const { tenderId, drafting, draftAnswers } = useRequirements();
  const [failed, setFailed] = useState(false);

  const isSampleMode = !tenderId;

  async function run() {
    if (isSampleMode) return;
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
        disabled={drafting || isSampleMode}
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
      {isSampleMode && (
        <span className="max-w-[64ch] text-xs text-ink-muted">
          Sample mode: the example answers below are pre-drafted from the sample
          evidence docs. Connect a live tender to draft from your own documents.
        </span>
      )}
      {failed && (
        <span className="text-xs text-signal-oxblood">
          Couldn&rsquo;t reach the server. Try again.
        </span>
      )}
    </div>
  );
}
