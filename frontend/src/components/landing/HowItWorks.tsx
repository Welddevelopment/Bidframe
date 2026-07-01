const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: "1",
    title: "Upload the tender",
    body: "Drop in the PDF. Bidframe reads it and finds every requirement, with its source.",
  },
  {
    n: "2",
    title: "Review the worklist",
    body: "Each requirement comes with its confidence and its clause reference. The deal-breakers and the uncertain ones are flagged. You approve, edit, or flag each one.",
  },
  {
    n: "3",
    title: "Draft your answers",
    body: "Bidframe drafts each answer from your own documents and shows where it came from. It asks you only what it cannot find.",
  },
];

export function HowItWorks() {
  return (
    <ol className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
      {STEPS.map(({ n, title, body }) => (
        <li key={n} className="relative pt-6">
          {/* Ledger through-line: a thin rule across the top of the columns,
              tying the three steps into one ruled ledger row. */}
          <span
            aria-hidden
            className="absolute left-0 top-0 h-px w-full bg-hairline"
          />
          <span className="font-mono text-xs text-ink-muted">{n}</span>
          <h3 className="mt-3 font-serif text-xl font-semibold leading-tight tracking-tight text-ink">
            {title}
          </h3>
          <p className="mt-3 text-lg leading-relaxed text-ink-muted">{body}</p>
        </li>
      ))}
    </ol>
  );
}
