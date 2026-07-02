import type { AwardCriterion, Requirement } from "@/types/requirement";
import {
  compareRequirements,
  groupOf,
  type GroupKey,
  type SortKey,
  type TriageGroup,
} from "@/lib/triage";
import { collapseDuplicates, type DedupeMeta } from "@/lib/dedupe";
import { critKey, criterionLabel, orderedCritKeys, UNASSIGNED } from "@/lib/structure";

// How the matrix groups its rows: by what each item needs from you (triage, the
// default) or by the award criterion it is scored against (the criteria lens).
export type MatrixLens = "triage" | "criteria";

// The matrix's visible-worklist derivation, pulled out of ComplianceMatrix so it
// is pure, testable, and computed ONCE per render (the component previously
// re-ran collapseDuplicates per group just for its "shown" counter). Everything
// here is display-level: nothing is dropped, nothing mutated.
//
// The group shape is deliberately lens-ready: `key` is a plain string (a triage
// GroupKey today, an award-criterion id under a criteria lens later) and `label`
// is the display heading, so a future grouping lens can reuse this shape without
// the matrix reshaping.

export interface VisibleGroup {
  // Lens-ready group identity: a triage GroupKey today (string-typed on purpose
  // so a later criteria lens can use award-criterion ids without a reshape).
  key: string;
  label: string;
  // The group's rows after search/category filtering + sorting, BEFORE display
  // dedupe. Kept so fold/selection logic can still see every member.
  items: Requirement[];
  // Display dedupe, precomputed exactly once per group (see lib/dedupe.ts):
  // one representative per unique requirement + per-representative meta.
  representatives: Requirement[];
  meta: Map<string, DedupeMeta>;
}

export interface VisibleMatrix {
  groups: VisibleGroup[];
  // Total representatives on screen — the header's "N shown" counter.
  shownCount: number;
  // Representative ids in display order across all visible groups, for
  // keyboard traversal / virtualisation later.
  flatOrder: string[];
}

// Regroup the triage worklist by award criterion for the criteria lens. Rows
// flatten in triage order, then gather under critKey(criteria_ref) in the
// canonical criterion order (lib/structure.ts). Labels prefer the tender's
// published criteria ("Quality · 40%"); the synthetic criterionLabel covers a
// ref with no published match, and unassigned rows share the catch-all.
function regroupByCriteria(
  groups: TriageGroup[],
  awardCriteria: AwardCriterion[]
): { key: string; label: string; items: Requirement[] }[] {
  const all = groups.flatMap((group) => group.items);
  const byName = new Map(awardCriteria.map((c) => [c.id, c]));
  return orderedCritKeys(all).map((key) => {
    const criterion = key === UNASSIGNED ? undefined : byName.get(key);
    const label = criterion
      ? `${criterion.name} · ${criterion.weight}%`
      : criterionLabel(key === UNASSIGNED ? null : key);
    return {
      key,
      label,
      items: all.filter((req) => critKey(req.criteria_ref) === key),
    };
  });
}

// Replicates the matrix's filter/sort semantics exactly: free-text search over
// text/category/source_clause/answer.text, then the category set filter, then
// the sortBy comparator (source order when omitted); empty groups are dropped
// and an active triage filter narrows to its one group. Under the criteria lens
// rows group by award criterion instead, and the triage filter degrades to a
// row-level predicate (groupOf) so it keeps meaning something.
export function deriveVisibleGroups({
  groups,
  query,
  activeFilter,
  activeCategories,
  sortBy,
  lens = "triage",
  awardCriteria = [],
}: {
  groups: TriageGroup[];
  query: string;
  activeFilter: GroupKey | null;
  activeCategories?: Set<string>;
  sortBy?: SortKey;
  // The grouping lens. Omitted (frozen surfaces) = triage, exactly as before.
  lens?: MatrixLens;
  // The tender's published criteria, for real names + weights on group labels.
  awardCriteria?: AwardCriterion[];
}): VisibleMatrix {
  const normalisedQuery = query.trim().toLowerCase();
  // An empty (or omitted) category set means no category filtering.
  const categoryFilter =
    activeCategories && activeCategories.size > 0 ? activeCategories : null;
  const comparator = sortBy ? compareRequirements(sortBy) : null;

  const sourceGroups =
    lens === "criteria" ? regroupByCriteria(groups, awardCriteria) : groups;

  const visible: VisibleGroup[] = [];
  const flatOrder: string[] = [];
  let shownCount = 0;

  for (const group of sourceGroups) {
    if (lens === "triage" && activeFilter !== null && group.key !== activeFilter)
      continue;

    let items =
      normalisedQuery.length === 0
        ? group.items
        : group.items.filter((req) =>
            [
              req.text,
              req.category,
              req.source_clause ?? "",
              req.answer?.text ?? "",
            ]
              .join(" ")
              .toLowerCase()
              .includes(normalisedQuery)
          );
    if (categoryFilter) {
      items = items.filter((req) => categoryFilter.has(req.category));
    }
    if (lens === "criteria" && activeFilter !== null) {
      // The triage header filter as a row predicate: within each criterion,
      // keep only the rows that belong to the filtered triage group.
      items = items.filter((req) => groupOf(req) === activeFilter);
    }
    if (comparator) {
      items = [...items].sort(comparator);
    }
    if (items.length === 0) continue;

    const { representatives, meta } = collapseDuplicates(items);
    visible.push({
      key: group.key,
      label: group.label,
      items,
      representatives,
      meta,
    });
    shownCount += representatives.length;
    for (const rep of representatives) flatOrder.push(rep.id);
  }

  return { groups: visible, shownCount, flatOrder };
}
