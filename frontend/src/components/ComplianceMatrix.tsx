import { useState } from "react";
import type { Requirement, RequirementStatus } from "@/types/requirement";
import {
  isConfidentNonGating,
  type GroupKey,
  type TriageGroup,
} from "@/lib/triage";
import { alsoCitedLabel, collapseDuplicates } from "@/lib/dedupe";
import { ConfidenceIndicator } from "./ConfidenceIndicator";

// The resting matrix: a contents page, not a table (layout.md sections 3, 4, 7).
// Each requirement is one line on a shared grid [ref | dot | text | status],
// grouped by the ask. Hierarchy comes from type and space, not boxes: no card
// wrapper, no per-row borders, peers separated by whitespace and a hover
// background. The status system carries the colour and the depth: the confidence
// bead, the gating oxblood reading edge, the forest approve tick, and depth that
// lifts only the open row. Interactivity scales with stakes: confident non-gating
// rows expose a single quiet Approve on hover or focus; everything riskier only
// opens the panel.

// The status word (copywriting.md decision-status lexicon), quiet and
// right-aligned. Approval also carries a forest tick, so it never relies on
// colour alone (the greyscale test).
const STATUS_WORD: Record<RequirementStatus, string> = {
  pending: "Needs your eye",
  accepted: "Approved by you",
  edited: "Edited",
  flagged: "Flagged",
};

function StatusWord({ status }: { status: RequirementStatus }) {
  const tone =
    status === "accepted"
      ? "text-forest"
      : status === "flagged"
        ? "text-ink"
        : "text-ink-muted";

  return (
    <span className={`inline-flex items-center gap-1 text-xs ${tone}`}>
      {status === "accepted" && (
        <svg
          width="11"
          height="11"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2.5 7.5l3 3 6-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {STATUS_WORD[status]}
    </span>
  );
}

function MatrixRow({
  req,
  isSelected,
  alsoCitedOn,
  onSelect,
  onApprove,
}: {
  req: Requirement;
  isSelected: boolean;
  // Pages the same requirement was also cited on (display-dedupe annotation).
  alsoCitedOn: number[];
  onSelect: (id: string) => void;
  onApprove: (id: string) => void;
}) {
  const canApproveInline = isConfidentNonGating(req);
  const preview = req.answer?.text ?? req.draft_answer ?? null;
  const alsoOn = alsoCitedLabel(alsoCitedOn);

  // A gating item with no resolved decision is the unanswerable oxblood case.
  const unanswerable = req.is_gating && req.status === "pending";

  // The register: each row carries its real clause ref down a quiet mono margin
  // (design-language). Fall back to the page when there is no clause.
  const ref =
    req.source_clause?.replace(/^section\s+/i, "") ?? `p.${req.source_page}`;

  // Gating rows take a 2px oxblood reading edge; depth lifts only the open row.
  const shape = req.is_gating
    ? "rounded-r-md border-l-2 border-signal-oxblood"
    : "rounded-md";
  const state = isSelected
    ? "bg-paper-raised shadow-[var(--depth-row)] ring-1 ring-inset ring-ink/30"
    : "hover:bg-paper-raised";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => onSelect(req.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(req.id);
        }
      }}
      className={`group grid w-full cursor-pointer grid-cols-[40px_28px_1fr_auto] items-start gap-x-3 px-2.5 py-2 text-left transition-[background-color,box-shadow] focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ink/40 ${shape} ${state}`}
    >
      {/* The register margin: the clause ref, right-aligned in mono. */}
      <span className="pt-1 text-right font-mono text-[11px] leading-tight text-ink-muted/75">
        {ref}
      </span>

      {/* The confidence bead, on the reading edge. */}
      <span className="flex justify-center pt-0.5">
        <ConfidenceIndicator
          confidence={req.confidence}
          needsReview={req.needs_review}
          unanswerable={unanswerable}
          variant="dot"
        />
      </span>

      {/* One line of requirement text. The drafted-answer preview and the
          low-confidence note are revealed only on hover or keyboard focus. */}
      <div className="min-w-0 pt-0.5">
        <p
          className={`truncate leading-snug ${
            req.is_gating ? "font-medium text-ink" : "text-ink"
          }`}
        >
          {req.text}
        </p>

        {alsoOn && (
          <p className="mt-0.5 font-mono text-[11px] text-ink-muted/75">
            {alsoOn}
          </p>
        )}

        {req.needs_review && (
          <p className="mt-0.5 hidden text-sm text-ink-muted group-hover:block group-focus-visible:block">
            Low confidence. Check this one yourself.
          </p>
        )}

        {preview && (
          <p className="mt-0.5 hidden truncate text-sm text-ink-muted group-hover:block group-focus-visible:block">
            {preview}
          </p>
        )}
      </div>

      {/* The status word, or for confident non-gating items a single quiet
          Approve revealed on hover or focus. One affordance only. */}
      <div className="flex shrink-0 items-start justify-end pt-0.5">
        {canApproveInline ? (
          <>
            <span className="group-hover:hidden group-focus-within:hidden">
              <StatusWord status={req.status} />
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onApprove(req.id);
              }}
              className="hidden text-xs font-medium text-forest transition-colors hover:text-forest-hover hover:underline focus:outline-none focus-visible:underline group-hover:inline group-focus-within:inline"
            >
              Approve
            </button>
          </>
        ) : (
          <StatusWord status={req.status} />
        )}
      </div>
    </div>
  );
}

function MatrixGroup({
  group,
  selectedId,
  onSelect,
  onApprove,
  onApproveAll,
}: {
  group: TriageGroup;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onApprove: (id: string) => void;
  onApproveAll: (ids: string[]) => void;
}) {
  // Collapse near-duplicate rows within this group (display only — nothing is
  // dropped; each representative carries the pages its duplicates were cited on).
  // Approve-all still targets every confident representative, so the count and the
  // action stay consistent with what is on screen. See lib/dedupe.ts.
  const { representatives, meta } = collapseDuplicates(group.items);
  const approvable = representatives.filter(isConfidentNonGating);

  return (
    <section>
      <div className="flex items-center justify-between gap-3 border-b border-hairline pb-2">
        <h3 className="text-[12.5px] font-medium uppercase tracking-wide text-ink-muted">
          {group.label}
        </h3>
        {group.key === "ready" && approvable.length > 1 && (
          <button
            type="button"
            onClick={() => onApproveAll(approvable.map((req) => req.id))}
            className="text-xs font-medium text-forest transition-colors hover:text-forest-hover hover:underline"
          >
            Approve all confident ({approvable.length})
          </button>
        )}
      </div>
      <div className="mt-2 flex flex-col gap-0.5">
        {representatives.map((req) => (
          <MatrixRow
            key={req.id}
            req={req}
            isSelected={req.id === selectedId}
            alsoCitedOn={meta.get(req.id)?.alsoCitedOn ?? []}
            onSelect={onSelect}
            onApprove={onApprove}
          />
        ))}
      </div>
    </section>
  );
}

export function ComplianceMatrix({
  groups,
  selectedId,
  onSelect,
  onApprove,
  activeFilter,
}: {
  groups: TriageGroup[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onApprove: (id: string) => void;
  activeFilter: GroupKey | null;
}) {
  const [query, setQuery] = useState("");
  const normalisedQuery = query.trim().toLowerCase();
  // Skip empty groups; when a filter is active, show only that group.
  const visible = groups
    .map((group) => ({
      ...group,
      items:
        normalisedQuery.length === 0
          ? group.items
          : group.items.filter((req) =>
              [
                req.text,
                req.category,
                req.source_clause ?? "",
                req.answer?.text ?? "",
              ]
                .join(" ")
                .toLowerCase()
                .includes(normalisedQuery)
            ),
    }))
    .filter(
      (g) =>
        g.items.length > 0 && (activeFilter === null || g.key === activeFilter)
    );

  function approveAll(ids: string[]) {
    for (const id of ids) onApprove(id);
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-2 border-b border-hairline pb-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="max-w-md flex-1">
          <span className="sr-only">Search requirements</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search requirements, clauses or answers"
            className="w-full rounded-md border border-hairline bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-forest focus:ring-1 focus:ring-forest"
          />
        </label>
        <span className="font-mono text-xs text-ink-muted">
          {visible.reduce(
            (sum, group) =>
              sum + collapseDuplicates(group.items).representatives.length,
            0
          )}{" "}
          shown
        </span>
      </div>

      {visible.map((group) => (
        <MatrixGroup
          key={group.key}
          group={group}
          selectedId={selectedId}
          onSelect={onSelect}
          onApprove={onApprove}
          onApproveAll={approveAll}
        />
      ))}
      {visible.length === 0 && (
        <p className="text-sm text-ink-muted">
          No requirements match this view.
        </p>
      )}
    </div>
  );
}
