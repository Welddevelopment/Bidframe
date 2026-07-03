const METHOD_STEPS = [
  {
    number: "01",
    title: "One live tender",
    detail: "A public-sector cleaning ITT, labelled before scoring.",
  },
  {
    number: "02",
    title: "Hand checked",
    detail: "Every counted line was checked against the source.",
  },
  {
    number: "03",
    title: "Source linked",
    detail: "Requirement, answer key row, and clause all had to line up.",
  },
];

const AUDIT_MARKS = [
  { label: "Gate found", value: "ISO 9001" },
  { label: "Clause traced", value: "4.2.1 / p.14" },
  { label: "Source checked", value: "answer key" },
  { label: "Answer approved", value: "14:32" },
];

// A compact method record for the proof numbers. The point is not to make a
// broad benchmark claim; it is to show that the worked example was measured in
// a way a bid writer can audit.
export function CredibilityBand() {
  return (
    <div className="credibility-panel mx-auto max-w-[1080px]">
      <div className="mx-auto max-w-[780px] text-center">
        <h3 className="text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          How we measured this
        </h3>
        <p className="mx-auto mt-5 max-w-[58ch] text-balance text-lg leading-relaxed text-ink-muted sm:text-xl">
          One worked example, labelled before scoring. Each counted claim stays
          tied to the tender record.
        </p>
      </div>

      <div className="credibility-panel__body mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-stretch">
        <ol className="credibility-method-list">
          {METHOD_STEPS.map((step) => (
            <li key={step.number} className="credibility-method-step">
              <div className="flex gap-4">
                <span className="credibility-method-step__number shrink-0 font-mono text-xs text-forest">
                  {step.number}
                </span>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-forest">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-base leading-relaxed text-ink-muted">
                    {step.detail}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="credibility-audit relative">
          <div className="credibility-audit__record surface-grain overflow-hidden rounded-lg border bg-paper-raised">
            <div className="flex items-center justify-between border-b border-hairline bg-paper px-5 py-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-forest">
                Audit
              </span>
              <span className="font-mono text-[11px] text-ink-muted">
                worked example
              </span>
            </div>
            <div className="grid divide-y divide-hairline sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              {AUDIT_MARKS.map((mark) => (
                <AuditMark
                  key={mark.label}
                  label={mark.label}
                  value={mark.value}
                />
              ))}
            </div>
            <div className="border-t border-hairline bg-paper px-5 py-5">
              <p className="mx-auto max-w-[42ch] text-center text-lg leading-relaxed text-ink">
                Counted only when the requirement, answer key, and source clause
                agreed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditMark({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-5 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-forest">
        {label}
      </p>
      <p className="mt-2 text-lg leading-tight text-ink sm:text-xl">{value}</p>
    </div>
  );
}
