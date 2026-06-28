import type { AnswerState } from "@/types/requirement";

const styles: Record<AnswerState, string> = {
  auto: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  needs_input: "bg-amber-50 text-amber-800 ring-amber-200",
  human_edited: "bg-blue-50 text-blue-700 ring-blue-200",
  empty: "bg-slate-100 text-slate-600 ring-slate-200",
};

const labels: Record<AnswerState, string> = {
  auto: "Auto-drafted",
  needs_input: "Needs your input",
  human_edited: "Edited by you",
  empty: "No draft",
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
