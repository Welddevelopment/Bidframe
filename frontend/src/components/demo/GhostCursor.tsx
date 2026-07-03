"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

type GhostCursorProps = {
  beat: MotionValue<number>;
};

function PressRing({
  beat,
  at,
}: {
  beat: MotionValue<number>;
  at: number;
}) {
  const opacity = useTransform(
    beat,
    [at - 0.08, at, at + 0.14, at + 0.28],
    [0, 0.55, 0.18, 0],
  );
  const scale = useTransform(
    beat,
    [at - 0.08, at + 0.28],
    [0.36, 1.9],
  );

  return (
    <motion.span
      aria-hidden
      className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/60"
      style={{ opacity, scale }}
    />
  );
}

export function GhostCursor({ beat }: GhostCursorProps) {
  const opacity = useTransform(
    beat,
    [1.58, 1.7, 2.34, 2.5, 3.88, 4, 5.24, 5.42],
    [0, 1, 1, 0, 0, 1, 1, 0],
  );
  const left = useTransform(
    beat,
    [1.58, 1.98, 2.28, 3.88, 4.28, 4.9, 5.18, 5.42],
    ["66%", "55%", "50%", "70%", "80%", "48%", "40%", "38%"],
  );
  const top = useTransform(
    beat,
    [1.58, 1.98, 2.28, 3.88, 4.28, 4.9, 5.18, 5.42],
    ["62%", "49%", "39%", "58%", "35%", "68%", "69%", "70%"],
  );
  const scale = useTransform(
    beat,
    [1.86, 2, 2.14, 4.18, 4.32, 4.46, 4.84, 4.98, 5.12],
    [1, 0.82, 1, 1, 0.82, 1, 1, 0.82, 1],
  );

  return (
    <motion.div
      aria-hidden
      data-demo-ghost-cursor
      className="pointer-events-none absolute z-[60]"
      style={{ left, top, opacity, scale }}
    >
      <PressRing beat={beat} at={2} />
      <PressRing beat={beat} at={4.32} />
      <PressRing beat={beat} at={4.98} />
      <span className="absolute left-0 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-paper bg-accent shadow-[0_0_0_3px_rgba(47,93,99,0.16),0_5px_18px_rgba(33,29,23,0.22)]" />
      <span className="absolute left-1 top-1 h-8 w-px origin-top -rotate-45 bg-accent/70" />
    </motion.div>
  );
}
