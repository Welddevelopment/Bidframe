"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { toast } from "sonner";
import { useRequirements } from "@/context/RequirementsContext";
import { isApiEnabled } from "@/lib/api";
import type { Requirement } from "@/types/requirement";
import {
  deriveTriage,
  isConfidentNonGating,
  nextPriorityId,
  type GroupKey,
  type SortKey,
} from "@/lib/triage";
import { deriveVisibleGroups, type MatrixLens } from "@/lib/matrix-derive";
import { AppMain } from "./AppMain";
import { ApprovalStamp } from "./ApprovalStamp";
import { BulkActionBar } from "./BulkActionBar";
import { ComplianceMatrix } from "./ComplianceMatrix";
import { DocumentHeader } from "./DocumentHeader";
import { GatingHero } from "./GatingHero";
import { NoTenderLoaded } from "./NoTenderLoaded";
import { RequirementDrawer } from "./RequirementDrawer";
import { RequirementPanel } from "./RequirementPanel";
import { RequirementSpine } from "./RequirementSpine";

// MatrixView owns the open state. It holds the selected requirement, the active
// triage filter, and the responsive mode switch, and it renders the full-bleed
// document header plus the centred body column (layout.md sections 1, 2, 5, 8).
//
// Resting (nothing selected): the gating hero over the grouped matrix.
// Open at >=1100px: a split, a narrow spine index on the left and the panel on
//   the right. The matrix grid is hidden; the spine replaces it.
// Open at <1100px: the resting matrix stays and the panel slides in as a drawer.
//   The spine drops because there is no room for it.

const WIDE_QUERY = "(min-width: 1100px)";

// Track whether the split open state is viable for this viewport. Read straight
// from the media query via useSyncExternalStore so there is no setState in an
// effect (no cascading render). SSR and the first client snapshot both assume
// the split, then the real match resolves on mount, so the wide layout never
// flickers to the drawer on a wide screen.
function subscribeWide(onChange: () => void): () => void {
  const media = window.matchMedia(WIDE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getWideSnapshot(): boolean {
  return window.matchMedia(WIDE_QUERY).matches;
}

function useIsWide(): boolean {
  return useSyncExternalStore(subscribeWide, getWideSnapshot, () => true);
}

function csvCell(value: unknown): string {
  const text = String(value ?? "").replace(/\r?\n/g, " ");
  return `"${text.replace(/"/g, '""')}"`;
}

function exportRequirements(requirements: Requirement[]) {
  const header = [
    "id",
    "status",
    "type",
    "gating",
    "category",
    "source_page",
    "source_clause",
    "requirement",
    "decision_note",
    "answer",
    "evidence",
  ];
  const rows = requirements.map((req) => [
    req.id,
    req.status,
    req.type,
    req.is_gating ? "yes" : "no",
    req.category,
    req.source_page,
    req.source_clause ?? "",
    req.text,
    req.decision?.note ?? "",
    req.answer?.text ?? req.draft_answer ?? "",
    req.answer?.evidence_refs
      ?.map((ref) => `${ref.doc_id} p.${ref.page}: ${ref.excerpt}`)
      .join(" | ") ?? "",
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "bidframe-compliance-matrix.csv";
  link.click();
  URL.revokeObjectURL(url);
}

// The stamp time for the completion summary: the latest decision made this
// session, formatted HH:MM. Undefined when nothing carries a timestamp, so the
// stamp falls back to its own default.
function latestDecisionTimeLabel(requirements: Requirement[]): string | undefined {
  const stamps = requirements
    .map((req) => req.decision?.timestamp)
    .filter((t): t is string => Boolean(t))
    .sort();
  const latest = stamps.at(-1);
  if (!latest) return undefined;
  const when = new Date(latest);
  if (Number.isNaN(when.getTime())) return undefined;
  return when.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

// The short human name for a requirement in an undo toast: its clause ref when
// present, else its page — the same margin ref the matrix rows carry.
function toastRef(req: Requirement | undefined): string {
  if (!req) return "1 requirement";
  return (
    req.source_clause?.replace(/^section\s+/i, "") ?? `p.${req.source_page}`
  );
}

export function MatrixView({ title }: { title: string }) {
  const {
    requirements,
    tenderId,
    approve,
    editRequirement,
    flag,
    awardCriteria,
    approveMany,
    flagMany,
    snapshotDecisions,
    restoreDecisions,
    answerOpenQuestion,
  } = useRequirements();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<GroupKey | null>(null);
  // Category filter (empty set = all categories shown) and the row sort order.
  // Held here so the matrix, the header chips (a following step), and the split
  // spine all read one source. The visible chip/menu UI is the next step; this
  // step wires the state and threads it through.
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    () => new Set<string>()
  );
  const toggleCategory = useCallback((category: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }, []);
  const [sortBy, setSortBy] = useState<SortKey>("confidence");
  // Row density for the matrix: comfortable by default, compact for a longer
  // tender the user wants to see more of at once. Held here so it survives the
  // matrix unmounting into the split; threaded to ComplianceMatrix as an optional
  // prop (the frozen surfaces stay comfortable).
  const [density, setDensity] = useState<"compact" | "comfortable">(
    "comfortable"
  );
  // Which groups the user has folded away, keyed by the visible group's string
  // key (triage GroupKeys and criterion ids share one fold state, so a fold
  // survives switching lenses). The long, low-priority triage groups start
  // collapsed so a big tender opens short; the actionable ones start open. Held
  // here (not in ComplianceMatrix) so the fold survives the matrix unmounting when
  // a requirement opens the split.
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    () => new Set<string>(["ready", "decided"])
  );
  const toggleGroup = useCallback((key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);
  // The grouping lens: triage (what each row needs from you) or the tender's
  // award criteria. Under criteria the header's triage filter degrades to a
  // row-level predicate (see lib/matrix-derive.ts).
  const [lens, setLens] = useState<MatrixLens>("triage");
  // Multi-select for bulk decisions: the selected row ids plus the shift-range
  // anchor (the last row toggled without shift).
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set<string>()
  );
  const [anchorId, setAnchorId] = useState<string | null>(null);
  const isWide = useIsWide();

  const triage = deriveTriage(requirements);

  // The display order the matrix will render (before its local search box),
  // for resolving a shift-click into a contiguous range of rows. Derived with
  // an empty query: a range never silently sweeps in rows a search is hiding
  // beyond what is on screen, because filters and lens match the live view.
  const { flatOrder } = deriveVisibleGroups({
    groups: triage.groups,
    query: "",
    activeFilter,
    activeCategories,
    sortBy,
    lens,
    awardCriteria,
  });

  // Toggle one row's selection; shift extends from the anchor (the last row
  // toggled without shift) through the clicked row, in display order.
  const toggleSelected = useCallback(
    (id: string, shiftKey: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (shiftKey && anchorId && anchorId !== id) {
          const from = flatOrder.indexOf(anchorId);
          const to = flatOrder.indexOf(id);
          if (from !== -1 && to !== -1) {
            const [lo, hi] = from < to ? [from, to] : [to, from];
            for (let i = lo; i <= hi; i += 1) next.add(flatOrder[i]);
            return next;
          }
        }
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      if (!shiftKey) setAnchorId(id);
    },
    [anchorId, flatOrder]
  );

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set<string>());
    setAnchorId(null);
  }, []);

  // ---- Undoable decisions -------------------------------------------------
  // Every decision handler snapshots the affected rows BEFORE mutating, then
  // raises a toast whose Undo puts the snapshot back exactly (status + note).

  const undoAction = useCallback(
    (ids: string[]) => {
      const snapshot = snapshotDecisions(ids);
      return {
        label: "Undo",
        onClick: () => restoreDecisions(snapshot),
      };
    },
    [snapshotDecisions, restoreDecisions]
  );

  const approveWithUndo = useCallback(
    (id: string) => {
      const action = undoAction([id]);
      approve(id);
      toast(`Approved ${toastRef(requirements.find((r) => r.id === id))}`, {
        action,
      });
    },
    [approve, requirements, undoAction]
  );

  const editWithUndo = useCallback(
    (id: string, note: string) => {
      const action = undoAction([id]);
      editRequirement(id, note);
      toast(`Edited ${toastRef(requirements.find((r) => r.id === id))}`, {
        action,
      });
    },
    [editRequirement, requirements, undoAction]
  );

  const flagWithUndo = useCallback(
    (id: string, note: string) => {
      const action = undoAction([id]);
      flag(id, note);
      toast(`Flagged ${toastRef(requirements.find((r) => r.id === id))}`, {
        action,
      });
    },
    [flag, requirements, undoAction]
  );

  // Batch approve (the group header's "Approve all confident" and the bulk
  // bar): one state pass, one toast, one undo.
  const approveManyWithUndo = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;
      const action = undoAction(ids);
      approveMany(ids);
      const label =
        ids.length === 1
          ? `Approved ${toastRef(requirements.find((r) => r.id === ids[0]))}`
          : `Approved ${ids.length} requirements`;
      toast(label, { action });
    },
    [approveMany, requirements, undoAction]
  );

  // Bulk-bar approve: only the confident non-gating members of the selection —
  // a sweep can never wave a deal-breaker through.
  const selectedList = requirements.filter((req) => selectedIds.has(req.id));
  const eligibleSelected = selectedList.filter(isConfidentNonGating);

  const bulkApprove = useCallback(() => {
    approveManyWithUndo(eligibleSelected.map((req) => req.id));
    clearSelection();
  }, [approveManyWithUndo, eligibleSelected, clearSelection]);

  const bulkFlag = useCallback(
    (note: string) => {
      const ids = selectedList.map((req) => req.id);
      if (ids.length === 0) return;
      const action = undoAction(ids);
      flagMany(ids, note);
      const label =
        ids.length === 1
          ? `Flagged ${toastRef(selectedList[0])}`
          : `Flagged ${ids.length} requirements`;
      toast(label, { action });
      clearSelection();
    },
    [selectedList, flagMany, undoAction, clearSelection]
  );
  // The distinct categories present, sorted by label, for the header's category
  // filter (the chip UI lands in the next step). Cheap to derive each render,
  // like triage above.
  const availableCategories = Array.from(
    new Set(requirements.map((req) => req.category))
  ).sort((a, b) => a.localeCompare(b));
  const selected = requirements.find((r) => r.id === selectedId) ?? null;
  const priorityId = nextPriorityId(requirements);
  // What still needs a human: gaps to fill + deal-breakers / low-confidence to verify.
  // Everything else, Bidframe has "handled" (ready to approve, or already decided).
  // Deliberately "handled", not "verified" — a flagged low-confidence item is off your
  // plate but was never verified, so counting it as verified would over-claim.
  const needInput = triage.counts["needs-you"] + triage.counts["to-verify"];
  const handledCount = requirements.length - needInput;

  // Live product, no tender loaded yet → show an onboarding empty state rather than
  // the sample data. The mock showcase build (no API) keeps its sample matrix.
  const noTenderLoaded = isApiEnabled() && !tenderId;

  // Open a requirement from a ?req= URL param (a deep link from the graph, a
  // shared link, or a refresh), once, after its requirement is present.
  const appliedUrlSelection = useRef(false);
  useEffect(() => {
    if (appliedUrlSelection.current) return;
    const id = new URLSearchParams(window.location.search).get("req");
    if (id && requirements.some((r) => r.id === id)) {
      // One-shot deep-link sync from the URL, applied after hydration (not a
      // render-time derive, which would cause an SSG hydration mismatch); the
      // ref makes it run once.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedId(id);
      appliedUrlSelection.current = true;
    } else if (requirements.length > 0) {
      appliedUrlSelection.current = true;
    }
  }, [requirements]);

  const close = useCallback(() => setSelectedId(null), []);

  // In the split, the spine is the way back: clicking the row that is already
  // open closes the panel and returns to the resting matrix (layout.md section
  // 5), while clicking any other row just moves the panel without closing.
  const selectFromSpine = useCallback(
    (id: string) => setSelectedId((current) => (current === id ? null : id)),
    []
  );

  // The header Next routes to the highest-priority unresolved item and opens it.
  // When nothing is pending it becomes Export response (a no-op stub here, the
  // export route is a later pass).
  function onNext() {
    if (priorityId) setSelectedId(priorityId);
    else exportRequirements(requirements);
  }

  // The panel Next advances to the next item within its current triage group,
  // rolling to the first item of the next non-empty group at the end (deriveTriage
  // order). It keeps the worklist flowing: approve, next, approve, next.
  const goNext = useCallback(
    (currentId: string) => {
      const pending = triage.groups
        .flatMap((group) => group.items)
        .filter((req) => req.status === "pending");
      const ordered =
        pending.length > 0 ? pending : triage.groups.flatMap((group) => group.items);
      const index = ordered.findIndex((r) => r.id === currentId);
      if (index === -1 || ordered.length === 0) return;
      const nextItem = ordered[(index + 1) % ordered.length];
      setSelectedId(nextItem.id);
    },
    [triage.groups]
  );

  // #16: keyboard shortcuts for the worklist. j / ArrowDown and k / ArrowUp move
  // through the worklist; `a` approves the selected item only when it is safe (a
  // confident, non-gating item — gating still needs the panel's named confirm).
  // Ignored while typing in a field. The listener re-subscribes when the worklist or
  // selection change, which is cheap.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const el = event.target as HTMLElement | null;
      if (
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable)
      ) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const ordered = triage.groups.flatMap((group) => group.items);
      if (ordered.length === 0) return;
      const idx = selectedId
        ? ordered.findIndex((r) => r.id === selectedId)
        : -1;
      if (event.key === "j" || event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedId(ordered[Math.min(ordered.length - 1, idx + 1)].id);
      } else if (event.key === "k" || event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedId(ordered[idx <= 0 ? 0 : idx - 1].id);
      } else if (event.key === "a" && selectedId) {
        const cur = ordered.find((r) => r.id === selectedId);
        if (cur && isConfidentNonGating(cur)) {
          event.preventDefault();
          approveWithUndo(selectedId);
        }
      } else if (event.key === "e" || event.key === "f") {
        // Edit / flag both need a typed note, so they cannot act blind from the
        // list: open the panel on the current row (or the first item) where the
        // note field lives, and let the user commit there.
        const target = selectedId ?? ordered[0]?.id ?? null;
        if (target) {
          event.preventDefault();
          setSelectedId(target);
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [triage.groups, selectedId, approveWithUndo]);

  // Live product, no tender loaded → the onboarding empty state (after all hooks).
  if (noTenderLoaded) {
    return (
      <>
        <DocumentHeader title="Compliance matrix" />
        <AppMain>
          <NoTenderLoaded />
        </AppMain>
      </>
    );
  }

  return (
    <>
      <DocumentHeader
        title={title}
        triage={{
          counts: triage.counts,
          activeFilter,
          onFilter: setActiveFilter,
          onNext,
          nextLabel: priorityId ? "Next" : "Export response",
          categories: availableCategories,
          activeCategories,
          onToggleCategory: toggleCategory,
          sortBy,
          onSortChange: setSortBy,
        }}
      />

      <AppMain>
        {isWide && selected ? (
          // SPLIT open state: spine index (~300px) + panel, divided by a hairline.
          // The matrix grid is hidden; the spine is the matrix in miniature.
          <div className="grid min-h-[70vh] grid-cols-[300px_1fr] gap-0 divide-x divide-hairline">
            <div className="pr-4">
              <RequirementSpine
                groups={triage.groups}
                selectedId={selectedId}
                onSelect={selectFromSpine}
              />
            </div>
            <div className="pl-6">
              <RequirementPanel
                requirement={selected}
                variant="split"
                onApprove={approveWithUndo}
                onEdit={editWithUndo}
                onFlag={flagWithUndo}
                onNext={() => goNext(selected.id)}
                onClose={close}
              />
            </div>
          </div>
        ) : (
          // RESTING, plus the narrow-viewport open state: the matrix stays put and
          // the panel arrives as a drawer over it (rendered below).
          <>
            <GatingHero onSelect={setSelectedId} />
            {priorityId === null && requirements.length > 0 && (
              <CompletionSummary
                total={requirements.length}
                approved={requirements.filter((req) => req.status === "accepted").length}
                edited={requirements.filter((req) => req.status === "edited").length}
                flagged={requirements.filter((req) => req.status === "flagged").length}
                time={latestDecisionTimeLabel(requirements)}
                onExport={() => exportRequirements(requirements)}
              />
            )}
            {priorityId !== null && requirements.length > 0 && (
              <div className="mb-3">
                <p className="font-mono text-xs text-ink-muted">
                  <span className="text-ink">
                    Bidframe handled {handledCount} of {requirements.length}
                  </span>{" "}
                  — {needInput} still need your input.
                </p>
                {/* A slim derived progress track: forest fill on a hairline
                    rule, showing how much Bidframe has already carried. No new
                    state, purely the counts above. */}
                <div
                  className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-hairline"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={requirements.length}
                  aria-valuenow={handledCount}
                  aria-label="Requirements Bidframe has handled"
                >
                  <div
                    className="h-full rounded-full bg-forest transition-[width] duration-500"
                    style={{
                      width: `${
                        requirements.length > 0
                          ? (handledCount / requirements.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}
            <ComplianceMatrix
              groups={triage.groups}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onApprove={approveWithUndo}
              onApproveMany={approveManyWithUndo}
              activeFilter={activeFilter}
              activeCategories={activeCategories}
              sortBy={sortBy}
              collapsed={collapsedGroups}
              onToggleGroup={toggleGroup}
              density={density}
              onDensityChange={setDensity}
              lens={lens}
              onLensChange={setLens}
              awardCriteria={awardCriteria}
              selection={{ ids: selectedIds, onToggle: toggleSelected }}
              onAnswerQuestion={answerOpenQuestion}
            />
            <p className="mt-6 font-mono text-[11px] text-ink-muted/70">
              Keys: j / k to move, a to approve a confident item.
            </p>
          </>
        )}
      </AppMain>

      {/* Narrow-viewport fallback only: the same panel content in a slide-over.
          On wide screens the split owns the open state, so the drawer is idle. */}
      {!isWide && (
        <RequirementDrawer
          requirement={selected}
          onApprove={approveWithUndo}
          onEdit={editWithUndo}
          onFlag={flagWithUndo}
          onNext={selected ? () => goNext(selected.id) : () => {}}
          onClose={close}
        />
      )}

      {/* The floating bulk-decision bar, alive while any rows are selected. */}
      {selectedIds.size > 0 && (
        <BulkActionBar
          count={selectedIds.size}
          eligibleCount={eligibleSelected.length}
          onApprove={bulkApprove}
          onFlag={bulkFlag}
          onClear={clearSelection}
        />
      )}
    </>
  );
}

// The completion payoff (frontend-ux-audit #8): a Civic Record "record filed"
// sheet that marks the end of the loop and doubles as the export surface. The
// stamp is honest — it only lands when nothing is left flagged; an open concern
// gets a quiet line instead of a false victory. No signal colour, no confetti:
// the forest approval stamp is the one earned celebration.
function CompletionSummary({
  total,
  approved,
  edited,
  flagged,
  time,
  onExport,
}: {
  total: number;
  approved: number;
  edited: number;
  flagged: number;
  time?: string;
  onExport: () => void;
}) {
  const clean = flagged === 0;
  const noun = total === 1 ? "requirement" : "requirements";

  return (
    <section className="surface-grain mb-8 rounded-lg border border-hairline bg-paper-raised px-6 py-6 shadow-[var(--depth-sheet)]">
      <p className="font-mono text-xs font-medium uppercase tracking-wide text-ink-muted">
        {clean ? "Review complete" : "Ready to file"}
      </p>
      <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold leading-tight text-ink">
            {total} {noun} reviewed
          </h2>
          <p className="mt-2 font-mono text-sm text-ink-muted">
            {approved} approved · {edited} edited
            {flagged > 0 ? ` · ${flagged} flagged` : ""}
          </p>
          {clean ? (
            <div className="mt-4">
              <ApprovalStamp time={time} />
            </div>
          ) : (
            <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-ink-muted">
              {flagged} flagged for follow-up. Resolve or note them, then export
              the response.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onExport}
          className="shrink-0 self-start rounded-md bg-forest px-4 py-2 text-sm font-semibold text-paper shadow-[var(--depth-control)] transition-colors hover:bg-forest-hover sm:self-auto"
        >
          Export response
        </button>
      </div>
    </section>
  );
}
