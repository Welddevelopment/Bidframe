// Category colour coding (the "index tab" layer). Each requirement category gets
// a muted, labelled colour so the worklist can be scanned and sorted by the kind
// of ask. These are CONTENT colours: deliberately softer than, and kept clear of,
// the reserved brand and status hues (forest = your action, oxblood/amber/yellow/
// green = status, teal = source). Every use carries the label too, so the colour
// never has to disambiguate on its own. Unknown categories fall back to a neutral
// ink so a new category from the backend still renders honestly.

export type CategoryStyle = { label: string; hex: string };

const CATEGORY: Record<string, CategoryStyle> = {
  certification: { label: "Certification", hex: "#4f57a0" }, // indigo
  insurance: { label: "Insurance", hex: "#2f7d86" }, // teal-cyan
  financial: { label: "Financial", hex: "#8a6d3b" }, // ochre
  experience: { label: "Experience", hex: "#7d4f86" }, // plum
  compliance: { label: "Compliance", hex: "#566b7a" }, // slate
  service: { label: "Service", hex: "#b0736a" }, // terracotta
  sustainability: { label: "Sustainability", hex: "#5f8a4e" }, // moss
  social_value: { label: "Social value", hex: "#9a5a86" }, // magenta
};

const NEUTRAL: CategoryStyle = { label: "Uncategorised", hex: "#6b6358" };

function humanise(raw: string): string {
  const s = raw.replace(/[_-]+/g, " ").trim();
  return s ? s[0].toUpperCase() + s.slice(1) : NEUTRAL.label;
}

export function categoryStyle(
  category: string | null | undefined
): CategoryStyle {
  if (!category) return NEUTRAL;
  return CATEGORY[category] ?? { label: humanise(category), hex: NEUTRAL.hex };
}
