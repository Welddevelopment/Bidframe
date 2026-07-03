"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { STEPS } from "./steps";

type TrailRailProps = {
  active: number;
  beat: MotionValue<number>;
};

const TRAIL_PATH =
  "M18 14 C44 58, 8 92, 26 136 C48 190, 8 214, 20 268 C34 322, 50 348, 24 394 C8 424, 18 462, 42 494";

const STOPS = [
  { x: 18, y: 14 },
  { x: 28, y: 96 },
  { x: 24, y: 176 },
  { x: 18, y: 256 },
  { x: 28, y: 336 },
  { x: 24, y: 416 },
  { x: 42, y: 494 },
] as const;

const STEP_INPUT = STEPS.map((_, i) => i);
const STOP_X = STOPS.map((stop) => stop.x);
const STOP_Y = STOPS.map((stop) => stop.y);

function scrollToStep(index: number) {
  document
    .querySelector(`[data-step="${index}"]`)
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function TrailRail({ active, beat }: TrailRailProps) {
  const progress = useTransform(beat, [0, STEPS.length - 1], [0, 1], {
    clamp: true,
  });
  const walkerX = useTransform(beat, STEP_INPUT, STOP_X, { clamp: true });
  const walkerY = useTransform(beat, STEP_INPUT, STOP_Y, { clamp: true });

  return (
    <nav
      aria-label="Story trail"
      className="relative h-[min(72vh,44rem)] min-h-[34rem] w-full text-forest"
    >
      <p className="mb-4 font-mono text-[10px] uppercase tracking-wide text-ink-muted">
        Tender trail
      </p>
      <div className="absolute inset-x-0 bottom-0 top-8">
        <svg
          aria-hidden
          className="absolute inset-y-0 left-0 h-full w-full overflow-visible"
          viewBox="0 0 100 508"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d={TRAIL_PATH}
            stroke="currentColor"
            strokeDasharray="5 7"
            strokeOpacity="0.18"
            strokeWidth="1.8"
            vectorEffect="non-scaling-stroke"
          />
          <motion.path
            d={TRAIL_PATH}
            stroke="currentColor"
            strokeLinecap="round"
            strokeOpacity="0.62"
            strokeWidth="2.2"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: progress }}
          />
          <motion.circle
            className="drop-shadow-sm"
            cx="18"
            cy="14"
            r="3.6"
            fill="currentColor"
            style={{ cx: walkerX, cy: walkerY }}
          />
        </svg>

        <ol>
          {STEPS.map((step, i) => {
            const current = i === active;
            const passed = i < active;
            const stop = STOPS[i];
            return (
              <li key={step.id}>
                <button
                  type="button"
                  aria-current={current ? "step" : undefined}
                  onClick={() => scrollToStep(i)}
                  className="group absolute flex items-center gap-2 text-left"
                  style={{
                    left: `${stop.x}%`,
                    top: `${(stop.y / 508) * 100}%`,
                  }}
                >
                  <span
                    aria-hidden
                    className={`h-3 w-3 shrink-0 rotate-45 border transition-all duration-300 ${
                      current
                        ? "scale-125 border-forest bg-forest shadow-[0_0_0_5px_rgba(45,83,56,0.12)]"
                        : passed
                          ? "border-forest bg-paper-raised"
                          : "border-hairline bg-paper"
                    }`}
                  />
                  <span
                    className={`w-[5.6rem] font-mono text-[9.5px] uppercase leading-tight tracking-wide transition-colors duration-300 ${
                      current
                        ? "text-forest"
                        : "text-ink-muted/60 group-hover:text-ink-muted"
                    }`}
                  >
                    {step.kicker}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
