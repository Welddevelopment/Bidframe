"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

// The light descent (the journey's connective tissue): wraps the landing's
// mid-page run of feature sections and adds two scroll-linked layers at
// >=1024px when motion is allowed —
//   1. an ambient dusk: a fixed, bottom-weighted dark wash whose opacity rises
//      gently with page progress (capped at 0.14 so paper-band text stays AA),
//      so scrolling toward the pine bands reads as light falling; and
//   2. the trail: an engraved S-curve in the left gutter (xl only) that draws
//      itself with scroll progress through the section run, with a waypoint
//      blaze lighting up as the walker passes each feature.
// Both are decorative (aria-hidden, pointer-events-none) and fully unmounted
// on mobile, touch, reduced motion, SSR, and no-JS — the children render
// identically either way.

const ENHANCE_QUERY = "(min-width: 1024px)";
const MOTION_OK_QUERY = "(prefers-reduced-motion: no-preference)";

// One gentle S-curve down the gutter. Drawn with vector-effect so the stroke
// stays crisp under preserveAspectRatio="none".
const TRAIL_PATH =
  "M50 0 C 26 70, 74 140, 50 210 C 26 280, 74 350, 50 420 C 26 490, 74 560, 50 630 C 26 700, 74 770, 50 840 C 32 910, 62 960, 50 1000";

// Waypoint fractions: one blaze per feature section, spaced down the run.
const BLAZES = [0.08, 0.28, 0.48, 0.68, 0.88];

function Blaze({
  progress,
  at,
}: {
  progress: MotionValue<number>;
  at: number;
}) {
  const opacity = useTransform(progress, [at - 0.05, at + 0.01], [0.2, 1]);
  return (
    <motion.span
      className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border border-forest/70 bg-paper"
      style={{ top: `${at * 100}%`, opacity }}
    />
  );
}

export function TrailDescent({ children }: { children: React.ReactNode }) {
  const regionRef = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const queries = [
      window.matchMedia(ENHANCE_QUERY),
      window.matchMedia(MOTION_OK_QUERY),
    ];
    const update = () => setEnhanced(queries.every((q) => q.matches));
    update();
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);

  // Page progress drives the dusk; region progress drives the trail.
  const { scrollYProgress: pageProgress } = useScroll();
  const duskOpacity = useTransform(
    pageProgress,
    [0, 0.75, 1],
    [0, 0.1, 0.14],
  );
  const { scrollYProgress: regionProgress } = useScroll({
    target: regionRef,
    offset: ["start 0.7", "end 0.6"],
  });
  const trailProgress = useSpring(regionProgress, {
    stiffness: 90,
    damping: 30,
  });

  return (
    <div ref={regionRef} className="relative">
      {enhanced && (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-40"
            style={{
              opacity: duskOpacity,
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(6, 18, 11, 0.5) 60%, rgba(6, 18, 11, 1) 100%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 hidden w-16 xl:block"
            style={{ left: "max(0.75rem, calc(50% - 660px))" }}
          >
            <svg
              className="absolute inset-0 h-full w-full text-forest"
              viewBox="0 0 100 1000"
              preserveAspectRatio="none"
              fill="none"
            >
              {/* the faint full route, then the walked portion drawing over it */}
              <path
                d={TRAIL_PATH}
                stroke="currentColor"
                strokeOpacity="0.12"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                vectorEffect="non-scaling-stroke"
              />
              <motion.path
                d={TRAIL_PATH}
                stroke="currentColor"
                strokeOpacity="0.45"
                strokeWidth="1.5"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ pathLength: trailProgress }}
              />
            </svg>
            {BLAZES.map((at) => (
              <Blaze key={at} progress={trailProgress} at={at} />
            ))}
          </div>
        </>
      )}
      {children}
    </div>
  );
}
