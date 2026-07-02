"use client";

import { useState } from "react";

// The floating bulk-decision bar: appears bottom-centre while any matrix rows
// are selected, in the register's raised-paper voice (no coloured slab). One
// line — the count, then Approve / Flag / Clear. Approve only ever takes the
// confident non-gating members of the selection: when that subset is smaller
// than the selection the label says so ("Approve N eligible"), so a bulk sweep
// can never quietly wave a deal-breaker through. Flag opens a one-line note
// field first — a flag without a reason is noise.
export function BulkActionBar({
  count,
  eligibleCount,
  onApprove,
  onFlag,
  onClear,
}: {
  // How many rows are selected.
  count: number;
  // How many of those are confident non-gating (the only ones Approve touches).
  eligibleCount: number;
  onApprove: () => void;
  onFlag: (note: string) => void;
  onClear: () => void;
}) {
  const [noting, setNoting] = useState(false);
  const [note, setNote] = useState("");

  function submitFlag() {
    const trimmed = note.trim();
    if (!trimmed) return;
    onFlag(trimmed);
    setNote("");
    setNoting(false);
  }

  const approveLabel =
    eligibleCount === count ? "Approve" : `Approve ${eligibleCount} eligible`;

  return (
    <div className="no-print fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      <div className="surface-grain flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-hairline bg-paper-raised px-4 py-2.5 shadow-[var(--depth-sheet)]">
        <span className="font-mono text-xs text-ink">
          {count} selected
        </span>
        <span aria-hidden className="text-ink-muted/60">
          ·
        </span>
        {noting ? (
          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              submitFlag();
            }}
          >
            <label className="sr-only" htmlFor="bulk-flag-note">
              Why are these flagged?
            </label>
            <input
              id="bulk-flag-note"
              autoFocus
              value={note}
              onChange={(event) => setNote(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.stopPropagation();
                  setNoting(false);
                }
              }}
              placeholder="Why are these flagged?"
              className="w-56 rounded border border-hairline bg-paper px-2 py-1 text-xs text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-forest focus:ring-1 focus:ring-forest"
            />
            <button
              type="submit"
              disabled={note.trim().length === 0}
              className="text-xs font-medium text-ink transition-colors hover:underline disabled:cursor-not-allowed disabled:text-ink-muted/60"
            >
              Flag {count}
            </button>
            <button
              type="button"
              onClick={() => setNoting(false)}
              className="font-mono text-[11px] text-ink-muted transition-colors hover:text-ink"
            >
              Cancel
            </button>
          </form>
        ) : (
          <>
            <button
              type="button"
              onClick={onApprove}
              disabled={eligibleCount === 0}
              className="text-xs font-medium text-forest transition-colors hover:text-forest-hover hover:underline disabled:cursor-not-allowed disabled:text-ink-muted/60 disabled:no-underline"
            >
              {approveLabel}
            </button>
            <span aria-hidden className="text-ink-muted/60">
              ·
            </span>
            <button
              type="button"
              onClick={() => setNoting(true)}
              className="text-xs font-medium text-ink transition-colors hover:underline"
            >
              Flag
            </button>
            <span aria-hidden className="text-ink-muted/60">
              ·
            </span>
            <button
              type="button"
              onClick={onClear}
              className="font-mono text-[11px] text-ink-muted transition-colors hover:text-ink"
            >
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
}
