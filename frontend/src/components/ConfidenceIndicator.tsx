// The confidence indicator (DESIGN-SYSTEM section 4, axis 1). Four tiers, worst
// to best, carried in greyscale by a fill LEVEL and by a hue, never a number.
//
// The level reads as an instrument, not a dot: a 4-segment meter that fills to
// the tier, so "how sure" is legible at a glance and in greyscale (the count of
// lit segments carries it, the hue only reinforces). The bottom tier is the one
// exception: "can't answer this" is an ALARM, not the empty end of a ramp, so it
// takes a distinct SHAPE, an oxblood warning mark, rather than an empty meter
// that would read as "low battery". Shape (not hue) separates the alarm, so it
// still stops the eye with colour switched off. Shared everywhere: the matrix,
// the spine, the panel, and the hero (which renders the real matrix). The word
// beside it uses the fixed four-tier lexicon (copywriting.md).

type ConfidenceTier = "oxblood" | "amber" | "yellow" | "light-green";

const TIER_WORD: Record<ConfidenceTier, string> = {
  oxblood: "Can't answer this",
  amber: "Low confidence",
  yellow: "Fairly sure",
  "light-green": "Confident",
};

// The hue for the lit segments (and the alarm mark).
const TIER_HEX: Record<ConfidenceTier, string> = {
  oxblood: "#b42d24",
  amber: "#bc6b2e",
  yellow: "#d2a435",
  "light-green": "#6f9a57",
};

// How many of the four segments light up. The ramp is amber 2, yellow 3,
// confident 4, so the level is honest and greyscale-legible. Oxblood does not
// use the meter at all (it is the alarm shape below), so it has no entry here.
const TIER_SEGMENTS: Record<Exclude<ConfidenceTier, "oxblood">, number> = {
  amber: 2,
  yellow: 3,
  "light-green": 4,
};

// confidence -> tier. An explicit unanswerable case (a gating item with no good
// answer) forces oxblood regardless of the raw number.
function tierOf(confidence: number, unanswerable: boolean): ConfidenceTier {
  if (unanswerable || confidence < 0.4) return "oxblood";
  if (confidence < 0.6) return "amber";
  if (confidence < 0.8) return "yellow";
  return "light-green";
}

// The lit/unlit level meter: four rounded bars, the first `filled` in the tier
// hue, the rest a recessed track. A hairline ink ring keeps every segment
// defined on paper and legible in greyscale.
function LevelMeter({
  filled,
  hex,
  size,
}: {
  filled: number;
  hex: string;
  size: "sm" | "md";
}) {
  const w = size === "sm" ? 4 : 5;
  const h = size === "sm" ? 11 : 13;
  const gap = size === "sm" ? 1.5 : 2;
  return (
    <span className="inline-flex items-end" style={{ gap }} aria-hidden>
      {[0, 1, 2, 3].map((i) => {
        const lit = i < filled;
        return (
          <span
            key={i}
            style={{
              width: w,
              height: h,
              borderRadius: 2,
              background: lit
                ? `linear-gradient(to top, ${hex}, color-mix(in oklab, ${hex} 82%, white))`
                : "var(--paper-recessed)",
              boxShadow: lit
                ? "0 0 0 0.5px rgba(33,29,23,0.45), inset 0 1px 0.5px rgba(255,255,255,0.4)"
                : "0 0 0 0.5px rgba(33,29,23,0.16)",
            }}
          />
        );
      })}
    </span>
  );
}

// The alarm mark: an oxblood warning triangle carrying a paper "!". A distinct
// SHAPE (never confused with a full meter), so "can't answer this" reads as
// stop-and-look at a glance and with colour switched off.
function AlarmMark({ hex, size }: { hex: string; size: "sm" | "md" }) {
  const s = size === "sm" ? 15 : 18;
  return (
    <svg width={s} height={s} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 2.4 18.4 17 H1.6 Z"
        fill={hex}
        stroke="rgba(33,29,23,0.5)"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <rect x="9.1" y="7.4" width="1.8" height="5" rx="0.9" fill="var(--paper)" />
      <circle cx="10" cy="14.6" r="1.05" fill="var(--paper)" />
    </svg>
  );
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

  const glyph =
    tier === "oxblood" ? (
      <AlarmMark hex={hex} size={size} />
    ) : (
      <LevelMeter filled={TIER_SEGMENTS[tier]} hex={hex} size={size} />
    );

  if (variant === "dot") {
    return (
      <span
        className="inline-flex items-center"
        title={word}
        aria-label={word}
        role="img"
      >
        {glyph}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2.5 text-sm text-ink-muted">
      {glyph}
      <span>{word}</span>
    </span>
  );
}
