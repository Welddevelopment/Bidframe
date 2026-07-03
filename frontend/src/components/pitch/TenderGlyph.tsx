"use client";

// The story object: one tender page, carried through the whole walk. It sits
// in the same spot on every main slide and its contents transform with the
// story — a PDF page, then a scan line reading it, then the killing clause,
// then matrix rows, then an evidence receipt, then graph structure, and
// finally the sealed record. All stages stay in the SVG and crossfade, so the
// audience watches one object change rather than seven icons swap.

export type TenderStage =
  | "pdf"
  | "read"
  | "clause"
  | "matrix"
  | "receipt"
  | "graph"
  | "seal";

export const TENDER_STAGES: readonly TenderStage[] = [
  "pdf",
  "read",
  "clause",
  "matrix",
  "receipt",
  "graph",
  "seal",
];

export const TENDER_STAGE_LABELS: Record<TenderStage, string> = {
  pdf: "the tender pack",
  read: "the first read",
  clause: "the clause",
  matrix: "the matrix",
  receipt: "the receipt",
  graph: "the structure",
  seal: "the record",
};

const OX = "#b42d24";
const AMBER = "#d2a435";
const GREEN = "#6f9a57";

function Lines({ dim = false }: { dim?: boolean }) {
  return (
    <g stroke="currentColor" strokeWidth="2" opacity={dim ? 0.35 : 0.7}>
      <path d="M12 18h18" />
      <path d="M12 26h24" />
      <path d="M12 34h21" />
      <path d="M12 42h24" />
    </g>
  );
}

export function TenderGlyph({
  stage,
  className = "",
}: {
  stage: TenderStage;
  className?: string;
}) {
  const on = (s: TenderStage) => (stage === s ? "is-on" : "");
  return (
    <svg
      viewBox="0 0 48 60"
      fill="none"
      aria-hidden="true"
      className={`pitch-glyph ${className}`}
    >
      {/* the page itself: the continuity */}
      <path
        d="M6 3h26l10 10v44H6z"
        stroke="currentColor"
        strokeWidth="2.4"
        fill="rgba(6, 18, 11, 0.35)"
      />
      <path d="M32 3v10h10" stroke="currentColor" strokeWidth="2.4" />

      <g className={`pitch-glyph__stage ${on("pdf")}`}>
        <Lines />
      </g>

      <g className={`pitch-glyph__stage ${on("read")}`}>
        <Lines />
        <rect x="9" y="22" width="30" height="8" fill={AMBER} opacity="0.4" />
        <path d="M9 30h30" stroke={AMBER} strokeWidth="2" />
      </g>

      <g className={`pitch-glyph__stage ${on("clause")}`}>
        <Lines dim />
        <rect x="9" y="30" width="27" height="8" fill={OX} opacity="0.5" />
        <path d="M12 34h21" stroke="#f6f2e9" strokeWidth="2" />
      </g>

      <g className={`pitch-glyph__stage ${on("matrix")}`}>
        <g stroke="currentColor" strokeWidth="2">
          <rect x="11" y="16" width="6" height="6" />
          <path d="M21 19h15" />
          <rect x="11" y="28" width="6" height="6" stroke={OX} />
          <path d="M21 31h12" stroke={OX} />
          <rect x="11" y="40" width="6" height="6" />
          <path d="M21 43h15" />
        </g>
      </g>

      <g className={`pitch-glyph__stage ${on("receipt")}`}>
        <Lines dim />
        <circle cx="31" cy="40" r="9" stroke={GREEN} strokeWidth="2.4" />
        <path
          d="m26.5 40 3.2 3.2 5.4-6.4"
          stroke={GREEN}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <g className={`pitch-glyph__stage ${on("graph")}`}>
        <g stroke="currentColor" strokeWidth="1.8">
          <path d="M15 20 24 32l9-12M24 32v14" />
        </g>
        <circle cx="15" cy="19" r="4" fill="currentColor" />
        <circle cx="33" cy="19" r="4" fill={OX} />
        <circle cx="24" cy="32" r="4.6" fill="currentColor" />
        <circle cx="24" cy="47" r="4" fill={GREEN} />
      </g>

      <g className={`pitch-glyph__stage ${on("seal")}`}>
        <Lines dim />
        <rect
          x="17.5"
          y="26.5"
          width="13"
          height="13"
          transform="rotate(45 24 33)"
          stroke={AMBER}
          strokeWidth="2.2"
          fill="rgba(6, 18, 11, 0.5)"
        />
        <path
          d="m20.8 33 2.4 2.4 4-4.8"
          stroke={AMBER}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
