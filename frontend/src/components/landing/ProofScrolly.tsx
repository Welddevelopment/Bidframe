"use client";

import { useEffect, useRef, useState } from "react";

import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Reveal } from "./Reveal";
import {
  PROOF_PROVENANCE,
  PROOF_ROWS,
  ProofNumbers,
  TickStrip,
} from "./ProofNumbers";

// The proof band as the page's climax (DemoScrolly's pattern, in miniature):
// at >=1024px with motion allowed, the band pins for ~2.4 viewports and the
// three register figures present one at a time, poster-scale and centred —
// "Every" types itself on, "18 / 19" tallies up with the page-tick strip
// lighting mark by mark, and "0" lands with the demo's heavy stamp settle.
// Beats are driven by three invisible runway spacers crossing the viewport
// centre (IntersectionObserver, rootMargin -45%/-45%), and each beat remounts
// on activation so its entrance re-fires in both scroll directions.
//
// The default markup — SSR, no-JS, mobile, reduced motion — is the exact
// stacked ledger the band always had (ProofNumbers + the Reveal intro), so
// nothing is lost when the pin never engages. The section behind this must be
// overflow-x-clip, never overflow-hidden, or the sticky pin dies.

const STEP_COUNT = PROOF_ROWS.length;

function ProofIntro({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`proof-band__intro mx-auto w-full max-w-[900px] border-y border-paper/20 text-center ${
        compact ? "py-6" : "py-10"
      }`}
    >
      <h2
        className={`mx-auto text-balance text-center font-serif font-semibold tracking-tight text-paper lg:whitespace-nowrap ${
          compact
            ? "text-3xl leading-tight sm:text-4xl md:text-5xl"
            : "text-4xl leading-[1.02] sm:text-6xl md:text-7xl"
        }`}
      >
        Measured on a real tender
      </h2>
      <p className="mx-auto mt-5 max-w-[58ch] text-balance text-lg leading-relaxed text-paper/[0.72] sm:text-xl">
        We ran Bidframe on a live public-sector cleaning contract and checked
        every line against the source.
      </p>
      <p className="mx-auto mt-5 max-w-[58ch] font-mono text-xs uppercase tracking-[0.14em] text-paper/[0.52]">
        {PROOF_PROVENANCE}
      </p>
    </div>
  );
}

// One poster-scale beat. Mounted fresh on every activation (keyed by step in
// the parent), so the type-on, the count-up (AnimatedNumber from 0), and the
// stamp all fire the moment their beat arrives.
function Beat({ step }: { step: number }) {
  const { label } = PROOF_ROWS[step];
  return (
    <div className="proof-beat flex flex-col items-center gap-7 text-center">
      <span className="block whitespace-nowrap font-mono text-7xl font-medium leading-[0.85] tracking-tight text-paper md:text-8xl lg:text-9xl">
        {step === 0 && <span className="proof-type-on inline-block">Every</span>}
        {step === 1 && (
          <>
            <AnimatedNumber value={18} from={0} /> / 19
          </>
        )}
        {step === 2 && <span className="proof-stamp-on inline-block">0</span>}
      </span>
      <span className="max-w-[34ch] text-lg leading-relaxed text-paper/75 sm:text-xl">
        {label}
      </span>
      {step === 1 && <TickStrip animated />}
    </div>
  );
}

export function ProofScrolly() {
  const [enhanced, setEnhanced] = useState(false);
  const [active, setActive] = useState(0);
  const runwayRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!enhanced) return;
    const root = runwayRef.current;
    if (!root) return;
    const spacers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-proof-step]"),
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(
              Number((entry.target as HTMLElement).dataset.proofStep ?? "0"),
            );
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    spacers.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enhanced]);

  if (!enhanced) {
    return (
      <>
        <Reveal className="proof-band__intro-reveal">
          <ProofIntro />
        </Reveal>
        <Reveal className="reveal-proof mt-12 sm:mt-16">
          <ProofNumbers />
        </Reveal>
      </>
    );
  }

  return (
    <div ref={runwayRef} className="relative h-[240vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center">
        <ProofIntro compact />
        <div className="mt-8 flex min-h-[38vh] w-full items-center justify-center">
          <Beat key={active} step={active} />
        </div>
        {/* The register line: which entry is on the stand. */}
        <div aria-hidden className="mt-4 flex gap-2">
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <span
              key={i}
              className={`h-1 w-8 transition-colors duration-300 ${
                i === active ? "bg-paper/85" : "bg-paper/25"
              }`}
            />
          ))}
        </div>
      </div>
      {/* Invisible runway thirds that drive the beats. Screen readers get the
          stacked fallback semantics via the sticky content itself. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {Array.from({ length: STEP_COUNT }).map((_, i) => (
          <div
            key={i}
            data-proof-step={i}
            className="absolute inset-x-0"
            style={{
              top: `${(i / STEP_COUNT) * 100}%`,
              height: `${100 / STEP_COUNT}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
