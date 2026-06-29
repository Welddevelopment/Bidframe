"use client";

import type { GroupKey } from "@/lib/triage";
import { SectionNav } from "./SectionNav";

// The document header (layout.md section 2): a thin three-zone bar, not a
// marketing one. Left is a quiet section switcher above the tender title. Centre
// is the triage line: three in-page filters for the worklist groups. Right is
// exactly one primary action, Next. On views without a worklist (answers, graph)
// only the left zone renders.

interface TriageHeader {
  counts: Record<GroupKey, number>;
  activeFilter: GroupKey | null;
  onFilter: (key: GroupKey | null) => void;
  onNext: () => void;
  nextLabel: string;
}

export function DocumentHeader({
  title,
  triage,
}: {
  title: string;
  triage?: TriageHeader;
}) {
  return (
    <header className="border-b border-hairline bg-paper-raised">
      <div className="mx-auto flex max-w-[1160px] items-center justify-between gap-6 px-6 py-5">
        {/* LEFT: the section switcher above the tender title (the one Fraunces use). */}
        <div className="flex min-w-0 flex-col gap-1.5">
          <SectionNav />
          <h1 className="truncate font-serif text-lg font-semibold tracking-tight text-ink">
            {title}
          </h1>
        </div>

        {triage && (
          <>
            {/* CENTRE: the triage line. Three quiet in-page filters, middot
                separated. Clicking the active one clears the filter. */}
            <nav
              aria-label="Filter the worklist"
              className="flex items-center gap-3 text-sm"
            >
              <TriageFilter
                count={triage.counts["needs-you"]}
                label="need your input"
                groupKey="needs-you"
                activeFilter={triage.activeFilter}
                onFilter={triage.onFilter}
              />
              <span aria-hidden className="text-ink-muted">
                ·
              </span>
              <TriageFilter
                count={triage.counts["to-verify"]}
                label="to verify"
                groupKey="to-verify"
                activeFilter={triage.activeFilter}
                onFilter={triage.onFilter}
              />
              <span aria-hidden className="text-ink-muted">
                ·
              </span>
              <TriageFilter
                count={triage.counts.ready}
                label="ready to approve"
                groupKey="ready"
                activeFilter={triage.activeFilter}
                onFilter={triage.onFilter}
              />
            </nav>

            {/* RIGHT: exactly one primary action. */}
            <button
              type="button"
              onClick={triage.onNext}
              className="shrink-0 rounded-md bg-forest px-4 py-1.5 text-sm font-semibold text-paper transition-colors hover:bg-forest-hover"
            >
              {triage.nextLabel}
            </button>
          </>
        )}
      </div>
    </header>
  );
}

function TriageFilter({
  count,
  label,
  groupKey,
  activeFilter,
  onFilter,
}: {
  count: number;
  label: string;
  groupKey: GroupKey;
  activeFilter: GroupKey | null;
  onFilter: (key: GroupKey | null) => void;
}) {
  const isActive = activeFilter === groupKey;
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => onFilter(isActive ? null : groupKey)}
      className={`transition-colors ${
        isActive
          ? "font-semibold text-ink underline decoration-1 underline-offset-4"
          : "text-ink-muted hover:text-ink"
      }`}
    >
      {count} {label}
    </button>
  );
}
