"use client";

import { useEffect, useRef, useState } from "react";
import { STEPS, type Step } from "./steps";
import { BeatVisual, ScrollyStage } from "./ScrollyStage";
import { ScrollyRail } from "./ScrollyRail";
import { useBeatStep, useScrollTimeline } from "./useScrollTimeline";
import { BookDemoButton } from "@/components/landing/BookDemoButton";

// The cinematic scroll for /demo: a pinned "stage" that transforms through the
// pipeline while the narrative steps scroll past. Wide, motion-allowed viewports
// use a scroll-scrubbed motion timeline; mobile and reduced motion keep the
// readable stacked renderer.
//
// Accessible + robust by construction, the Reveal.tsx way: the markup renders
// the readable STACKED fallback by default (SSR, no-JS, reduced motion, and
// mobile all get it). Only on the client, and only when the viewport is wide
// AND motion is allowed, do we ENHANCE into the pinned split. That one flag also
// covers both required fallbacks (mobile < lg OR reduced motion) with a single
// stacked renderer. The stage is illustrative (aria-hidden); the narrative copy
// is the a11y source of truth.

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// The narrative beat: a mono kicker, a Fraunces heading, one or two sentences.
// In the pinned path the inactive steps dim so the active one reads; in the
// stacked fallback every step reads at full strength.
function StepCopy({ step, active }: { step: Step; active: boolean }) {
  return (
    <div
      className={`max-w-[40ch] transition-opacity duration-500 ${EASE} ${
        active ? "opacity-100" : "opacity-40"
      }`}
    >
      <p
        className={`font-mono text-xs uppercase tracking-wide transition-colors duration-500 ${
          active ? "text-forest" : "text-ink-muted"
        }`}
      >
        {step.kicker}
      </p>
      <h2 className="mt-3 font-serif text-3xl font-semibold leading-snug tracking-tight text-ink sm:text-4xl">
        {step.heading}
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-ink-muted">{step.body}</p>
    </div>
  );
}

// The quiet close of the scroll story. The page's real proof (the worked
// example on a genuine tender) sits directly below, so this is a bridge, not
// the destination: the copy hands the reader down the page, and the CTA
// demotes to a link so the page keeps one primary action further on.
function ClosingCta() {
  return (
    <div className="mt-20 flex flex-col items-center gap-5 border-t border-hairline pt-12 text-center">
      <p className="max-w-[42ch] text-lg leading-relaxed text-ink-muted">
        That is the whole pipeline. Below, the same pipeline on a real 13-page
        tender.
      </p>
      <BookDemoButton location="demo-scrolly-closing" variant="link" />
    </div>
  );
}

// `intro` is the page's opening copy, owned by the page and passed in so the
// scrolly can fold it into the layout: in the enhanced path it becomes the
// first block of the narrative column (so the pinned stage is on screen from
// the very first scroll pixel, with no dead viewport between the intro and the
// story); in the stacked fallback it simply renders above the steps. It is NOT
// a [data-step], so the observer and the rail ignore it.
export function DemoScrolly({ intro }: { intro?: React.ReactNode }) {
  const [activeStep, setActiveStep] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const { beat } = useScrollTimeline(narrativeRef, STEPS.length);

  // Decide whether to enhance: wide viewport AND motion allowed. Read on the
  // client only, and keep it live so resizing or toggling reduced motion in
  // dev switches paths cleanly.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const sync = () => setEnhanced(wide.matches && motion.matches);
    sync();
    wide.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  // The continuous beat drives the stage. The rounded beat still powers the
  // rail and the existing one-shot details, so the old CSS choreography remains
  // useful without controlling the film.
  useBeatStep(beat, enhanced, STEPS.length, setActiveStep);

  // Fallback (default / mobile / reduced motion): steps in normal flow, each
  // followed by its own beat visual in its composed final state. No pinning,
  // no observer, reads perfectly with zero motion.
  if (!enhanced) {
    return (
      <div className="mx-auto max-w-[40rem] px-6 py-8">
        {intro ? <div className="mb-16">{intro}</div> : null}
        <ol className="flex flex-col gap-16">
          {STEPS.map((step, i) => (
            <li key={step.id}>
              <StepCopy step={step} active />
              <div className="mt-6 flex justify-center" aria-hidden inert>
                <BeatVisual step={i} />
              </div>
            </li>
          ))}
        </ol>
        <ClosingCta />
      </div>
    );
  }

  // Enhanced (wide + motion): a split layout. Tall narrative steps scroll in
  // the middle; the stage stays pinned and centred on the right, transforming
  // as the active step changes. At xl a third, leftmost column appears: the
  // progress rail, pinned like the stage. Below xl the rail is display:none,
  // so the grid collapses back to the two-column split.
  return (
    <div className="mx-auto max-w-[1160px] px-6">
      <div className="grid grid-cols-[minmax(18rem,24rem)_1fr] gap-12 xl:grid-cols-[8.5rem_minmax(18rem,22rem)_1fr] xl:gap-16">
        <div className="hidden xl:block">
          <div className="sticky top-0 flex h-screen items-center">
            <ScrollyRail active={activeStep} />
          </div>
        </div>
        <div ref={narrativeRef} className="relative">
          {intro ? (
            <div className="flex min-h-[calc(100vh-8rem)] flex-col justify-center">
              {intro}
            </div>
          ) : null}
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              data-step={i}
              className="flex min-h-[80vh] flex-col justify-center py-12"
            >
              <StepCopy step={step} active={i === activeStep} />
            </div>
          ))}
        </div>
        <div>
          <div className="sticky top-0 flex h-screen items-center justify-center">
            <ScrollyStage step={activeStep} beat={beat} />
          </div>
        </div>
      </div>
      <ClosingCta />
    </div>
  );
}
