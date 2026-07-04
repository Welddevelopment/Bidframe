"use client";

import type { Requirement } from "@/types/requirement";
import { hasDraft, isOpenDealBreaker } from "@/lib/answers";
import { sourceRefLabel } from "@/lib/source-doc";
import { AnswerPanel } from "./AnswerPanel";
import { CategoryTag } from "./CategoryTag";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { OpenQuestions } from "./OpenQuestions";

// One requirement's response in the workspace: metadata row, the requirement
// text, the drafted answer + evidence receipts (AnswerPanel), and any open
// questions inline. De-carded — a hairline-separated row, no rounded slab,
// matching GapInterview's list grammar. The card carries the requirement id as
// a scroll anchor so the ledger/filters and future deep links can jump to it.

export function AnswerCard({ requirement: req }: { requirement: Requirement }) {
  const answer = req.answer ?? null;
  // A gating item with no draft can't be answered from source — read it as the
  // oxblood alarm, not a low meter.
  const unanswerable = isOpenDealBreaker(req) && !hasDraft(req);

  return (
    <li
      id={req.id}
      className="answer-card scroll-mt-24 border-t border-hairline py-6 first:border-t-0 first:pt-0"
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
        <CategoryTag category={req.category} />
        <ConfidenceIndicator
          confidence={answer?.confidence ?? req.confidence}
          needsReview={req.needs_review}
          unanswerable={unanswerable}
          variant="dot"
          size="sm"
        />
        {/* The answer-state badge lives in the panel's mono margin — one badge
            per card, not two. Accent on the clause ref: the requirement's own
            source ref and the evidence refs share the one "traceable to
            source" colour. */}
        <span className="font-mono text-accent">{sourceRefLabel(req)}</span>
      </div>

      <p className="mb-3 max-w-[64ch] text-sm font-medium leading-snug text-ink">
        {req.text}
      </p>

      <AnswerPanel requirement={req} />

      {/* Inline gaps. Hidden in print — answered gap input is merged into the
          drafted answer prose, which carries onto the PDF. */}
      <div className="no-print">
        <OpenQuestions requirement={req} />
      </div>
    </li>
  );
}
