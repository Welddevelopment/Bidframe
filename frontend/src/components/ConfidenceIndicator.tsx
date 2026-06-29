// The confidence dot (DESIGN-SYSTEM section 4, axis 1). Four tiers, worst to
// best, carried in greyscale by a fill level and a 1px ink ring, and by a hue.
// The word beside it uses the fixed four-tier lexicon (copywriting.md), never a
// number. Two renders: a compact dot-only for the matrix left cell, and a
// dot+word for the spine and panel.

type ConfidenceTier = "oxblood" | "amber" | "yellow" | "light-green";

const TIER_WORD: Record<ConfidenceTier, string> = {
  oxblood: "Can't answer this",
  amber: "Low confidence",
  yellow: "Fairly sure",
  "light-green": "Confident",
};

const TIER_HUE: Record<ConfidenceTier, string> = {
  oxblood: "bg-signal-oxblood",
  amber: "bg-signal-amber",
  yellow: "bg-signal-yellow",
  "light-green": "bg-signal-light-green",
};

// How full the dot reads, so the tier survives the greyscale test.
const TIER_FILL: Record<ConfidenceTier, string> = {
  oxblood: "25%",
  amber: "50%",
  yellow: "75%",
  "light-green": "100%",
};

// confidence -> tier. An explicit unanswerable case (a gating item with no good
// answer) forces oxblood regardless of the raw number.
function tierOf(confidence: number, unanswerable: boolean): ConfidenceTier {
  if (unanswerable || confidence < 0.4) return "oxblood";
  if (confidence < 0.6) return "amber";
  if (confidence < 0.8) return "yellow";
  return "light-green";
}

export function ConfidenceIndicator({
  confidence,
  needsReview = false,
  unanswerable = false,
  variant = "word",
}: {
  confidence: number;
  needsReview?: boolean;
  unanswerable?: boolean;
  variant?: "dot" | "word";
}) {
  // needs_review never reads better than amber: a flagged-for-review item is at
  // most a rough draft.
  const rawTier = tierOf(confidence, unanswerable);
  const tier: ConfidenceTier =
    needsReview && (rawTier === "yellow" || rawTier === "light-green")
      ? "amber"
      : rawTier;

  const word = TIER_WORD[tier];

  const dot = (
    <span
      className="relative inline-block h-2.5 w-2.5 shrink-0 overflow-hidden rounded-full ring-1 ring-inset ring-ink/70"
      aria-hidden
    >
      <span
        className={`absolute inset-x-0 bottom-0 ${TIER_HUE[tier]}`}
        style={{ height: TIER_FILL[tier] }}
      />
    </span>
  );

  if (variant === "dot") {
    return (
      <span
        className="inline-flex items-center"
        title={word}
        aria-label={word}
        role="img"
      >
        {dot}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink-muted">
      {dot}
      <span>{word}</span>
    </span>
  );
}
