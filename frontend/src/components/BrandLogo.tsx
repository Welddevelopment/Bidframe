// The Bidframe lockup: a crisp clause frame plus the Fraunces wordmark,
// rendered inline so it inherits the page's loaded Fraunces and costs no extra
// request.
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
      <circle cx="32" cy="32" r="29.5" fill={reversed ? "#f6f2e9" : "#fbf8f1"} />
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
      <path
        stroke="#211d17"
        strokeWidth="3.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        d="M19 28V19H29M35 19H45V29M19 36V45H29M45 36V45H35"
      />
      <path
        stroke="#211d17"
        strokeWidth="2.5"
        strokeLinecap="square"
        d="M23 31H34M23 37H39"
      />
      <text
        x="78"
        y="44"
        fontFamily="var(--font-head), Fraunces, Georgia, serif"
        fontWeight="600"
        fontSize="40"
        letterSpacing="0"
        fill={reversed ? "#f6f2e9" : "#211d17"}
      >
        Bidframe
      </text>
    </svg>
  );
}
