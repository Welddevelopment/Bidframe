import type { Requirement, RequirementStatus } from "@/types/requirement";
import {
  isConfidentNonGating,
  type GroupKey,
  type TriageGroup,
} from "@/lib/triage";
import { ConfidenceIndicator } from "./ConfidenceIndicator";

// The resting matrix: a contents page, not a table (layout.md sections 3, 4, 7).
// Each requirement is one line on a shared grid [dot | text | status], grouped
// by the ask. Hierarchy comes from type and space, not boxes: no card wrapper,
// no per-row borders, peers separated by whitespace and a hover background.
// Interactivity scales with stakes: confident non-gating rows expose a single
// quiet Approve revealed on hover or focus; everything riskier only opens the
// panel.

// The status word (copywriting.md decision-status lexicon), quiet and
// right-aligned. No filled badge, no ring: the dot carries the colour.
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
    <span className={`text-xs ${tone}`}>{STATUS_WORD[status]}</span>
  );
}

function MatrixRow({
  req,
  isSelected,
  onSelect,
  onApprove,
}: {
  req: Requirement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onApprove: (id: string) => void;
}) {
  const canApproveInline = isConfidentNonGating(req);
  const preview = req.answer?.text ?? req.draft_answer ?? null;

  // A gating item with no resolved decision is the unanswerable oxblood case.
  const unanswerable = req.is_gating && req.status === "pending";

  const selectedTreatment = isSelected
    ? "bg-paper-raised ring-1 ring-inset ring-ink/40"
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
      className={`group grid w-full cursor-pointer grid-cols-[28px_1fr_auto] items-baseline gap-x-3 rounded-md px-2 py-2 text-left transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ink/40 ${selectedTreatment}`}
    >
      {/* Left: confidence dot, greyscale-legible, on the reading edge. */}
      <span className="flex justify-center pt-0.5">
        <ConfidenceIndicator
          confidence={req.confidence}
          needsReview={req.needs_review}
          unanswerable={unanswerable}
          variant="dot"
        />
      </span>

      {/* Middle: one line of requirement text. The drafted-answer preview and
          the low-confidence note are revealed only on hover or keyboard focus,
          never a permanent two-line wall. */}
      <div className="min-w-0">
        <p
          className={`truncate leading-snug ${
            req.is_gating ? "font-medium text-ink" : "text-ink"
          }`}
        >
          {req.text}
        </p>

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

      {/* Right: the status word, or for confident non-gating items a single
          quiet Approve revealed on hover or focus. One affordance only. */}
      <div className="flex shrink-0 items-baseline justify-end">
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
}: {
  group: TriageGroup;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onApprove: (id: string) => void;
}) {
  return (
    <section>
      <h3 className="border-b border-hairline pb-2 text-[12.5px] font-medium uppercase tracking-wide text-ink-muted">
        {group.label}
      </h3>
      <div className="mt-2 flex flex-col gap-0.5">
        {group.items.map((req) => (
          <MatrixRow
            key={req.id}
            req={req}
            isSelected={req.id === selectedId}
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
  // Skip empty groups; when a filter is active, show only that group.
  const visible = groups.filter(
    (g) => g.items.length > 0 && (activeFilter === null || g.key === activeFilter)
  );

  return (
    <div className="flex w-full flex-col gap-10">
      {visible.map((group) => (
        <MatrixGroup
          key={group.key}
          group={group}
          selectedId={selectedId}
          onSelect={onSelect}
          onApprove={onApprove}
        />
      ))}
    </div>
  );
}
