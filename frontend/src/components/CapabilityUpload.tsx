"use client";

import { useRef, useState } from "react";
import { useRequirements } from "@/context/RequirementsContext";

// Two-sided traceability: drop in the bidder's own capability docs (.pdf/.txt)
// and the API re-checks every answer against them. Secondary to the draft
// action, so this reads as a quiet panel, not a co-equal hero. In the mock
// default it stays visible as an honest sample-evidence state.
export function CapabilityUpload() {
  const { tenderId, requirements, capabilityDocs, drafting, draftAnswers } =
    useRequirements();
  const inputRef = useRef<HTMLInputElement>(null);
  const [failed, setFailed] = useState(false);

  const isSampleMode = !tenderId;

  // ux-audit #22: "can't see which answers a doc backs." The link already
  // exists in the data (each answer cites the doc_id it was grounded from) —
  // just wasn't surfaced. Count per doc, client-side, no new API call.
  const backedCountByDoc = new Map<string, number>();
  for (const req of requirements) {
    for (const ref of req.answer?.evidence_refs ?? []) {
      backedCountByDoc.set(ref.doc_id, (backedCountByDoc.get(ref.doc_id) ?? 0) + 1);
    }
  }

  async function onFiles(list: FileList | null) {
    if (isSampleMode) return;
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
            {isSampleMode
              ? "Sample mode is showing example evidence docs; no uploaded files are processed here."
              : capabilityDocs.length > 0
              ? `Answers are backed by ${capabilityDocs.length} of your document${
                  capabilityDocs.length > 1 ? "s" : ""
                }.`
              : "Upload your capability docs so the draft is backed by your own evidence."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={drafting || isSampleMode}
          className="shrink-0 rounded-md border border-hairline px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-paper-raised disabled:cursor-not-allowed disabled:opacity-60"
        >
          {drafting ? "Re-checking the evidence…" : "Add evidence docs"}
        </button>
      </div>

      {capabilityDocs.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {capabilityDocs.map((doc) => {
            const backed = backedCountByDoc.get(doc.doc_id) ?? 0;
            return (
              <li
                key={doc.doc_id}
                className="rounded-md bg-paper-raised px-2 py-1 font-mono text-xs text-ink-muted ring-1 ring-inset ring-hairline"
                title={
                  backed > 0
                    ? `Cited in ${backed} answer${backed === 1 ? "" : "s"}`
                    : "Not cited in any answer yet"
                }
              >
                {doc.filename}
                {doc.page_count > 0 && (
                  <span className="ml-1 text-ink-muted/75">
                    ({doc.page_count}p)
                  </span>
                )}
                <span
                  className={`ml-1 ${
                    backed > 0 ? "text-forest" : "text-ink-muted/75"
                  }`}
                >
                  {backed > 0
                    ? `· backs ${backed}`
                    : "· not cited yet"}
                </span>
                {isSampleMode && (
                  <span className="ml-1 text-ink-muted/75">sample</span>
                )}
              </li>
            );
          })}
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
