"use client";

import { useRef, useState } from "react";
import { useRequirements } from "@/context/RequirementsContext";

// Two-sided traceability: drop in the bidder's own capability docs (.pdf/.txt)
// and the API re-checks every answer against them. Secondary to the draft
// action, so this reads as a quiet panel, not a co-equal hero. Hidden on the
// mock default (no live tender).
export function CapabilityUpload() {
  const { tenderId, capabilityDocs, drafting, draftAnswers } = useRequirements();
  const inputRef = useRef<HTMLInputElement>(null);
  const [failed, setFailed] = useState(false);

  if (!tenderId) return null;

  async function onFiles(list: FileList | null) {
    const files = list ? Array.from(list) : [];
    if (files.length === 0) return;
    setFailed(false);
    try {
      await draftAnswers("openai", files);
    } catch {
      setFailed(true);
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-lg border border-hairline p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">Capability evidence</p>
          <p className="mt-0.5 max-w-[64ch] text-xs text-ink-muted">
            {capabilityDocs.length > 0
              ? `Answers are backed by ${capabilityDocs.length} of your document${
                  capabilityDocs.length > 1 ? "s" : ""
                }.`
              : "Upload your capability docs so the draft is backed by your own evidence."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={drafting}
          className="shrink-0 rounded-md border border-hairline px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-paper-raised disabled:cursor-not-allowed disabled:opacity-60"
        >
          {drafting ? "Re-checking the evidence…" : "Add evidence docs"}
        </button>
      </div>

      {capabilityDocs.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {capabilityDocs.map((doc) => (
            <li
              key={doc.doc_id}
              className="rounded-md bg-paper-raised px-2 py-0.5 font-mono text-xs text-ink-muted ring-1 ring-inset ring-hairline"
            >
              {doc.filename}
            </li>
          ))}
        </ul>
      )}

      {failed && (
        <p className="mt-2 text-xs text-signal-oxblood">
          Couldn&rsquo;t upload those docs. Try again.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,application/pdf,text/plain"
        multiple
        className="hidden"
        onChange={(event) => onFiles(event.target.files)}
      />
    </div>
  );
}
