"use client";

import type { AnswerFilterKey, ReadinessCounts } from "@/lib/answers";

// The response-readiness ledger: one honest line about whether the bid is
// submittable, a thin forest progress meter, and the four answer-completeness
// counts as quiet clickables that jump the workspace to that slice. De-carded —
// hairlines and whitespace, no coloured slab. Deal-breakers read as an oxblood
// alarm when any remain (they can disqualify the whole bid), and go quiet at
// zero. Derived from deriveReadiness (answer completeness), not the decision
// triage — a gating item can be accepted yet still lack backing evidence.

export function ReadinessLedger({
  counts,
  onSelect,
}: {
  counts: ReadinessCounts;
  // null clears the filter (the "ready" tally). "no-draft" has no matching
  // chip, so that tally is informational only.
  onSelect: (key: AnswerFilterKey | null) => void;
}) {
  const { dealBreaker, needsInput, noDraft, ready, total } = counts;
  const pct = total === 0 ? 100 : Math.round((ready / total) * 100);

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
          className="h-full rounded-full bg-forest"
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
