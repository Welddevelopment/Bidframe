"use client";

import { useRequirements } from "@/context/RequirementsContext";

// #22 (visibility half): the capability documents backing the drafted answers,
// each showing how many answers it supports — so the evidence reads as managed
// and transparent, not a black box. Rendered inside the CapabilityUpload panel,
// and the ONLY place the per-doc counts live (the upload chips used to
// duplicate this maths). Works on the mock sample and on a live tender.
export function EvidenceLibrary() {
  const { capabilityDocs, requirements } = useRequirements();
  if (capabilityDocs.length === 0) return null;

  // How many answers each document backs (an answer counts a doc once, even if it
  // cites it on several pages).
  const usage = new Map<string, number>();
  for (const req of requirements) {
    const refs = req.answer?.evidence_refs ?? [];
    for (const docId of new Set(refs.map((e) => e.doc_id))) {
      usage.set(docId, (usage.get(docId) ?? 0) + 1);
    }
  }

  return (
    <ul className="mt-3 flex flex-col gap-1.5 border-t border-hairline pt-3">
      {capabilityDocs.map((doc) => {
        const n = usage.get(doc.doc_id) ?? 0;
        return (
          <li
            key={doc.doc_id}
            className="flex items-baseline justify-between gap-3 text-sm"
          >
            <span className="min-w-0 truncate font-mono text-xs text-accent">
              {doc.filename}
              {doc.page_count > 0 && (
                <span className="ml-1 text-ink-muted/75">
                  ({doc.page_count}p)
                </span>
              )}
            </span>
            <span className="shrink-0 font-mono text-xs text-ink-muted">
              {n > 0
                ? `backs ${n} answer${n === 1 ? "" : "s"}`
                : "not yet cited"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
