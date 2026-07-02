// The Bidframe lockup: a friendlier forest owl plus the Fraunces wordmark,
// rendered inline so it inherits the page's loaded Fraunces and costs no extra
// request. The owl keeps the original mascot idea, but uses rounder geometry
// and forest as brand furniture instead of signal colour.
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
      <path d="M21 18L27.5 23.5L18 25Z" fill="#211d17" />
      <path d="M43 18L36.5 23.5L46 25Z" fill="#211d17" />
      <path
        d="M32 16C21.5 16 16.5 24.4 16.5 34.2C16.5 45.3 23.3 51 32 51C40.7 51 47.5 45.3 47.5 34.2C47.5 24.4 42.5 16 32 16Z"
        fill="#211d17"
      />
      <path
        d="M22.4 37.5C24.6 44 28.5 47.2 32 47.2C35.5 47.2 39.4 44 41.6 37.5C38.4 39.2 35.1 40 32 40C28.9 40 25.6 39.2 22.4 37.5Z"
        fill="#2c5640"
      />
      <path
        d="M21.8 31.2C21.8 26.9 24.8 23.9 28.5 23.9C30 23.9 31.2 24.3 32 25.1C32.8 24.3 34 23.9 35.5 23.9C39.2 23.9 42.2 26.9 42.2 31.2C42.2 35.1 39.4 37.9 35.7 37.9C34.1 37.9 32.8 37.4 32 36.5C31.2 37.4 29.9 37.9 28.3 37.9C24.6 37.9 21.8 35.1 21.8 31.2Z"
        fill="#f6f2e9"
      />
      <circle cx="27.2" cy="31.2" r="2.5" fill="#211d17" />
      <circle cx="36.8" cy="31.2" r="2.5" fill="#211d17" />
      <circle cx="28.1" cy="30.2" r="0.8" fill="#f6f2e9" />
      <circle cx="37.7" cy="30.2" r="0.8" fill="#f6f2e9" />
      <path d="M32 35.1L35 38.8H29Z" fill="#2c5640" />
      <path
        d="M24 43.5C26.2 45.8 28.8 47 32 47C35.2 47 37.8 45.8 40 43.5"
        stroke="#f6f2e9"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.85"
      />
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
