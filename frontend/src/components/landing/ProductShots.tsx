// Three product shots for the landing page, each a differentiated, generously
// sized card. Content only: Landing.tsx owns the section wrappers, heads, and
// spacing. Each card leans on a distinct device so the three do not read as a
// samey grid: the deal-breaker is an oxblood-framed callout, the clause is a
// ruled margin with a pressed source excerpt, the answer is a forest-edged
// draft closed by the approval stamp.

import { ApprovalStamp } from "@/components/ApprovalStamp";

// The deal-breaker: an oxblood-framed callout, the one that loses you the bid.
export function DealBreakerCard() {
  return (
    <div className="card-live surface-grain w-full rounded-lg border border-hairline bg-paper-raised p-7 shadow-[var(--depth-sheet)]">
      <div className="border-l-2 border-signal-oxblood-frame pl-5">
        <p className="font-mono text-xs font-medium uppercase tracking-wide text-signal-oxblood">
          Deal-breaker
        </p>
        <p className="mt-2.5 text-lg leading-snug text-ink">
          The supplier must hold ISO 9001 certification for the full contract
          term. Miss it and the bid is rejected.
        </p>
        <p className="mt-4 font-mono text-xs text-ink-muted">
          p.14 · Section 4.2.1
        </p>
      </div>
    </div>
  );
}

// The clause: a ruled margin beside the requirement, with the exact source
// sentence pressed into the page so you never take our word for it.
export function ClauseCard() {
  return (
    <div className="card-live surface-grain w-full rounded-lg border border-hairline bg-paper-raised p-7 shadow-[var(--depth-row)]">
      <div className="grid grid-cols-[56px_1fr] gap-x-5">
        <div className="border-r border-hairline pr-4 text-right font-mono text-xs leading-relaxed text-accent">
          4.2.1
          <br />
          p.14
        </div>
        <div>
          <p className="text-lg leading-snug text-ink">
            The supplier must hold ISO 9001 certification.
          </p>
          <div className="mt-4 rounded-md bg-paper-recessed p-4 shadow-[var(--depth-pressed)]">
            <p className="border-l-2 border-accent pl-4 font-mono text-xs leading-relaxed text-ink-muted">
              &ldquo;Tenderers shall hold and maintain certification to ISO 9001
              for the duration of the contract.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// The answer: a drafted response from your own documents, with its evidence
// line and the approval stamp under a hairline divider.
export function AnswerCard() {
  return (
    <div className="card-live surface-grain w-full rounded-lg border border-hairline bg-paper-raised p-7 shadow-[var(--depth-row)]">
      <p className="font-mono text-xs uppercase tracking-wide text-ink-muted">
        Requirement
      </p>
      <p className="mt-1.5 text-lg leading-snug text-ink">
        The supplier must hold ISO 9001 certification.
      </p>
      <div className="mt-5 rounded-md border-l-2 border-forest bg-paper p-4">
        <p className="leading-relaxed text-ink">
          We hold ISO 9001:2015, certified by a UKAS-accredited body, valid for
          the full contract term.
        </p>
        <p className="mt-2.5 font-mono text-xs text-accent">
          Backed by your Capability Statement, p.4.
        </p>
      </div>
      <div className="mt-5 border-t border-hairline pt-5">
        <ApprovalStamp />
      </div>
    </div>
  );
}
