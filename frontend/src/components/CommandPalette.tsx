"use client";

import { Command } from "cmdk";
import { GROUP_LABELS, GROUP_ORDER, type GroupKey, type SortKey } from "@/lib/triage";
import type { MatrixLens, VisibleGroup } from "@/lib/matrix-derive";
import { sourceRefLabel } from "@/lib/source-doc";

// The command palette (Cmd+K / Ctrl+K): one keyboard surface over everything
// MatrixView can do — jump to a requirement, filter, sort, switch the view, or
// export. cmdk is headless, so the civic register applies directly: a centred
// paper-raised sheet, mono uppercase group headings, Fraunces for the empty
// state, forest highlight on the active item. Owned by MatrixView because every
// command mutates matrix state; opened/closed by its keydown effect (which
// suppresses j/k/a/e/f while the palette is up).

// Tailwind 4: full literal class strings only. Shared literals live in consts,
// never template-built.
const GROUP_CLASS =
  "[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-4 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-ink-muted";

const ITEM_CLASS =
  "flex cursor-pointer items-baseline gap-3 px-4 py-2 text-sm text-ink data-[selected=true]:bg-forest/10 data-[selected=true]:text-forest";

// The quiet trailing state marker on a toggle-style command ("on", "active").
const ITEM_STATE_CLASS =
  "ml-auto shrink-0 font-mono text-[11px] uppercase tracking-wide text-forest";

const SORT_LABELS: Record<SortKey, string> = {
  confidence: "Sort by confidence (riskiest first)",
  page: "Sort by page",
  category: "Sort by category",
};

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // The derive's visible groups — the palette searches the same representatives
  // the matrix is showing, so "Go to requirement" can never land on a hidden row.
  groups: VisibleGroup[];
  onSelectRequirement: (id: string) => void;
  // Filter
  activeFilter: GroupKey | null;
  onFilter: (key: GroupKey | null) => void;
  categories: string[];
  activeCategories: Set<string>;
  onToggleCategory: (category: string) => void;
  // Sort
  sortBy: SortKey;
  onSortChange: (key: SortKey) => void;
  // View
  density: "compact" | "comfortable";
  onDensityChange: (density: "compact" | "comfortable") => void;
  lens: MatrixLens;
  onLensChange: (lens: MatrixLens) => void;
  onEnterFocus: () => void;
  evidenceOpen: boolean;
  onToggleEvidence: () => void;
  // Export
  onExportXlsx: () => void;
  onExportCsv: () => void;
}

export function CommandPalette(props: CommandPaletteProps) {
  const { open, onOpenChange } = props;

  // Every command closes the palette first, then acts — one gesture, one result.
  function run(action: () => void): () => void {
    return () => {
      onOpenChange(false);
      action();
    };
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      loop
      overlayClassName="fixed inset-0 z-50 bg-ink/25"
      contentClassName="fixed left-1/2 top-[16vh] z-50 w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2"
      className="surface-grain overflow-hidden rounded-lg border border-hairline bg-paper-raised shadow-[var(--depth-sheet)]"
    >
      <Command.Input
        placeholder="Jump to a requirement, filter, sort, export…"
        className="w-full border-b border-hairline bg-transparent px-4 py-3.5 font-mono text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none"
      />
      <Command.List className="max-h-[min(24rem,50vh)] overflow-y-auto pb-2">
        <Command.Empty className="px-6 py-10 text-center font-serif text-lg italic text-ink-muted">
          Nothing in this tender matches.
        </Command.Empty>

        <Command.Group heading="Go to requirement" className={GROUP_CLASS}>
          {props.groups.flatMap((group) =>
            group.representatives.map((req) => (
              <Command.Item
                key={req.id}
                value={`goto:${req.id}`}
                keywords={[sourceRefLabel(req), req.text]}
                onSelect={run(() => props.onSelectRequirement(req.id))}
                className={ITEM_CLASS}
              >
                <span className="shrink-0 font-mono text-xs text-ink-muted">
                  {sourceRefLabel(req)}
                </span>
                <span className="min-w-0 truncate">{req.text}</span>
              </Command.Item>
            ))
          )}
        </Command.Group>

        <Command.Group heading="Filter" className={GROUP_CLASS}>
          {GROUP_ORDER.map((key) => (
            <Command.Item
              key={key}
              value={`filter:${key}`}
              keywords={["filter", GROUP_LABELS[key]]}
              onSelect={run(() => props.onFilter(key))}
              className={ITEM_CLASS}
            >
              <span>Show only “{GROUP_LABELS[key]}”</span>
              {props.activeFilter === key && (
                <span className={ITEM_STATE_CLASS}>active</span>
              )}
            </Command.Item>
          ))}
          <Command.Item
            value="filter:clear"
            keywords={["filter", "clear", "all", "reset"]}
            onSelect={run(() => props.onFilter(null))}
            className={ITEM_CLASS}
          >
            Clear triage filter — show everything
          </Command.Item>
          {props.categories.map((category) => (
            <Command.Item
              key={category}
              value={`category:${category}`}
              keywords={["category", category]}
              onSelect={run(() => props.onToggleCategory(category))}
              className={ITEM_CLASS}
            >
              <span>Toggle category “{category}”</span>
              {props.activeCategories.has(category) && (
                <span className={ITEM_STATE_CLASS}>on</span>
              )}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Sort" className={GROUP_CLASS}>
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <Command.Item
              key={key}
              value={`sort:${key}`}
              keywords={["sort", key]}
              onSelect={run(() => props.onSortChange(key))}
              className={ITEM_CLASS}
            >
              <span>{SORT_LABELS[key]}</span>
              {props.sortBy === key && (
                <span className={ITEM_STATE_CLASS}>active</span>
              )}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="View" className={GROUP_CLASS}>
          <Command.Item
            value="view:density"
            keywords={["density", "compact", "comfortable", "rows"]}
            onSelect={run(() =>
              props.onDensityChange(
                props.density === "compact" ? "comfortable" : "compact"
              )
            )}
            className={ITEM_CLASS}
          >
            {props.density === "compact"
              ? "Comfortable rows"
              : "Compact rows"}
          </Command.Item>
          <Command.Item
            value="view:lens"
            keywords={["lens", "group", "criteria", "triage", "award"]}
            onSelect={run(() =>
              props.onLensChange(props.lens === "triage" ? "criteria" : "triage")
            )}
            className={ITEM_CLASS}
          >
            {props.lens === "triage"
              ? "Group by award criteria"
              : "Group by triage"}
          </Command.Item>
          <Command.Item
            value="view:focus"
            keywords={["focus", "mode", "review", "one at a time"]}
            onSelect={run(props.onEnterFocus)}
            className={ITEM_CLASS}
          >
            <span>Enter focus mode</span>
            <span className="ml-auto shrink-0 font-mono text-[11px] text-ink-muted">
              Shift+F
            </span>
          </Command.Item>
          <Command.Item
            value="view:evidence"
            keywords={["evidence", "source", "pane", "pdf", "page"]}
            onSelect={run(props.onToggleEvidence)}
            className={ITEM_CLASS}
          >
            {props.evidenceOpen
              ? "Hide the source pane"
              : "Show the source pane"}
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Export" className={GROUP_CLASS}>
          <Command.Item
            value="export:xlsx"
            keywords={["export", "excel", "xlsx", "workbook", "spreadsheet"]}
            onSelect={run(props.onExportXlsx)}
            className={ITEM_CLASS}
          >
            Export the matrix as .xlsx (styled workbook)
          </Command.Item>
          <Command.Item
            value="export:csv"
            keywords={["export", "csv", "plain"]}
            onSelect={run(props.onExportCsv)}
            className={ITEM_CLASS}
          >
            Export the matrix as .csv
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
