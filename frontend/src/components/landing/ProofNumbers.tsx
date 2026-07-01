const PROOF_ROWS: { figure: string; label: string }[] = [
  { figure: "Every", label: "deal-breaker caught" },
  {
    figure: "18 / 19",
    label: "requirements found, the last one flagged for you",
  },
  {
    figure: "0",
    label: "answers invented, every claim links to your document",
  },
];

export function ProofNumbers() {
  return (
    <dl className="border-t border-paper/15">
      {PROOF_ROWS.map(({ figure, label }) => (
        <div
          key={figure}
          className="grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-b border-paper/15 py-8 sm:grid-cols-[minmax(0,auto)_1fr] sm:gap-x-12 sm:py-10"
        >
          <dt className="font-mono text-6xl font-medium leading-[0.9] tracking-tight text-paper sm:text-7xl">
            {figure}
          </dt>
          <dd className="text-lg leading-relaxed text-paper/75 sm:text-xl">
            {label}
          </dd>
        </div>
      ))}
    </dl>
  );
}
