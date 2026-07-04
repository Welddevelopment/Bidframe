import type { Requirement } from "@/types/requirement";
import { sourceDocUrl } from "@/lib/api";

export type SourceDocumentKind = "pdf" | "word" | "excel" | "csv" | "document";

function sourceExtension(filename: string | null | undefined): string | null {
  if (!filename) return null;
  const dot = filename.toLowerCase().lastIndexOf(".");
  return dot === -1 ? null : filename.toLowerCase().slice(dot);
}

export function sourceDocumentKind(req: Requirement): SourceDocumentKind {
  const ext = sourceExtension(req.source_filename);
  if (!ext) return "pdf";
  if (ext === ".pdf") return "pdf";
  if (ext === ".docx") return "word";
  if (ext === ".xlsx") return "excel";
  if (ext === ".csv") return "csv";
  return "document";
}

export function sourceKindLabel(req: Requirement): string {
  switch (sourceDocumentKind(req)) {
    case "pdf":
      return "PDF";
    case "word":
      return "Word";
    case "excel":
      return "Excel";
    case "csv":
      return "CSV";
    case "document":
      return "Document";
  }
}

export function hasPdfSource(req: Requirement): boolean {
  return sourceDocumentKind(req) === "pdf";
}

// Where a requirement's source PDF lives, shared by every surface that shows the
// document (the panel's verify overlay and the persistent evidence pane). One
// derivation so the two can never disagree: a live tender streams from the
// backend, the demo falls back to a static /public copy, and the plain mock has
// none (null — callers show the excerpt or a placeholder instead).

export function requirementPdfUrl(
  tenderId: string | null,
  req: Requirement
): string | null {
  if (!hasPdfSource(req)) return null;
  return sourceDocUrl({
    tenderId,
    docId: req.source_doc_id ?? null,
    filename: req.source_filename ?? null,
  });
}

// The quiet mono reference for a requirement's source location. PDF sources keep
// page wording; Word/Excel/CSV sources use the backend's locator string without
// pretending there is a PDF page to open.
export function sourceRefLabel(req: Requirement): string {
  const kind = sourceKindLabel(req);
  if (hasPdfSource(req)) {
    return req.source_clause
      ? `${kind} p.${req.source_page} · ${req.source_clause}`
      : `${kind} p.${req.source_page}`;
  }
  return req.source_clause ? `${kind} · ${req.source_clause}` : kind;
}

export function sourceLocatorLabel(req: Requirement): string {
  if (hasPdfSource(req)) {
    return req.source_clause
      ? `p.${req.source_page}, ${req.source_clause}`
      : `p.${req.source_page}`;
  }
  return req.source_clause ?? sourceKindLabel(req);
}
