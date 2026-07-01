"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRequirements } from "@/context/RequirementsContext";
import { isApiEnabled } from "@/lib/api";
import type { Requirement } from "@/types/requirement";
import { NoTenderLoaded } from "./NoTenderLoaded";

// "Where the marks live" — the graph reframed from a node soup into the questions a
// bid manager actually has: where does the work concentrate (requirements per award
// criterion), where is the risk (the deal-breakers), and what must be answered before
// what (the dependency chains). A ruled ledger in the civic-record voice, not a wiring
// diagram — it stays legible at 20 requirements and at 500. (See
// graph-and-verification-deep-plan.md Part A: options #5 marks-ladder + #6 rails.)

function criterionLabel(ref: string | null): string {
  if (!ref) return "Unassigned";
  const n = ref.replace(/\D+/g, "");
  return n ? `Award criterion ${n}` : ref;
}

interface CriterionGroup {
  key: string;
  label: string;
  items: Requirement[];
  gating: number;
  review: number;
}

export function MarksView() {
  const { requirements, tenderId } = useRequirements();
  const [openKey, setOpenKey] = useState<string | null>(null);

  const { groups, maxCount, deps } = useMemo(() => {
    const byRef = new Map<string | null, Requirement[]>();
    for (const r of requirements) {
      const arr = byRef.get(r.criteria_ref ?? null) ?? [];
      arr.push(r);
      byRef.set(r.criteria_ref ?? null, arr);
    }
    const groups: CriterionGroup[] = Array.from(byRef.entries())
      .map(([ref, items]) => ({
        key: ref ?? "__none__",
        label: criterionLabel(ref),
        items,
        gating: items.filter((r) => r.is_gating).length,
        review: items.filter((r) => r.needs_review).length,
      }))
      .sort((a, b) => {
        if (a.key === "__none__") return 1; // Unassigned always last.
        if (b.key === "__none__") return -1;
        return b.items.length - a.items.length || a.label.localeCompare(b.label);
      });
    const maxCount = Math.max(1, ...groups.map((g) => g.items.length));

    // "Answer in order": the requirements that depend on others (most don't).
    const byId = new Map(requirements.map((r) => [r.id, r]));
    const deps = requirements
      .map((r) => ({
        req: r,
        before: r.depends_on
          .map((d) => byId.get(d))
          .filter((x): x is Requirement => Boolean(x)),
      }))
      .filter((d) => d.before.length > 0);

    return { groups, maxCount, deps };
  }, [requirements]);

  if (isApiEnabled() && !tenderId) {
    return (
      <NoTenderLoaded
        heading="Nothing to map yet"
        body="Upload a tender and Bidframe shows where the marks concentrate, where the deal-breakers sit, and what has to be answered in order."
      />
    );
  }

  const totalGating = requirements.filter((r) => r.is_gating).length;

  return (
    <div className="flex flex-col gap-14">
      {/* Where the marks live — a ledger of award criteria by requirement count. */}
      <section>
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Where the marks live
        </h2>
        <p className="mt-2 max-w-[64ch] text-[15px] leading-relaxed text-ink-muted">
          Every requirement grouped by the award criterion it is scored against, so you
          see where the work concentrates and where the deal-breakers sit.{" "}
          {totalGating > 0 && (
            <span className="text-ink">
              {totalGating} deal-breaker{totalGating === 1 ? "" : "s"}
            </span>
          )}{" "}
          across {groups.length} criteri{groups.length === 1 ? "on" : "a"}. Open a row
          to read its requirements.
        </p>

        <div className="mt-7">
          {groups.map((g) => {
            const isOpen = openKey === g.key;
            const width = Math.round((g.items.length / maxCount) * 100);
            const gatingPct = g.items.length
              ? (g.gating / g.items.length) * 100
              : 0;
            return (
              <div
                key={g.key}
                className="border-t border-hairline py-3.5 first:border-t-0"
              >
                <button
                  type="button"
                  onClick={() => setOpenKey(isOpen ? null : g.key)}
                  aria-expanded={isOpen}
                  className="grid w-full grid-cols-[1fr_auto] items-center gap-6 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <span className="font-mono text-[13px] font-medium text-ink">
                        {g.label}
                      </span>
                      {g.gating > 0 && (
                        <span className="font-mono text-[11px] font-medium text-signal-oxblood">
                          {g.gating} deal-breaker{g.gating === 1 ? "" : "s"}
                        </span>
                      )}
                      {g.review > 0 && (
                        <span className="font-mono text-[11px] text-ink-muted">
                          {g.review} to check
                        </span>
                      )}
                    </div>
                    <div className="mt-2 h-2.5 w-full max-w-[520px] overflow-hidden rounded-[3px] bg-paper-recessed shadow-[var(--depth-pressed)]">
                      <div className="flex h-full" style={{ width: `${width}%` }}>
                        {g.gating > 0 && (
                          <div
                            className="h-full bg-signal-oxblood"
                            style={{ width: `${gatingPct}%` }}
                          />
                        )}
                        <div className="h-full flex-1 bg-ink/25" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono text-lg font-medium text-ink">
                      {g.items.length}
                    </span>
                    <span className="font-mono text-[11px] text-ink-muted">
                      req{g.items.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <ul className="mt-3 flex flex-col gap-1.5 border-l border-hairline pl-4">
                    {g.items.map((r) => (
                      <li
                        key={r.id}
                        className="grid grid-cols-[auto_1fr_auto] items-baseline gap-2.5 text-sm"
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                            r.is_gating ? "bg-signal-oxblood" : "bg-ink/20"
                          }`}
                          aria-hidden
                        />
                        <Link
                          href={`/review?req=${r.id}`}
                          className="leading-snug text-ink transition-colors hover:text-forest hover:underline"
                        >
                          {r.text}
                        </Link>
                        <span className="shrink-0 font-mono text-[11px] text-ink-muted">
                          p.{r.source_page}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Answer in order — the dependency chains, as ordered rails. */}
      <section>
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Answer in order
        </h2>
        <p className="mt-2 max-w-[64ch] text-[15px] leading-relaxed text-ink-muted">
          Some requirements depend on others. Answer the ones on the left first.
        </p>
        {deps.length === 0 ? (
          <p className="mt-6 text-sm text-ink-muted">
            No dependencies found — each requirement stands on its own.
          </p>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {deps.map(({ req, before }) => (
              <li key={req.id} className="flex flex-wrap items-center gap-2">
                {before.map((b) => (
                  <DepChip key={b.id} req={b} />
                ))}
                <span aria-hidden className="font-mono text-sm text-ink-muted">
                  →
                </span>
                <DepChip req={req} emphasis />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

// A requirement as a small chip in a dependency rail. Deal-breakers take the oxblood
// reading edge; the dependent (the "then" item) is emphasised in full ink.
function DepChip({
  req,
  emphasis = false,
}: {
  req: Requirement;
  emphasis?: boolean;
}) {
  return (
    <Link
      href={`/review?req=${req.id}`}
      title={req.text}
      className={`inline-flex max-w-[36ch] items-center rounded-md border bg-paper-raised px-2.5 py-1 text-xs transition-colors hover:border-forest ${
        req.is_gating
          ? "border-l-2 border-hairline border-l-signal-oxblood"
          : "border-hairline"
      } ${emphasis ? "font-medium text-ink" : "text-ink-muted"}`}
    >
      <span className="truncate">{req.text}</span>
    </Link>
  );
}
