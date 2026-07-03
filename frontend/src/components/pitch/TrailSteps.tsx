"use client";

import { useEffect, useRef, useState } from "react";

// The journey slide's composition: a drawn trail crossing the slide body with
// the story's steps hung off it at the bends — the trail-map language at
// slide scale. Step blocks alternate above/below the line so the path stays
// legible. Geometry is sampled from the real SVG path on mount, same trick as
// the trail map, so the blazes always sit on the line.

const PATH = "M 24 170 C 180 40, 340 210, 500 110 C 640 30, 800 170, 976 84";
const VIEW_W = 1000;
const VIEW_H = 240;

export function TrailSteps({
  steps,
}: {
  steps: readonly { title: string; copy: string }[];
}) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [points, setPoints] = useState<{ x: number; y: number }[] | null>(
    null
  );

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    setPoints(
      steps.map((_, i) => {
        const at = 0.03 + (i / (steps.length - 1)) * 0.94;
        const point = path.getPointAtLength(at * total);
        return { x: point.x, y: point.y };
      })
    );
  }, [steps]);

  return (
    <div className="pitch-trailsteps">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d={PATH}
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1.6"
          strokeDasharray="5 7"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {points?.map((point, i) => (
        <div
          key={steps[i].title}
          className={`pitch-trailsteps__step ${
            i % 2 === 0 ? "is-below" : "is-above"
          }`}
          style={{
            left: `${(point.x / VIEW_W) * 100}%`,
            top: `${(point.y / VIEW_H) * 100}%`,
          }}
        >
          <span className="pitch-trailsteps__blaze" aria-hidden="true" />
          <div>
            <strong>{steps[i].title}</strong>
            <span>{steps[i].copy}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
