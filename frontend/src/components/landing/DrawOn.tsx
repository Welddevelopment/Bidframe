"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll, useSpring } from "motion/react";

// The engraving counterpart to Reveal: instead of settling content into place,
// it lets the botanical line art below the fold draw itself in as you arrive,
// the way an engraver's stroke crosses the plate. The globals.css draw-on rules
// key off data-draw and the pathLength={1} every art path carries, so a single
// dasharray transition covers all of the sanctioned illustrations.
//
// Accessible by construction: the markup renders with no draw state, so SSR,
// no-JS, and reduced-motion all show the finished engraving. Only on the
// client, and only when motion is allowed, does it arm the hidden start state
// (imperatively, via the ref) and then draw on intersection. Most instances
// fire once, then disconnect. Small section marks can opt into scroll mode,
// where the same pathLength strokes scrub with scroll progress.

type DrawMode = "enter" | "scroll";

function writeScrollVars(el: HTMLElement, value: number) {
  const progress = Math.max(0, Math.min(1, value));
  const fill = Math.max(0, (progress - 0.55) / 0.45) * 0.08;

  el.style.setProperty("--draw-progress", progress.toFixed(3));
  el.style.setProperty("--draw-fill", fill.toFixed(3));
  el.style.setProperty("--draw-opacity", (0.35 + progress * 0.65).toFixed(3));
  el.style.setProperty("--draw-y", `${((1 - progress) * 10).toFixed(2)}px`);
  el.style.setProperty("--draw-rotate", `${((1 - progress) * -3).toFixed(2)}deg`);
  el.style.setProperty("--draw-scale", (0.96 + progress * 0.04).toFixed(3));
}

export function DrawOn({
  children,
  delay = 0,
  className = "",
  mode = "enter",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  mode?: DrawMode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 88%", "center 42%"],
  });
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
  });

  useMotionValueEvent(scrollProgress, "change", (latest) => {
    const el = ref.current;
    if (!el || mode !== "scroll" || el.dataset.draw !== "scroll") return;
    writeScrollVars(el, latest);
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (mode === "scroll") {
      el.dataset.draw = "scroll";
      writeScrollVars(el, scrollProgress.get());
      return () => {
        delete el.dataset.draw;
      };
    }

    el.dataset.draw = "hidden";
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.draw = "shown";
            obs.disconnect();
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode, scrollProgress]);

  return (
    <div
      ref={ref}
      style={{ "--draw-delay": `${delay}ms` } as React.CSSProperties}
      className={className}
    >
      <span className="draw-on__inner">{children}</span>
    </div>
  );
}
