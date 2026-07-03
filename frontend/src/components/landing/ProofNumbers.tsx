// The proof ledger on the pine band: three poster-scale mono figures, each
// treated as an official register entry rather than a dashboard stat. The rows
// stay stacked and the figures stay at text-6xl through the sm range, because
// at 8xl "18 / 19" plus the side-by-side grid squeezes the label into a sliver
// between 640 and 767px; the two-column treatment and the 8xl/9xl steps engage
// from md. The figure itself never wraps mid-record. Labels stay at paper/75,
// which clears AA on pine.
//
// This stacked ledger is also the fallback (SSR, mobile, reduced motion) for
// the pinned proof scrolly (ProofScrolly.tsx), which presents the same rows —
// exported below — one beat at a time. The provenance strings are the real
// record: figures from src/data/spso-prebake.json (13 pages, 183 extracted
// lines) and the hand-checked 19-requirement worked sample the CredibilityBand
// describes.
export const PROOF_ROWS: { figure: string; label: string }[] = [
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

export const PROOF_PROVENANCE =
  "SPSO Cleaning Services ITT · 13 pages · 183 lines extracted";

export const PROOF_SAMPLE_NOTE =
  "Hand-checked sample · 19 requirements · 1 flagged for review";

const TICKS = 19;

// The page-tick strip under "18 / 19": one tally mark per requirement in the
// hand-checked sample, the flagged one taller and amber. `animated` arms the
// staggered light-up (used by the scrolly beat); the static strip renders
// composed.
export function TickStrip({ animated = false }: { animated?: boolean }) {
  return (
    <span aria-hidden className="block">
      <span
        className={`proof-ticks flex items-end gap-[5px] ${
          animated ? "proof-ticks--animate" : ""
        }`}
      >
        {Array.from({ length: TICKS }).map((_, t) => (
          <span
            key={t}
            className={`proof-tick${t === TICKS - 1 ? " proof-tick--flag" : ""}`}
            style={{ "--i": t } as React.CSSProperties}
          />
        ))}
      </span>
      <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.16em] text-paper/[0.52]">
        {PROOF_SAMPLE_NOTE}
      </span>
    </span>
  );
}

export function ProofNumbers() {
  return (
    <dl className="proof-register overflow-hidden border-y border-paper/20">
      {PROOF_ROWS.map(({ figure, label }, i) => (
        <div
          key={figure}
          className="grid grid-cols-1 gap-x-8 gap-y-4 border-b border-paper/15 py-9 last:border-b-0 md:grid-cols-[minmax(0,auto)_1fr] md:items-end md:gap-x-12 md:py-11"
        >
          <dt>
            <span className="block whitespace-nowrap font-mono text-6xl font-medium leading-[0.85] tracking-tight text-paper md:text-8xl lg:text-9xl">
              {figure}
            </span>
          </dt>
          <dd className="max-w-[28ch] border-l border-paper/20 pl-4 text-lg leading-relaxed text-paper/75 sm:text-xl md:mb-2">
            {label}
            {i === 1 && (
              <span className="mt-4 block">
                <TickStrip />
              </span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
