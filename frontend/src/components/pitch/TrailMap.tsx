"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "motion/react";

// The deck's navigation as a trail map: one undulating route across the foot
// of the stage with a diamond blaze per main slide (the landing page's
// waypoint language, laid horizontal). The walked portion draws forward as
// the deck advances, a walker dot leads the line, and every blaze is a
// button. When the deck steps past the Ask into the appendix, the whole
// route dims and a dashed side-path lights up instead — Q&A material is
// visibly off the trail, not more trail.

// The route stops short of the right edge; the controls dock in the band's
// last stretch and the field-notes side path branches off the final blaze.
const TRAIL_PATH =
  "M 18 30 C 110 12, 200 40, 300 26 C 400 12, 490 38, 580 24 C 670 12, 750 34, 852 22";

const VIEW_W = 1000;
const VIEW_H = 44;

interface Stop {
  x: number;
  y: number;
  // normalized 0..1 pathLength offset, for the drawn portion
  at: number;
}

export function TrailMap({
  labels,
  activeIndex,
  offTrail,
  onSelect,
}: {
  labels: readonly string[];
  activeIndex: number;
  // true when an appendix slide is showing
  offTrail: boolean;
  onSelect: (index: number) => void;
}) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const walkerRef = useRef<SVGCircleElement | null>(null);
  const [stops, setStops] = useState<Stop[] | null>(null);
  const reducedMotion = useReducedMotion();

  const mainIndex = Math.min(activeIndex, labels.length - 1);
  const target = mainIndex / (labels.length - 1);
  const progress = useSpring(target, {
    stiffness: 70,
    damping: 22,
  });

  useEffect(() => {
    if (reducedMotion) {
      progress.jump(target);
    } else {
      progress.set(target);
    }
  }, [target, progress, reducedMotion]);

  // Place the blazes on the route itself: sample the real path geometry once
  // so markers sit on the line no matter how the curve bends.
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    setStops(
      labels.map((_, i) => {
        const at = i / (labels.length - 1);
        const point = path.getPointAtLength(at * total);
        return { x: point.x, y: point.y, at };
      })
    );
  }, [labels]);

  // The walker leads the drawn line; drive it imperatively so the dot slides
  // along the actual curve rather than a straight lerp between stops.
  useMotionValueEvent(progress, "change", (v) => {
    const path = pathRef.current;
    const walker = walkerRef.current;
    if (!path || !walker) return;
    const point = path.getPointAtLength(
      Math.max(0, Math.min(1, v)) * path.getTotalLength()
    );
    walker.setAttribute("cx", `${point.x}`);
    walker.setAttribute("cy", `${point.y}`);
  });

  return (
    <div className={`pitch-trailmap no-print ${offTrail ? "is-offtrail" : ""}`}>
      <svg
        className="pitch-trailmap__svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        {/* the faint full route, then the walked portion drawing over it */}
        <g className="pitch-trailmap__route">
          <path
            ref={pathRef}
            d={TRAIL_PATH}
            stroke="currentColor"
            strokeOpacity="0.28"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            vectorEffect="non-scaling-stroke"
          />
          <motion.path
            d={TRAIL_PATH}
            stroke="currentColor"
            strokeOpacity="0.85"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: progress }}
          />
          <circle
            ref={walkerRef}
            className="pitch-trailmap__walker"
            cx="18"
            cy="30"
            r="3.4"
          />
        </g>
        {/* the field-notes side path, off the end of the route */}
        <path
          className="pitch-trailmap__sidepath"
          d="M 852 22 C 866 14, 876 10, 888 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {stops?.map((stop, i) => {
        const state = offTrail
          ? "is-passed"
          : i < mainIndex
            ? "is-passed"
            : i === mainIndex
              ? "is-here"
              : "";
        return (
          <button
            key={labels[i]}
            type="button"
            className={`pitch-trailmap__stop ${state}`}
            style={{
              left: `${(stop.x / VIEW_W) * 100}%`,
              top: `${(stop.y / VIEW_H) * 100}%`,
            }}
            onClick={() => onSelect(i)}
            aria-label={`Go to ${labels[i]}`}
            aria-current={!offTrail && i === mainIndex ? "step" : undefined}
          >
            <span className="pitch-trailmap__blaze" aria-hidden="true" />
            <span className="pitch-trailmap__label">{labels[i]}</span>
          </button>
        );
      })}

      <span className="pitch-trailmap__fieldnotes" aria-hidden="true">
        Field notes
      </span>
    </div>
  );
}
