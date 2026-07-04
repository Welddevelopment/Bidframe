"use client";

import { useMemo } from "react";
import { useRequirements } from "@/context/RequirementsContext";

// Makes Bidframe's "user stays in control" model VISIBLE (the Conduct track's thesis:
// the expert stays at the wheel). Two things a judge can see at a glance:
//   1. The activity trail — what the agent DID (read → found → flagged → drafted) and,
//      crucially, what it LEFT for the human, with a live decision tally that updates as
//      you approve / edit / flag.
//   2. The control contract — the explicit LIMITS: it drafts, it never decides; nothing
//      is approved or submitted without you.
// Reads live from the requirements context. Rendered on /showcase; designed to fold into
// the shared product shell (MatrixView's header) so /review shows it too — see J's note.
export function ControlPanel() {
  const { requirements, sourceDocs } = useRequirements();

  const s = useMemo(() => {
    const pagesFromDocs = sourceDocs.reduce(
      (total, doc) => total + (doc.page_count ?? 0),
      0
    );
    const pages =
      pagesFromDocs ||
      requirements.reduce((m, r) => Math.max(m, r.source_page ?? 0), 0);
    const gating = requirements.filter((r) => r.is_gating).length;
    const answered = requirements.filter(
      (r) => r.answer?.state === "auto" || (r.answer?.evidence_refs.length ?? 0) > 0
    ).length;
    const openQ = requirements.reduce(
      (n, r) => n + (r.open_questions?.filter((q) => !q.answer).length ?? 0),
      0
    );
    const accepted = requirements.filter((r) => r.status === "accepted").length;
    const edited = requirements.filter(
      (r) => r.status === "edited" || r.answer?.state === "human_edited"
    ).length;
    const flagged = requirements.filter((r) => r.status === "flagged").length;
    const pending = requirements.filter((r) => r.status === "pending").length;
    return {
      pages,
      total: requirements.length,
      gating,
      answered,
      openQ,
      accepted,
      edited,
      flagged,
      pending,
      decided: accepted + edited + flagged,
    };
  }, [requirements, sourceDocs]);

  const step = (label: string, detail?: string | number) => (
    <li className="flex items-baseline gap-1.5">
      <span className="text-ink">{label}</span>
      {detail !== undefined && (
        <span className="font-mono text-[10px] tabular-nums text-ink-muted">
          {detail}
        </span>
      )}
    </li>
  );

  const chip = (label: string, tone: "can" | "cannot") => (
    <span
      className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${
        tone === "can"
          ? "border-forest/35 bg-forest/10 text-forest"
          : "border-signal-oxblood-frame/35 bg-paper text-signal-oxblood"
      }`}
    >
      {label}
    </span>
  );

  return (
    <section
      aria-label="How Bidframe keeps you in control"
      className="surface-grain border-b border-hairline bg-paper-raised/70 px-6 py-4 shadow-[var(--depth-row)]"
    >
      <div className="mx-auto grid max-w-6xl gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
        {/* Activity trail: what the agent did → what it left for you */}
        <div className="flex min-w-0 flex-col gap-3">
          <ol className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-hairline/80 pb-2 font-mono text-[11px] uppercase tracking-[0.08em]">
            {step("Read tender", `${s.pages} pages`)}
            <span aria-hidden className="text-ink-muted/50">→</span>
            {step(`Found ${s.total} requirements`)}
            <span aria-hidden className="text-ink-muted/50">→</span>
            {step(`Flagged ${s.gating} deal-breakers`)}
            <span aria-hidden className="text-ink-muted/50">→</span>
            {step(`Drafted ${s.answered} answers from evidence`)}
            <span aria-hidden className="text-ink-muted/50">→</span>
            {step(`Left ${s.openQ} question${s.openQ === 1 ? "" : "s"} for user`)}
            <span aria-hidden className="text-ink-muted/50">→</span>
            {step("Waiting for approval", s.pending)}
          </ol>

          <div className="flex flex-wrap gap-1.5" aria-label="Agent limits">
            {chip("Can draft", "can")}
            {chip("Can flag risk", "can")}
            {chip("Can cite evidence", "can")}
            {chip("Cannot approve", "cannot")}
            {chip("Cannot submit", "cannot")}
            {chip("Cannot invent missing evidence", "cannot")}
          </div>

          {/* The control contract — explicit limits on the agent */}
          <p className="max-w-4xl text-xs leading-relaxed text-ink-muted">
            <span className="font-medium text-ink">You&rsquo;re at the wheel.</span>{" "}
            Bidframe reads and drafts. It never decides, approves, submits, or
            fills a gap without evidence.
          </p>
        </div>

        {/* Decision tally — the "nothing is autonomous" proof, updates live */}
        <aside className="rounded-md border border-hairline bg-paper/70 px-3 py-2 shadow-[var(--depth-pressed)]">
          <p className="font-mono text-[11px] font-medium uppercase tracking-wide text-ink-muted">
            Decision log
          </p>
          <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
            <div>
              <dt className="text-ink-muted">Approved by user</dt>
              <dd className="font-mono text-ink">{s.accepted}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Edited by user</dt>
              <dd className="font-mono text-ink">{s.edited}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Flagged for colleague</dt>
              <dd className="font-mono text-ink">{s.flagged}</dd>
            </div>
            <div>
              <dt className="text-ink-muted">Questions remaining</dt>
              <dd className="font-mono text-ink">{s.openQ}</dd>
            </div>
          </dl>
          <p className="mt-2 border-t border-hairline/80 pt-2 text-sm leading-relaxed text-ink-muted">
            {s.decided === 0 ? (
              <>
                <span className="font-mono text-ink">0 approved</span> - every
                line is pending <span className="text-forest">your</span> review.
              </>
            ) : (
              <>
                <span className="font-mono text-ink">{s.decided}</span> decided
                by you ({s.accepted} approved · {s.edited} edited · {s.flagged}{" "}
                flagged) · {s.total - s.decided} still pending your review.
              </>
            )}
          </p>
        </aside>
      </div>
    </section>
  );
}
