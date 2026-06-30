// The Bidframe lockup (brand kit lives in frontend/public/brand). The owl mark
// held in a paper disc + the Fraunces wordmark, rendered inline so it inherits
// the page's loaded Fraunces and costs no extra request. `reversed` drops the
// ink disc keyline and knocks the wordmark out in paper for dark grounds.
export function BrandLogo({
  reversed = false,
  className = "",
}: {
  reversed?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 292 64"
      className={className}
      role="img"
      aria-label="Bidframe"
      fill="none"
    >
      <title>Bidframe</title>
      <circle cx="32" cy="32" r="29.5" fill="#f6f2e9" />
      {!reversed && (
        <circle
          cx="32"
          cy="32"
          r="29.5"
          fill="none"
          stroke="#211d17"
          strokeWidth="2.2"
        />
      )}
      <path d="M21 16L27 24L16 23Z" fill="#211d17" />
      <path d="M43 16L37 24L48 23Z" fill="#211d17" />
      <path
        d="M32 15C21 15 16 25 16 35C16 46 23 51 32 51C41 51 48 46 48 35C48 25 43 15 32 15Z"
        fill="#211d17"
      />
      <circle cx="25.5" cy="31" r="6" fill="#f6f2e9" />
      <circle cx="38.5" cy="31" r="6" fill="#f6f2e9" />
      <circle cx="25.5" cy="31" r="2.5" fill="#211d17" />
      <circle cx="38.5" cy="31" r="3" fill="#8a2d2a" />
      <path d="M32 35L35 39.5H29Z" fill="#d2a435" />
      <text
        x="78"
        y="44"
        fontFamily="var(--font-head), Fraunces, Georgia, serif"
        fontWeight="600"
        fontSize="40"
        letterSpacing="-0.8"
        fill={reversed ? "#f6f2e9" : "#211d17"}
      >
        Bidframe
      </text>
    </svg>
  );
}
