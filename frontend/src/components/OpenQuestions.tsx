"use client";

import { useState } from "react";
import type { OpenQuestion, Requirement } from "@/types/requirement";
import { useRequirements } from "@/context/RequirementsContext";

export function OpenQuestions({ requirement }: { requirement: Requirement }) {
  const questions = requirement.open_questions ?? [];
  if (questions.length === 0) return null;

  const unanswered = questions.filter((q) => q.answer === null).length;

  return (
    <section className="mt-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-mono text-xs font-medium uppercase tracking-wide text-ink-muted">
          Open questions
        </h3>
        {unanswered > 0 && (
          <span className="text-xs font-medium text-signal-amber">
            {unanswered} need{unanswered === 1 ? "s" : ""} an answer
          </span>
        )}
      </div>
      <ul className="flex flex-col gap-4">
        {questions.map((question) => (
          <OpenQuestionItem
            key={question.id}
            requirementId={requirement.id}
            question={question}
          />
        ))}
      </ul>
    </section>
  );
}

export function OpenQuestionItem({
  requirementId,
  question,
}: {
  requirementId: string;
  question: OpenQuestion;
}) {
  const { answerOpenQuestion, requirements, updateRequirement } =
    useRequirements();
  const [value, setValue] = useState(question.answer ?? "");
  const [saved, setSaved] = useState(false);
  const answered = question.answer !== null;
  const trimmed = value.trim();
  const dirty = trimmed.length > 0 && trimmed !== (question.answer ?? "");
  const requirement = requirements.find((req) => req.id === requirementId);
  const questionAnswer = question.answer ?? "";

  function saveAnswer() {
    if (!requirement) {
      answerOpenQuestion(requirementId, question.id, trimmed);
      setSaved(true);
      return;
    }

    const nextQuestions = (requirement.open_questions ?? []).map((q) =>
      q.id === question.id
        ? { ...q, answer: trimmed, answered_at: new Date().toISOString() }
        : q
    );
    const allAnswered = nextQuestions.every((q) => q.answer);
    const baseText =
      requirement.answer?.text ??
      requirement.draft_answer ??
      "Draft answer ready for review.";
    const answerText =
      allAnswered && !baseText.includes(trimmed)
        ? `${baseText}\n\nBid team input: ${trimmed}`
        : baseText;

    updateRequirement(requirementId, {
      open_questions: nextQuestions,
      draft_answer: allAnswered ? answerText : requirement.draft_answer,
      answer: requirement.answer
        ? {
            ...requirement.answer,
            text: answerText,
            state: allAnswered ? "human_edited" : requirement.answer.state,
            confidence: allAnswered
              ? Math.max(requirement.answer.confidence, 0.7)
              : requirement.answer.confidence,
          }
        : requirement.answer,
    });
    setSaved(true);
  }

  return (
    <li id={question.id} className="scroll-mt-24">
      {/* The answered/unanswered distinction is carried by a quiet dot plus a
          word and whitespace, not a full coloured card. */}
      <div className="flex items-baseline gap-2">
        <span
          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
            answered ? "bg-forest" : "bg-signal-amber"
          }`}
          aria-hidden
        />
        <p className="max-w-[64ch] text-sm leading-snug text-ink">
          {question.question}
        </p>
        <span
          className={`shrink-0 text-xs ${
            answered ? "text-ink-muted" : "text-signal-amber"
          }`}
        >
          {answered ? "Answered" : "Needs your input"}
        </span>
      </div>
      <div className="mt-2 flex items-start gap-2 pl-4">
        <textarea
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setSaved(false);
          }}
          placeholder="Type your answer"
          rows={answered || value.includes("\n") ? 3 : 2}
          className="min-w-0 flex-1 resize-y rounded-md border border-hairline px-2.5 py-1.5 text-sm leading-relaxed text-ink outline-none transition-colors focus:border-forest focus:ring-1 focus:ring-forest"
        />
        <button
          type="button"
          disabled={!dirty}
          onClick={saveAnswer}
          className="shrink-0 rounded-md bg-forest px-3 py-1.5 text-sm font-medium text-paper transition-colors hover:bg-forest-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {answered ? "Update" : "Save"}
        </button>
      </div>
      {(saved || (!dirty && answered && questionAnswer.length > 0)) && (
        <p className="mt-1 pl-4 text-xs text-forest">
          Saved. The draft now includes your input for review.
        </p>
      )}
    </li>
  );
}
