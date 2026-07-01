import { useState } from "react";
import type { Requirement } from "@/types/requirement";
import {
  isConfidentNonGating,
  pendingStatusWord,
  type GroupKey,
  type TriageGroup,
} from "@/lib/triage";
import { alsoCitedLabel, collapseDuplicates } from "@/lib/dedupe";
import {
  ConfidenceIndicator,
  confidenceTier,
  type ConfidenceTier,
} from "./ConfidenceIndicator";
import { CategoryDot } from "./CategoryTag";

// The resting row wash, keyed to the confidence tier so the worklist carries a
// calm colour gradient: the riskier the row, the warmer the tint; confident (and
// decided) rows rest clean. Full literal classes so Tailwind sees every one.
const TIER_WASH: Record<ConfidenceTier, string> = {
  oxblood:
    "bg-[color-mix(in_oklab,var(--color-signal-oxblood)_5%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-signal-oxblood)_9%,transparent)]",
  amber:
    "bg-[color-mix(in_oklab,var(--color-signal-amber)_4%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-signal-amber)_8%,transparent)]",
  yellow:
    "bg-[color-mix(in_oklab,var(--color-signal-yellow)_4%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-signal-yellow)_7%,transparent)]",
  "light-green": "hover:bg-paper-raised",
};

// The resting matrix: a contents page, not a table (layout.md sections 3, 4, 7).
// Each requirement is one line on a shared grid [ref | dot | text | status],
// grouped by the ask. Hierarchy comes from type and space, not boxes: no card
// wrapper, no per-row borders, peers separated by whitespace and a hover
// background. The status system carries the colour and the depth: the confidence
// bead, the gating oxblood reading edge, the forest approve tick, and depth that
// lifts only the open row. Interactivity scales with stakes: confident non-gating
// rows expose a single quiet Approve on hover or focus; everything riskier only
// opens the panel.

// The decided-status word (copywriting.md decision-status lexicon), quiet and
// right-aligned. Approval also carries a forest tick, so it never relies on
// colour alone (the greyscale test). Pending items get a differentiated word
// from pendingStatusWord() instead of one flat label.
const DECIDED_WORD: Record<"accepted" | "edited" | "flagged", string> = {
  accepted: "Approved by you",
  edited: "Edited by you",
  flagged: "Flagged",
};

function StatusWord({ req }: { req: Requirement }) {
  // Pending: name what this item needs. A confident non-gating item returns
  // null and rests silent (its cell is owned by the hover Approve). A gating
  // item carries the one signal-coloured word in the column, matched to its
  // oxblood row edge and bead (and still legible as a word in greyscale).
  if (req.status === "pending") {
    const word = pendingStatusWord(req);
    if (!word) return null;
    const tone = req.is_gating ? "text-signal-oxblood" : "text-ink-muted";
    return (
      <span className={`inline-flex items-center gap-1 text-xs ${tone}`}>
        {word}
      </span>
    );
  }

  const tone =
    req.status === "accepted"
      ? "text-forest"
      : req.status === "flagged"
        ? "text-ink"
        : "text-ink-muted";

  return (
    <span className={`inline-flex items-center gap-1 text-xs ${tone}`}>
      {req.status === "accepted" && (
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
      {DECIDED_WORD[req.status]}
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
  const tier = confidenceTier(req.confidence, {
    needsReview: req.needs_review,
    unanswerable,
  });

  // The register: each row carries its real clause ref down a quiet mono margin
  // (design-language). Fall back to the page when there is no clause.
  const ref =
    req.source_clause?.replace(/^section\s+/i, "") ?? `p.${req.source_page}`;

  // Rows read as a flagged zone, not a pinstripe: a faint tier-keyed wash that
  // deepens on hover (oxblood gating carries a pennant + alarm meter too). No
  // naked coloured border. Decided rows rest clean; depth lifts only the open row.
  const shape = "rounded-md";
  const rest =
    req.status === "accepted" ? "hover:bg-paper-raised" : TIER_WASH[tier];
  const state = isSelected
    ? "bg-paper-raised shadow-[var(--depth-row)] ring-1 ring-inset ring-ink/30"
    : rest;

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
      className={`group grid w-full cursor-pointer grid-cols-[46px_30px_1fr_auto] items-start gap-x-3 px-2.5 py-2 text-left transition-[background-color,box-shadow] focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ink/40 ${shape} ${state}`}
    >
      {/* The register margin: a gating pennant then the clause ref, right-aligned
          in mono. The pennant marks the deal-breaker even on decided rows, where
          the alarm meter no longer shows. */}
      <span className="flex items-start justify-end gap-1 pt-1 text-right font-mono text-[11px] leading-tight text-accent/85">
        {req.is_gating && (
          <svg
            width="8"
            height="10"
            viewBox="0 0 8 10"
            fill="none"
            aria-hidden
            className="mt-px shrink-0 text-signal-oxblood"
          >
            <path d="M1 .5v9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M1 1h5L4.6 3 6 5H1z" fill="currentColor" />
          </svg>
        )}
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
        <div className="flex min-w-0 items-center gap-2">
          <CategoryDot category={req.category} />
          <p
            className={`min-w-0 truncate leading-snug ${
              req.is_gating ? "font-medium text-ink" : "text-ink"
            }`}
          >
            {req.text}
          </p>
        </div>

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
              <StatusWord req={req} />
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
          <StatusWord req={req} />
        )}
      </div>
    </div>
  );
}

// A quiet mono chevron: points right when folded, rotates down when open. The
// direction (not colour) carries the state, so it passes the greyscale test.
function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-ink-muted transition-transform duration-150 ${
        expanded ? "rotate-90" : ""
      }`}
    >
      <path
        d="M3 1.5l4 3.5-4 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MatrixGroup({
  group,
  expanded,
  collapsible,
  onToggle,
  selectedId,
  onSelect,
  onApprove,
  onApproveAll,
}: {
  group: TriageGroup;
  // Whether this group's rows are shown. When collapsible is false (frozen/demo
  // surfaces) this is always true and no toggle renders.
  expanded: boolean;
  collapsible: boolean;
  onToggle: () => void;
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
  const rowsId = `group-rows-${group.key}`;

  return (
    <section>
      <div className="flex items-center justify-between gap-3 border-b border-hairline pb-2">
        {collapsible ? (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={rowsId}
            className="group/head flex min-w-0 items-center gap-2 rounded-sm text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ink/40"
          >
            <Chevron expanded={expanded} />
            <h3 className="text-[12.5px] font-medium uppercase tracking-wide text-ink-muted transition-colors group-hover/head:text-ink">
              {group.label}
            </h3>
            <span className="font-mono text-[11px] text-ink-muted/75">
              {representatives.length}
            </span>
          </button>
        ) : (
          <h3 className="text-[12.5px] font-medium uppercase tracking-wide text-ink-muted">
            {group.label}
          </h3>
        )}
        {expanded && group.key === "ready" && approvable.length > 1 && (
          <button
            type="button"
            onClick={() => onApproveAll(approvable.map((req) => req.id))}
            className="text-xs font-medium text-forest transition-colors hover:text-forest-hover hover:underline"
          >
            Approve all confident ({approvable.length})
          </button>
        )}
      </div>
      {expanded && (
        <div id={rowsId} className="mt-2 flex flex-col gap-0.5">
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
      )}
    </section>
  );
}

export function ComplianceMatrix({
  groups,
  selectedId,
  onSelect,
  onApprove,
  activeFilter,
  collapsed,
  onToggleGroup,
}: {
  groups: TriageGroup[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onApprove: (id: string) => void;
  activeFilter: GroupKey | null;
  // Folded groups + the toggle handler. Omitted on the frozen demo/hero surfaces,
  // where every group stays open and no toggle renders.
  collapsed?: Set<GroupKey>;
  onToggleGroup?: (key: GroupKey) => void;
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

      {visible.map((group) => {
        const collapsible = onToggleGroup !== undefined;
        // Force a group open when its rows must be seen regardless of the fold:
        // while searching (never hide a hit), when filtered to it, or when it holds
        // the selected row. Otherwise honour the user's fold state.
        const expanded =
          !collapsible ||
          normalisedQuery.length > 0 ||
          activeFilter === group.key ||
          group.items.some((req) => req.id === selectedId) ||
          !(collapsed?.has(group.key) ?? false);
        return (
          <MatrixGroup
            key={group.key}
            group={group}
            expanded={expanded}
            collapsible={collapsible}
            onToggle={() => onToggleGroup?.(group.key)}
            selectedId={selectedId}
            onSelect={onSelect}
            onApprove={onApprove}
            onApproveAll={approveAll}
          />
        );
      })}
      {visible.length === 0 && (
        <p className="text-sm text-ink-muted">
          No requirements match this view.
        </p>
      )}
    </div>
  );
}
