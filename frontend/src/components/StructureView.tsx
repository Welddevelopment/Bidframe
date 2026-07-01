"use client";

import {
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useRequirements } from "@/context/RequirementsContext";
import { isApiEnabled } from "@/lib/api";
import type { Requirement } from "@/types/requirement";
import { orderByCriterion } from "@/lib/structure";
import { MarksView } from "./MarksView";
import { GraphView } from "./GraphView";
import { RequirementDrawer } from "./RequirementDrawer";
import { NoTenderLoaded } from "./NoTenderLoaded";

// The /graph surface, rebuilt as one linked workspace instead of two hidden
// tabs. The ledger ("Marks & structure") and the relationship map are the same
// data seen two ways, shown side by side and wired to a shared selection: hover
// or pick a requirement in either pane and it lights in both. Opening one no
// longer ejects you to the matrix — its full detail slides in as a drawer over
// the workspace, so you never lose your place. A prominent segmented control
// (Split · Ledger · Map) replaces the old whisper-quiet text toggle, and a
// filter bar (search, deal-breakers, to-check, category) narrows both panes at
// once. See design-language.md, "The linked workspace" (a named departure).

type Layout = "split" | "ledger" | "map";

const WIDE_QUERY = "(min-width: 1024px)";

function subscribeWide(onChange: () => void): () => void {
  const media = window.matchMedia(WIDE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
function getWideSnapshot(): boolean {
  return window.matchMedia(WIDE_QUERY).matches;
}
// Assume wide during SSR / first paint so the split never flickers to a single
// pane on a desktop (mirrors MatrixView's useIsWide).
function useIsWide(): boolean {
  return useSyncExternalStore(subscribeWide, getWideSnapshot, () => true);
}

export function StructureView() {
  const { requirements, tenderId, approve, editRequirement, flag } =
    useRequirements();

  // The shared spine: what is selected (opens the drawer + lights both panes),
  // what is hovered (a lighter, transient trace), and which criterion lane is
  // pinned from the ledger. One source, read and written by both panes.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedCrit, setSelectedCrit] = useState<string | null>(null);

  // The filter bar. Both panes receive the same predicate, so they always show
  // the same slice of the tender.
  const [query, setQuery] = useState("");
  const [gatingOnly, setGatingOnly] = useState(false);
  const [reviewOnly, setReviewOnly] = useState(false);
  const [activeCats, setActiveCats] = useState<Set<string>>(() => new Set());

  const isWide = useIsWide();
  const [layout, setLayout] = useState<Layout>("split");
  // Split is not viable below lg — fall back to the ledger there.
  const effective: Layout = !isWide && layout === "split" ? "ledger" : layout;

  const categories = useMemo(
    () =>
      Array.from(new Set(requirements.map((r) => r.category))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [requirements]
  );

  const toggleCat = useCallback((c: string) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }, []);

  const filter = useCallback(
    (r: Requirement): boolean => {
      if (gatingOnly && !r.is_gating) return false;
      if (reviewOnly && !r.needs_review) return false;
      if (activeCats.size > 0 && !activeCats.has(r.category)) return false;
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const hay = `${r.text} ${r.source_clause ?? ""} ${r.id}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    },
    [gatingOnly, reviewOnly, activeCats, query]
  );

  const selected = requirements.find((r) => r.id === selectedId) ?? null;

  // "Next" in the drawer walks the same criterion order the ledger lists, across
  // the current filter — approve, next, approve, next, without leaving the graph.
  const goNext = useCallback(() => {
    const ordered = orderByCriterion(requirements.filter(filter));
    if (ordered.length === 0) return;
    const idx = ordered.findIndex((r) => r.id === selectedId);
    const nextItem = ordered[(idx + 1) % ordered.length];
    setSelectedId(nextItem.id);
  }, [requirements, filter, selectedId]);

  const filtersActive =
    gatingOnly || reviewOnly || activeCats.size > 0 || query.trim().length > 0;
  const resetFilters = useCallback(() => {
    setQuery("");
    setGatingOnly(false);
    setReviewOnly(false);
    setActiveCats(new Set());
  }, []);

  if (isApiEnabled() && !tenderId) {
    return (
      <NoTenderLoaded
        heading="Nothing to map yet"
        body="Upload a tender and Bidframe shows where the marks concentrate, where the deal-breakers sit, and what has to be answered in order."
      />
    );
  }

  const paneProps = {
    filter,
    selectedId,
    hoveredId,
    selectedCrit,
    onSelectRequirement: setSelectedId,
    onHoverRequirement: setHoveredId,
    onSelectCrit: setSelectedCrit,
  };

  return (
    <div>
      {/* Toolbar: the switcher, then the filter bar. This is the control the old
          surface was missing — unmistakably a switch, not a line of prose. */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Segmented
            layout={layout}
            onChange={setLayout}
            allowSplit={isWide}
          />
          <SearchField value={query} onChange={setQuery} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            active={gatingOnly}
            onClick={() => setGatingOnly((v) => !v)}
            tone="oxblood"
          >
            Deal-breakers
          </FilterChip>
          <FilterChip
            active={reviewOnly}
            onClick={() => setReviewOnly((v) => !v)}
          >
            To check
          </FilterChip>
          <span aria-hidden className="mx-1 h-4 w-px bg-hairline" />
          {categories.map((c) => (
            <FilterChip
              key={c}
              active={activeCats.has(c)}
              onClick={() => toggleCat(c)}
            >
              {c}
            </FilterChip>
          ))}
          {filtersActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-1 font-mono text-[11px] text-ink-muted underline decoration-hairline underline-offset-2 transition-colors hover:text-ink"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* The workspace. Split shows both panes divided by a hairline, each
          scrolling in its own column; Ledger / Map show one full-width. */}
      {effective === "split" ? (
        <div className="grid h-[76vh] min-h-[520px] grid-cols-[minmax(320px,0.9fr)_1.4fr] divide-x divide-hairline overflow-hidden rounded-lg border border-hairline">
          <div className="min-w-0 overflow-y-auto px-5 py-5">
            <MarksView {...paneProps} compact />
          </div>
          <div className="min-w-0">
            <GraphView {...paneProps} embedded />
          </div>
        </div>
      ) : effective === "map" ? (
        <div className="h-[76vh] min-h-[520px] overflow-hidden rounded-lg border border-hairline">
          <GraphView {...paneProps} embedded />
        </div>
      ) : (
        <MarksView {...paneProps} />
      )}

      {/* Detail in place: the same panel the matrix opens, as a drawer over the
          workspace. You act on a requirement without leaving the graph. */}
      <RequirementDrawer
        requirement={selected}
        onApprove={approve}
        onEdit={editRequirement}
        onFlag={flag}
        onNext={goNext}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}

// The prominent switcher. Three segments on wide screens (Split leads), two when
// the split will not fit. A pressed segment reads as the current lens.
function Segmented({
  layout,
  onChange,
  allowSplit,
}: {
  layout: Layout;
  onChange: (l: Layout) => void;
  allowSplit: boolean;
}) {
  const options: { key: Layout; label: string }[] = [
    ...(allowSplit ? [{ key: "split" as Layout, label: "Split" }] : []),
    { key: "ledger", label: "Ledger" },
    { key: "map", label: "Map" },
  ];
  const current: Layout = !allowSplit && layout === "split" ? "ledger" : layout;

  return (
    <div
      role="tablist"
      aria-label="Workspace layout"
      className="inline-flex items-center rounded-md border border-hairline bg-paper-recessed p-0.5 shadow-[var(--depth-pressed)]"
    >
      {options.map((o) => {
        const active = current === o.key;
        return (
          <button
            key={o.key}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(o.key)}
            className={`rounded-[5px] px-3 py-1 font-mono text-[12px] uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-1 focus-visible:ring-offset-paper-recessed ${
              active
                ? "bg-paper-raised text-ink shadow-[var(--depth-row)]"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="relative flex items-center">
      <span className="sr-only">Search requirements</span>
      <svg
        aria-hidden
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        className="pointer-events-none absolute left-2.5 text-ink-muted"
      >
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M10.5 10.5L14 14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search text or clause"
        className="w-56 rounded-md border border-hairline bg-paper-raised py-1.5 pl-8 pr-3 text-sm text-ink placeholder:text-ink-muted/70 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
      />
    </label>
  );
}

function FilterChip({
  active,
  onClick,
  tone = "neutral",
  children,
}: {
  active: boolean;
  onClick: () => void;
  tone?: "neutral" | "oxblood";
  children: React.ReactNode;
}) {
  const dot =
    tone === "oxblood"
      ? active
        ? "bg-signal-oxblood"
        : "border border-signal-oxblood/50"
      : active
        ? "bg-forest"
        : "border border-hairline";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-1 focus-visible:ring-offset-paper ${
        active
          ? "border-hairline bg-paper-raised text-ink shadow-[var(--depth-row)]"
          : "border-hairline text-ink-muted hover:bg-paper-raised hover:text-ink"
      }`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} aria-hidden />
      {children}
    </button>
  );
}
