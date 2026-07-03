"use client";

import type { CapabilityDoc, Requirement } from "@/types/requirement";
import { matchesFilter, type AnswerFilterKey } from "@/lib/answers";
import { ExportMenu } from "./ExportMenu";

// The workspace controls: one answer-centric filter select, a document-order /
// weakest-first sort select, and the export menu. Purpose-built for the answers
// flow, not the matrix triage bar. Counts are derived live from the requirements
// so the dropdown stays honest as answers change.

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
  onSelect,
  weakestFirst,
  onToggleSort,
}: {
  requirements: Requirement[];
  capabilityDocs: CapabilityDoc[];
  tenderTitle: string;
  active: Set<AnswerFilterKey>;
  onSelect: (key: AnswerFilterKey | null) => void;
  weakestFirst: boolean;
  onToggleSort: (next: boolean) => void;
}) {
  const count = (key: AnswerFilterKey) =>
    requirements.filter((req) => matchesFilter(req, key)).length;
  const activeValue =
    active.size === 1
      ? Array.from(active)[0]
      : active.size > 1
        ? "mixed"
        : "all";

  return (
    <div className="no-print flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-y border-hairline py-3">
      <FilterSelect
        value={activeValue}
        count={count}
        onSelect={onSelect}
      />

      <div className="flex items-center gap-4">
        <label className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
          <span className="uppercase tracking-wide">Sort</span>
          <select
            value={weakestFirst ? "weakest" : "document"}
            onChange={(event) => onToggleSort(event.target.value === "weakest")}
            className="rounded border border-hairline bg-paper px-1.5 py-0.5 text-[11px] text-ink outline-none transition-colors focus:border-forest focus:ring-1 focus:ring-forest"
          >
            <option value="weakest">Weakest first</option>
            <option value="document">Document order</option>
          </select>
        </label>

        <ExportMenu
          requirements={requirements}
          capabilityDocs={capabilityDocs}
          tenderTitle={tenderTitle}
        />
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  count,
  onSelect,
}: {
  value: AnswerFilterKey | "all" | "mixed";
  count: (key: AnswerFilterKey) => number;
  onSelect: (key: AnswerFilterKey | null) => void;
}) {
  return (
    <label className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ink-muted">
      <FilterIcon />
      <select
        value={value}
        aria-label="Filter answers"
        onChange={(event) => {
          const next = event.target.value;
          onSelect(next === "all" ? null : (next as AnswerFilterKey));
        }}
        className="rounded border border-hairline bg-paper px-1.5 py-0.5 text-[11px] text-ink outline-none transition-colors focus:border-forest focus:ring-1 focus:ring-forest"
      >
        <option value="all">All answers</option>
        {value === "mixed" && (
          <option value="mixed" disabled>
            Multiple filters
          </option>
        )}
        {CHIPS.map(({ key, label }) => {
          const n = count(key);
          return (
            <option key={key} value={key} disabled={n === 0 && value !== key}>
              {label} ({n})
            </option>
          );
        })}
      </select>
    </label>
  );
}

function FilterIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 text-ink-muted"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5h16l-6.5 7.5v5L10.5 19v-6.5L4 5z" />
    </svg>
  );
}
