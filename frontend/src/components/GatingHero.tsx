"use client";

import { useRequirements } from "@/context/RequirementsContext";

export function GatingHero() {
  const { requirements } = useRequirements();
  const gating = requirements.filter((r) => r.is_gating);

  if (gating.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-red-200 bg-red-50 shadow-sm">
      <div className="flex items-start gap-3 border-b border-red-200 bg-red-600 px-5 py-4 text-white">
        <svg
          className="mt-0.5 h-6 w-6 shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <h2 className="text-base font-bold leading-tight tracking-tight">
            {gating.length} deal-breaker{gating.length !== 1 ? "s" : ""} — miss
            any one and the bid is disqualified
          </h2>
          <p className="mt-0.5 text-sm text-red-100">
            These are pass/fail gating requirements. Confirm each one before
            submission.
          </p>
        </div>
      </div>

      <ul className="divide-y divide-red-100">
        {gating.map((req) => (
          <li
            key={req.id}
            className="flex items-start gap-2.5 px-5 py-3 text-sm text-red-900"
          >
            <span
              className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600"
              aria-hidden
            />
            <span className="leading-snug">
              {req.text}
              <span className="ml-2 text-xs font-medium text-red-500">
                p.{req.source_page} · {req.source_clause}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
