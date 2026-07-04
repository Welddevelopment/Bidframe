"use client";

import { useState } from "react";
import type { Requirement } from "@/types/requirement";
import { useRequirements } from "@/context/RequirementsContext";
import { AnswerStateBadge } from "./AnswerStateBadge";
import styles from "./AnswerPanel.module.css";

// The drafted-answer zone of the requirement panel (layout.md section 6). It
// lives inside the panel's measure and margin: the warm answer prose sits in a
// 64ch reading column on the left, and everything machine-ish (the answer-state
// badge, the edit control, the evidence refs, the page numbers) runs down the
// mono margin on the right. The draft is provisional, so it carries at most a
// 2px accent edge, never a coloured slab. Evidence reads as "Backed by your
// {doc}, p.{page}" — the first receipt sits open so the grounding is visible
// without a click; further refs expand in place to the verbatim excerpt.
// While a draft run is in flight the prose column shows a shimmer skeleton,
// and a landing answer settles in with a one-shot rise (AnswerPanel.module.css,
// reduced-motion gated). Edit state lives in context, keyed by requirement id,
// so mid-edit text survives the card unmounting on a re-sort or filter change.

export function AnswerPanel({ requirement }: { requirement: Requirement }) {
  const {
    capabilityDocs,
    editAnswer,
    draftRun,
    answerEdits,
    beginAnswerEdit,
    updateAnswerEdit,
    endAnswerEdit,
  } = useRequirements();
  const answer = requirement.answer ?? null;
  const draft = answerEdits[requirement.id];
  const editing = draft !== undefined;
  // This card's place in a draft run: waiting shows the skeleton, landing runs
  // the one-shot settle. An open edit always wins over the skeleton — never
  // hide a judge's half-typed text behind a loading state.
  const pending = !editing && (draftRun?.pending.has(requirement.id) ?? false);
  const justLanded =
    !!answer && (draftRun?.landed.has(requirement.id) ?? false);

  function docName(docId: string): string {
    return capabilityDocs.find((d) => d.doc_id === docId)?.filename ?? docId;
  }

  return (
    <div
      className={`flex flex-col gap-4 @2xl:flex-row @2xl:gap-0 ${
        justLanded ? styles.settle : ""
      }`}
    >
      {/* Prose column: the warm reading measure, left-aligned, capped at 64ch. */}
      <div className="min-w-0 flex-1 @2xl:pr-8">
        {editing ? (
          <div className="flex max-w-[64ch] flex-col gap-2.5">
            <textarea
              value={draft}
              onChange={(event) =>
                updateAnswerEdit(requirement.id, event.target.value)
              }
              rows={5}
              autoFocus
              placeholder="Write your answer"
              className="w-full resize-none border border-hairline px-3 py-2 text-sm leading-relaxed text-ink outline-none focus:border-forest focus:ring-1 focus:ring-forest"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  editAnswer(requirement.id, draft.trim());
                  endAnswerEdit(requirement.id);
                }}
                className="bg-forest px-3.5 py-1.5 text-sm font-semibold text-paper transition-colors hover:bg-forest-hover"
              >
                Save answer
              </button>
              <button
                type="button"
                onClick={() => endAnswerEdit(requirement.id)}
                className="px-3.5 py-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : pending ? (
          // In-flight skeleton: placeholder lines where the prose will land.
          <div
            role="status"
            aria-label="Drafting this answer"
            className="max-w-[64ch] border-l-2 border-hairline pl-3"
          >
            <div className="flex flex-col gap-2 py-1">
              <div className={`${styles.skeletonLine} w-[95%]`} />
              <div className={`${styles.skeletonLine} w-[88%]`} />
              <div className={`${styles.skeletonLine} w-[62%]`} />
            </div>
          </div>
        ) : answer ? (
          <div className="max-w-[64ch] border-l-2 border-forest/50 pl-3">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {answer.text}
            </p>
            {answer.state === "human_edited" && (
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-forest">
                Edited by user. Your wording wins.
              </p>
            )}
          </div>
        ) : (
          <div className="max-w-[64ch]">
            <p className="text-sm leading-relaxed text-ink-muted">
              No draft yet. Run autofill to draft from your documents, or write
              this answer yourself.
            </p>
            <button
              type="button"
              onClick={() => beginAnswerEdit(requirement.id, "")}
              className="no-print mt-2 inline-flex items-center gap-1.5 rounded-md border border-hairline bg-paper px-2.5 py-1.5 text-xs font-medium text-ink shadow-[var(--depth-control)] transition-colors hover:border-forest hover:text-forest"
            >
              <PencilIcon />
              Write answer
            </button>
          </div>
        )}
      </div>

      {/* Mono margin: the answer-state badge and edit control, then the
          evidence refs as quiet source lines that expand in place to the
          verbatim excerpt. */}
      {answer && !pending && (
        <div className="flex shrink-0 flex-col gap-3 @2xl:w-56 @2xl:border-l @2xl:border-hairline @2xl:pl-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <AnswerStateBadge state={answer.state} />
            {!editing && (
              <button
                type="button"
                onClick={() => beginAnswerEdit(requirement.id, answer.text)}
                className="no-print inline-flex shrink-0 items-center gap-1.5 rounded-md border border-hairline bg-paper px-2 py-1 font-mono text-[11px] font-medium text-ink shadow-[var(--depth-control)] transition-colors hover:border-forest hover:text-forest"
              >
                <PencilIcon />
                Edit
              </button>
            )}
          </div>
          {answer.state === "human_edited" && (
            <p className="font-mono text-xs leading-relaxed text-forest">
              Human override recorded.
            </p>
          )}

          {answer.evidence_refs.length === 0 ? (
            <p className="max-w-[64ch] text-sm leading-relaxed text-ink-muted">
              No evidence linked yet. Upload a capability document so this answer
              is backed and checkable.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {answer.evidence_refs.map((ref, index) => (
                <EvidenceRefItem
                  key={`${ref.doc_id}-${index}`}
                  doc={docName(ref.doc_id)}
                  page={ref.page}
                  excerpt={ref.excerpt}
                  // The first receipt sits open so every drafted answer shows
                  // its grounding without a click; the rest stay collapsed.
                  defaultOpen={index === 0}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// One evidence ref in the margin: a mono "Backed by your {doc}, p.{page}" line
// that expands in place to the verbatim excerpt it came from.
function EvidenceRefItem({
  doc,
  page,
  excerpt,
  defaultOpen = false,
}: {
  doc: string;
  page: number;
  excerpt: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <li className="font-mono text-xs leading-relaxed">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="text-left text-accent transition-colors hover:text-ink"
      >
        Backed by your {doc}, p.{page}
      </button>
      {/* Collapsed on screen until opened, but always shown in print so the
          exported PDF carries the verbatim citation. */}
      <p
        className={`mt-2 rounded bg-paper-recessed p-2.5 leading-relaxed text-accent shadow-[var(--depth-pressed)] ${
          open ? "" : "hidden print:block"
        }`}
      >
        &ldquo;{excerpt}&rdquo;
      </p>
    </li>
  );
}

// The edit affordance's glyph: a small pencil, stroke-drawn like the repo's
// other inline icons.
function PencilIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-3 w-3 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m11.3 2.7 2 2L5 13l-2.7.7L3 11l8.3-8.3Z" />
      <path d="m9.8 4.2 2 2" />
    </svg>
  );
}
