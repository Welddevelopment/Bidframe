"use client";

import { useState } from "react";
import { useRequirements } from "@/context/RequirementsContext";
import { CategoryTag } from "@/components/CategoryTag";
import { sourceRefLabel } from "@/lib/source-doc";
import { AnswerStateBadge } from "./AnswerStateBadge";
import { OpenQuestionItem } from "./OpenQuestions";

// The consolidated gap triage for the answers workspace: one line saying how
// many open questions still need the human, expandable in place to the full
// grouped interview (questions grouped under their requirement, answered
// through the same OpenQuestionItem the inline cards use, so the two save
// paths can't drift). Hidden entirely when the tender has no open questions —
// nothing to triage, nothing to say.
export function GapInterview() {
  const { requirements } = useRequirements();
  const [open, setOpen] = useState(false);

  const groups = requirements
    .map((req) => ({ req, questions: req.open_questions ?? [] }))
    .filter((group) => group.questions.length > 0);

  const allQuestions = groups.flatMap((group) => group.questions);
  const total = allQuestions.length;
  const answered = allQuestions.filter((q) => q.answer !== null).length;
  const remaining = total - answered;
  const pct = total === 0 ? 100 : Math.round((answered / total) * 100);

  if (groups.length === 0) return null;

  return (
    <section>
      {/* One honest triage line, no stat tiles, with the expand control beside it. */}
      <div className="max-w-[64ch]">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm text-ink">
            <span className="font-semibold">{remaining}</span> of {total} open
            question{total === 1 ? "" : "s"} still need you.{" "}
            {remaining === 0 ? (
              <span className="text-ink-muted">All answered.</span>
            ) : (
              <span className="text-ink-muted">
                {answered} answered so far.
              </span>
            )}
          </p>
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="shrink-0 rounded-md border border-hairline bg-paper px-2.5 py-1 font-mono text-[11px] font-medium text-ink shadow-[var(--depth-control)] transition-colors hover:border-forest hover:text-forest"
          >
            {open ? "Hide" : remaining > 0 ? "Answer them" : "Review"}
          </button>
        </div>
        <div
          className="mt-2 h-1 w-full overflow-hidden rounded-full bg-hairline"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Open questions answered"
        >
          <div
            className="h-full rounded-full bg-forest motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* De-carded groups: hairlines and whitespace separate the kinds, no
          rounded-xl border shadow wrappers. */}
      {open && (
        <ul className="mt-6 flex flex-col">
          {groups.map(({ req, questions }) => (
            <li
              key={req.id}
              className="border-t border-hairline py-5 first:border-t-0 first:pt-0"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                {req.is_gating && (
                  <span className="inline-flex items-center gap-1.5 font-medium text-signal-oxblood">
                    <span
                      className="h-2 w-2 rounded-full bg-signal-oxblood"
                      aria-hidden
                    />
                    Deal-breaker
                  </span>
                )}
                {req.answer && <AnswerStateBadge state={req.answer.state} />}
                <CategoryTag category={req.category} />
                <span className="font-mono text-accent">{sourceRefLabel(req)}</span>
              </div>
              <p className="mb-3 max-w-[64ch] text-sm font-medium leading-snug text-ink">
                {req.text}
              </p>
              <ul className="flex flex-col gap-2.5">
                {questions.map((question) => (
                  <OpenQuestionItem
                    key={question.id}
                    requirementId={req.id}
                    question={question}
                  />
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
