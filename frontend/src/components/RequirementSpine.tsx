"use client";

import type { TriageGroup } from "@/lib/triage";
import { ConfidenceIndicator } from "./ConfidenceIndicator";

// The spine (layout.md section 5): the narrow ~300px index column that replaces
// the full matrix once a row is open. It is the document's own contents page,
// not a nav rail, so it lists this tender's requirements grouped exactly as the
// matrix groups them. One line per item: a confidence dot plus the truncated
// requirement text. The open row is marked, and the whole column is keyboard
// navigable. Hierarchy comes from space and a hover background, never per-row
// borders (layout.md section 7).

interface RequirementSpineProps {
  groups: TriageGroup[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function RequirementSpine({
  groups,
  selectedId,
  onSelect,
}: RequirementSpineProps) {
  return (
    <nav
      aria-label="Requirements in this tender"
      className="h-full overflow-y-auto py-2"
    >
      {groups
        .filter((group) => group.items.length > 0)
        .map((group) => (
          <div key={group.key} className="mb-4 last:mb-0">
            <h2 className="px-3 pb-1.5 font-mono text-[12.5px] font-medium uppercase tracking-wide text-ink-muted">
              {group.label}
            </h2>
            <ul>
              {group.items.map((req) => {
                const isSelected = req.id === selectedId;
                return (
                  <li key={req.id}>
                    <button
                      type="button"
                      aria-current={isSelected ? "true" : undefined}
                      onClick={() => onSelect(req.id)}
                      className={`flex w-full items-start gap-2 py-1.5 pr-3 text-left text-sm leading-snug transition-colors ${
                        isSelected
                          ? "border-l-2 border-l-ink bg-paper-raised pl-[10px] font-semibold text-ink"
                          : "border-l-2 border-l-transparent pl-3 text-ink-muted hover:bg-paper-raised hover:text-ink"
                      }`}
                    >
                      <span className="mt-px shrink-0">
                        <ConfidenceIndicator
                          confidence={req.confidence}
                          needsReview={req.needs_review}
                          unanswerable={req.is_gating && req.status === "pending"}
                          variant="dot"
                          size="sm"
                        />
                      </span>
                      <span className="truncate">{req.text}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
    </nav>
  );
}
