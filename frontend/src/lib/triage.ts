import type { Requirement } from "@/types/requirement";

// The triage model: how the worklist is grouped by what each requirement needs
// from you (layout.md section 2 and 3). Pure functions, no React, so the header,
// matrix, and panel all derive the same grouping from a single source.

export type GroupKey = "needs-you" | "to-verify" | "ready";

export const GROUP_ORDER: GroupKey[] = ["needs-you", "to-verify", "ready"];

export const GROUP_LABELS: Record<GroupKey, string> = {
  "needs-you": "Needs you",
  "to-verify": "To verify",
  ready: "Ready to approve",
};

// Below this, a pending non-gating item still wants a second look before approval.
export const LOW_CONFIDENCE = 0.75;

// Which group a single requirement belongs to. Order of the checks matters:
// a needs-you item is always needs-you even if it would otherwise verify.
export function groupOf(req: Requirement): GroupKey {
  const needsInput =
    req.answer?.state === "needs_input" ||
    (req.open_questions?.some((q) => !q.answer) ?? false);
  if (needsInput) return "needs-you";

  if (
    req.status === "pending" &&
    (req.is_gating || req.needs_review || req.confidence < LOW_CONFIDENCE)
  ) {
    return "to-verify";
  }

  // Confident and non-gating but still pending, or already resolved.
  return "ready";
}

// A confident, non-gating, still-pending item: the only kind that earns the
// inline approve affordance in the resting matrix (layout.md section 4).
export function isConfidentNonGating(req: Requirement): boolean {
  return (
    !req.is_gating &&
    !req.needs_review &&
    req.confidence >= LOW_CONFIDENCE &&
    req.status === "pending"
  );
}

export interface TriageGroup {
  key: GroupKey;
  label: string;
  items: Requirement[];
}

export interface Triage {
  counts: Record<GroupKey, number>;
  groups: TriageGroup[];
}

// Split the requirements into the three groups in GROUP_ORDER, preserving source
// order within each group, plus a per-group count for the header triage line.
export function deriveTriage(reqs: Requirement[]): Triage {
  const buckets: Record<GroupKey, Requirement[]> = {
    "needs-you": [],
    "to-verify": [],
    ready: [],
  };

  for (const req of reqs) {
    buckets[groupOf(req)].push(req);
  }

  const counts: Record<GroupKey, number> = {
    "needs-you": buckets["needs-you"].length,
    "to-verify": buckets["to-verify"].length,
    ready: buckets.ready.length,
  };

  const groups: TriageGroup[] = GROUP_ORDER.map((key) => ({
    key,
    label: GROUP_LABELS[key],
    items: buckets[key],
  }));

  return { counts, groups };
}

// The item the header's Next action should route to: the highest-priority item
// still pending (layout.md section 2). Priority: gating unresolved, then
// needs-you, then low-confidence to verify, then any other pending. null when
// nothing is pending (Next becomes Export response).
export function nextPriorityId(reqs: Requirement[]): string | null {
  const pending = reqs.filter((req) => req.status === "pending");
  if (pending.length === 0) return null;

  const gating = pending.find((req) => req.is_gating);
  if (gating) return gating.id;

  const needsYou = pending.find(
    (req) =>
      req.answer?.state === "needs_input" ||
      (req.open_questions?.some((q) => !q.answer) ?? false)
  );
  if (needsYou) return needsYou.id;

  const lowConfidence = pending.find(
    (req) => req.needs_review || req.confidence < LOW_CONFIDENCE
  );
  if (lowConfidence) return lowConfidence.id;

  return pending[0].id;
}
