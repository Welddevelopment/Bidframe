"use client";

import { useRequirements } from "@/context/RequirementsContext";
import { CategoryTag } from "@/components/CategoryTag";
import { AnswerStateBadge } from "./AnswerStateBadge";
import { OpenQuestionItem } from "./OpenQuestions";

export function GapInterview() {
  const { requirements } = useRequirements();

  const groups = requirements
    .map((req) => ({ req, questions: req.open_questions ?? [] }))
    .filter((group) => group.questions.length > 0);

  const allQuestions = groups.flatMap((group) => group.questions);
  const total = allQuestions.length;
  const answered = allQuestions.filter((q) => q.answer !== null).length;
  const remaining = total - answered;
  const pct = total === 0 ? 100 : Math.round((answered / total) * 100);

  if (groups.length === 0) {
    return (
      <div className="max-w-[64ch]">
        <p className="text-sm font-medium text-ink">All clear. No open questions.</p>
        <p className="mt-1 text-sm text-ink-muted">
          Every draft is backed by your evidence. Nothing needs you right now.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* One honest triage line, no stat tiles. */}
      <div className="max-w-[64ch]">
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
        <div
          className="mt-2 h-1 w-full overflow-hidden rounded-full bg-hairline"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-forest"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* De-carded groups: hairlines and whitespace separate the kinds, no
          rounded-xl border shadow wrappers. */}
      <ul className="flex flex-col">
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
              <span className="font-mono text-ink-muted">p.{req.source_page}</span>
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
    </div>
  );
}
