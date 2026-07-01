"use client";

import type { CapabilityDoc, Requirement } from "@/types/requirement";
import { matchesFilter, type AnswerFilterKey } from "@/lib/answers";
import { ExportMenu } from "./ExportMenu";

// The workspace controls: answer-centric filter chips (multi-select), a
// weakest-first / document-order sort toggle, and the export menu. Purpose-built
// for the answers flow — NOT the Matrix triage bar. Chip counts are derived live
// from the requirements so they stay honest as answers change; a chip with no
// matches dims out. Same grammar as SectionNav: text weight + forest underline
// marks the active state, aria-pressed for assistive tech.

const CHIPS: { key: AnswerFilterKey; label: string }[] = [
  { key: "deal-breakers", label: "Deal-breakers" },
  { key: "needs-input", label: "Needs input" },
  { key: "unbacked", label: "Unbacked" },
];

export function AnswerFilterBar({
  requirements,
  capabilityDocs,
  tenderTitle,
  active,
  onToggle,
  weakestFirst,
  onToggleSort,
}: {
  requirements: Requirement[];
  capabilityDocs: CapabilityDoc[];
  tenderTitle: string;
  active: Set<AnswerFilterKey>;
  onToggle: (key: AnswerFilterKey) => void;
  weakestFirst: boolean;
  onToggleSort: (next: boolean) => void;
}) {
  const count = (key: AnswerFilterKey) =>
    requirements.filter((req) => matchesFilter(req, key)).length;

  return (
    <div className="no-print flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-y border-hairline py-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">
          Filter
        </span>
        {CHIPS.map(({ key, label }) => {
          const n = count(key);
          const isActive = active.has(key);
          const disabled = n === 0 && !isActive;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={isActive}
              disabled={disabled}
              onClick={() => onToggle(key)}
              className={`transition-colors ${
                isActive
                  ? "font-semibold text-ink underline decoration-forest decoration-2 underline-offset-4"
                  : disabled
                    ? "cursor-not-allowed text-ink-muted/50"
                    : "text-ink-muted hover:text-ink"
              }`}
            >
              {label}{" "}
              <span className="font-mono text-xs text-ink-muted">{n}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-pressed={weakestFirst}
          onClick={() => onToggleSort(!weakestFirst)}
          className="text-sm text-ink-muted transition-colors hover:text-ink"
          title="Toggle sort order"
        >
          Sort:{" "}
          <span className="font-medium text-ink">
            {weakestFirst ? "Weakest first" : "Document order"}
          </span>
        </button>

        <ExportMenu
          requirements={requirements}
          capabilityDocs={capabilityDocs}
          tenderTitle={tenderTitle}
        />
      </div>
    </div>
  );
}
