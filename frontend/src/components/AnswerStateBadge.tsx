import type { AnswerState } from "@/types/requirement";

// Colour semantics (design-language): accent teal = machine work traceable to
// source, so the auto draft wears accent, not forest (forest is reserved for
// the user's own action); amber = still needs input; ink = the human's own
// words; muted = nothing here yet.
const styles: Record<AnswerState, string> = {
  auto: "bg-accent/10 text-accent ring-accent/30",
  needs_input: "bg-signal-amber/15 text-signal-amber ring-signal-amber/30",
  human_edited: "bg-ink/5 text-ink ring-ink/15",
  empty: "bg-paper text-ink-muted ring-hairline",
};

const labels: Record<AnswerState, string> = {
  auto: "Drafted for you",
  needs_input: "Needs your input",
  human_edited: "Edited by you",
  empty: "No draft yet",
};

export function AnswerStateBadge({ state }: { state: AnswerState }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[state]}`}
    >
      {labels[state]}
    </span>
  );
}
