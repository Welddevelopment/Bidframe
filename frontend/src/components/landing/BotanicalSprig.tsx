// A botanical laurel sprig in line-art, used to frame the hero and the tilted
// product sheet (a quiet civic-document note against the warm paper, picking up
// the forest brand). An upright central stem with mirrored lanceolate leaves and
// a terminal bud, engraving-style: thin, balanced, deliberate. Purely decorative,
// so it is aria-hidden; colour comes from the parent via currentColor, position
// and opacity from the className. Every path carries pathLength={1} so DrawOn
// can animate it with the other engraved botanical marks.

export function BotanicalSprig({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      className={`art-lines ${className}`}
    >
      <g
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* central stem, rising from the base to the terminal bud */}
        <path pathLength={1} d="M40 76C39 58 41 40 40 24 39.6 20 40 17 40 14" />

        {/* leaf pairs, base to tip; faint fill gives the engraved leaves body */}
        <g fill="currentColor" fillOpacity="0.08">
          <path pathLength={1} d="M40 58C33 59 27 54 24 47 31 45 37 50 40 58Z" />
          <path pathLength={1} d="M40 58C47 59 53 54 56 47 49 45 43 50 40 58Z" />
          <path pathLength={1} d="M40 46C33 47 27 42 24 35 31 33 37 38 40 46Z" />
          <path pathLength={1} d="M40 46C47 47 53 42 56 35 49 33 43 38 40 46Z" />
          <path pathLength={1} d="M40 34C34 35 29 31 26 25 32 23 37 27 40 34Z" />
          <path pathLength={1} d="M40 34C46 35 51 31 54 25 48 23 43 27 40 34Z" />
        </g>

        {/* leaf veins */}
        <path pathLength={1} d="M40 58 28 49" />
        <path pathLength={1} d="M40 58 52 49" />
        <path pathLength={1} d="M40 46 28 37" />
        <path pathLength={1} d="M40 46 52 37" />
        <path pathLength={1} d="M40 34 29 27" />
        <path pathLength={1} d="M40 34 51 27" />

        {/* terminal bud */}
        <path
          pathLength={1}
          d="M40 14C36 11 36 8 40 5 44 8 44 11 40 14Z"
          fill="currentColor"
          fillOpacity="0.08"
        />
      </g>
    </svg>
  );
}
