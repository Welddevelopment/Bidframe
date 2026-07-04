"use client";

import type { CapabilityDoc, Requirement } from "@/types/requirement";
import type { AnswerFilterKey, ReadinessCounts } from "@/lib/answers";
import { ExportMenu } from "./ExportMenu";

// The response-readiness ledger: one honest line about whether the bid is
// submittable, a thin forest progress meter (its width transitions, so it
// visibly fills as answers land and decisions clear), and the four
// answer-completeness counts as quiet clickables that jump the workspace to
// that slice. De-carded — hairlines and whitespace, no coloured slab.
// Deal-breakers read as an oxblood alarm when any remain (they can disqualify
// the whole bid), and go quiet at zero. At 100% the ledger pays off: a forest
// check, "Ready to submit", and the export action surfaced right here (it
// stays in the filter bar too). Derived from deriveReadiness (answer
// completeness), not the decision triage — a gating item can be accepted yet
// still lack backing evidence.

export function ReadinessLedger({
  counts,
  onSelect,
  requirements,
  capabilityDocs,
  tenderTitle,
}: {
  counts: ReadinessCounts;
  // null clears the filter (the "ready" tally). "no-draft" has no matching
  // chip, so that tally is informational only.
  onSelect: (key: AnswerFilterKey | null) => void;
  // For the 100% payoff: the ledger surfaces the export action itself when
  // every answer is ready, so it needs the export inputs.
  requirements: Requirement[];
  capabilityDocs: CapabilityDoc[];
  tenderTitle: string;
}) {
  const { dealBreaker, needsInput, noDraft, ready, total } = counts;
  const pct = total === 0 ? 100 : Math.round((ready / total) * 100);
  const complete = total > 0 && ready === total;

  return (
    <div className="max-w-[64ch]">
      <p className="text-sm text-ink">
        <span className="font-semibold">{ready}</span> of {total} answer
        {total === 1 ? "" : "s"} ready to submit.{" "}
        {dealBreaker > 0 ? (
          <span className="text-signal-oxblood">
            Clear {dealBreaker} deal-breaker{dealBreaker === 1 ? "" : "s"} first.
          </span>
        ) : (
          <span className="text-ink-muted">No deal-breakers outstanding.</span>
        )}
      </p>

      <div
        className="mt-2 h-1 w-full overflow-hidden rounded-full bg-hairline"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Answers ready to submit"
      >
        <div
          className="h-full rounded-full bg-forest motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-ink-muted">
        <LedgerTally
          count={dealBreaker}
          label="deal-breakers unresolved"
          alarm
          onClick={() => onSelect("deal-breakers")}
        />
        <span aria-hidden>·</span>
        <LedgerTally
          count={needsInput}
          label="need input"
          onClick={() => onSelect("needs-input")}
        />
        <span aria-hidden>·</span>
        {/* No matching filter chip for "no draft" — informational only. */}
        <span>
          <span className="text-ink">{noDraft}</span> no draft yet
        </span>
        <span aria-hidden>·</span>
        <LedgerTally
          count={ready}
          label="drafted and backed"
          onClick={() => onSelect(null)}
        />
      </div>

      {/* The quiet celebration at 100%: everything is drafted, backed and
          cleared, so the submission action steps forward. */}
      {complete && (
        <div className="no-print mt-4 flex flex-wrap items-center gap-3">
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-forest">
            <CheckIcon />
            Ready to submit.
          </p>
          <ExportMenu
            requirements={requirements}
            capabilityDocs={capabilityDocs}
            tenderTitle={tenderTitle}
          />
        </div>
      )}
    </div>
  );
}

function LedgerTally({
  count,
  label,
  alarm = false,
  onClick,
}: {
  count: number;
  label: string;
  alarm?: boolean;
  onClick: () => void;
}) {
  const emphasis =
    alarm && count > 0 ? "text-signal-oxblood" : "text-ink";
  return (
    <button
      type="button"
      onClick={onClick}
      className="transition-colors hover:text-ink hover:underline"
    >
      <span className={emphasis}>{count}</span> {label}
    </button>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6.4" />
      <path d="m5.4 8.2 1.8 1.8 3.4-3.8" />
    </svg>
  );
}
