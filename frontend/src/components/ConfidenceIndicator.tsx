// The confidence bead (DESIGN-SYSTEM section 4, axis 1). Four tiers, worst to
// best, carried in greyscale by a fill LEVEL and by a hue, never a number. The
// bead is dimensional: a glossy leveled fill, a 1px ink ring, a soft drop shadow
// (the `.conf-dot` material in globals.css), so the status system draws the eye
// it earns. Shared everywhere, so it lands in the matrix, the spine, the panel,
// and the hero (which renders the real matrix). The word beside it uses the
// fixed four-tier lexicon (copywriting.md).

type ConfidenceTier = "oxblood" | "amber" | "yellow" | "light-green";

const TIER_WORD: Record<ConfidenceTier, string> = {
  oxblood: "Can't answer this",
  amber: "Low confidence",
  yellow: "Fairly sure",
  "light-green": "Confident",
};

// The hue (for the leveled gradient fill) and the fill level that keeps each
// tier legible with colour switched off (the SLOP-CHECK greyscale test).
const TIER_HEX: Record<ConfidenceTier, string> = {
  oxblood: "#b42d24",
  amber: "#bc6b2e",
  yellow: "#d2a435",
  "light-green": "#6f9a57",
};

// Fill level keeps each tier legible with colour switched off (the SLOP-CHECK
// greyscale test). Oxblood is the exception: it is a full-fill ALARM state, not
// the bottom of a ramp — a low fill read as a "low battery". It is distinguished
// from the (also full) light-green by its bold "!" glyph and its word, so no
// tier relies on colour alone.
const TIER_FILL: Record<ConfidenceTier, number> = {
  oxblood: 100,
  amber: 52,
  yellow: 76,
  "light-green": 100,
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
  size = "md",
}: {
  confidence: number;
  needsReview?: boolean;
  unanswerable?: boolean;
  variant?: "dot" | "word";
  size?: "sm" | "md";
}) {
  // needs_review never reads better than amber: a flagged-for-review item is at
  // most a rough draft.
  const rawTier = tierOf(confidence, unanswerable);
  const tier: ConfidenceTier =
    needsReview && (rawTier === "yellow" || rawTier === "light-green")
      ? "amber"
      : rawTier;

  const word = TIER_WORD[tier];
  const hex = TIER_HEX[tier];
  const fill = TIER_FILL[tier];
  const px = size === "sm" ? 14 : 20;

  // Oxblood is the one alarm tier: a full, saturated bead carrying a bold paper
  // "!" so it reads as STOP-and-look at dot size and in greyscale (the glyph,
  // not the hue, carries it). Every other tier is a plain leveled bead.
  const isAlarm = tier === "oxblood";
  const dot = (
    <span
      className="conf-dot inline-flex shrink-0 items-center justify-center"
      aria-hidden
      style={{
        width: px,
        height: px,
        background: `linear-gradient(to top, ${hex} 0%, ${hex} ${fill}%, var(--paper-recessed) ${fill}%, var(--paper-recessed) 100%)`,
      }}
    >
      {isAlarm && (
        <span
          style={{
            color: "var(--paper)",
            fontWeight: 700,
            fontSize: Math.round(px * 0.62),
            lineHeight: 1,
          }}
        >
          !
        </span>
      )}
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
    <span className="inline-flex items-center gap-2.5 text-sm text-ink-muted">
      {dot}
      <span>{word}</span>
    </span>
  );
}
