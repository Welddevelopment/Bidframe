import type { Requirement } from "@/types/requirement";
import { sourceDocUrl } from "@/lib/api";

// Where a requirement's source PDF lives, shared by every surface that shows the
// document (the panel's verify overlay and the persistent evidence pane). One
// derivation so the two can never disagree: a live tender streams from the
// backend, the demo falls back to a static /public copy, and the plain mock has
// none (null — callers show the excerpt or a placeholder instead).

export function requirementPdfUrl(
  tenderId: string | null,
  req: Requirement
): string | null {
  return sourceDocUrl({
    tenderId,
    docId: req.source_doc_id ?? null,
    filename: req.source_filename ?? null,
  });
}

// The quiet mono reference for a requirement's source location:
// "p.14 · Section 4.2.1", or just "p.14" when no clause was recorded.
export function sourceRefLabel(req: Requirement): string {
  return req.source_clause
    ? `p.${req.source_page} · ${req.source_clause}`
    : `p.${req.source_page}`;
}
