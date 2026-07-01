import { categoryStyle } from "@/lib/categoryStyle";

// The category chips. Two forms of the same colour: a bare dot for the dense
// matrix rows (the label carried on hover and in the open panel) and a labelled
// pill for the detail panel and anywhere with room. The dot is the pure category
// hue; the pill tints its ground softly and darkens the label toward ink so it
// stays legible at chip size, so the colour reads without a raw low-contrast fill.

export function CategoryDot({
  category,
  className = "",
}: {
  category: string | null | undefined;
  className?: string;
}) {
  const { label, hex } = categoryStyle(category);
  return (
    <span
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${className}`}
      style={{ backgroundColor: hex, boxShadow: "0 0 0 1px rgba(33,29,23,0.18)" }}
      title={label}
      aria-label={label}
      role="img"
    />
  );
}

export function CategoryTag({
  category,
  className = "",
}: {
  category: string | null | undefined;
  className?: string;
}) {
  const { label, hex } = categoryStyle(category);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] ${className}`}
      style={{
        color: `color-mix(in oklab, ${hex} 62%, var(--color-ink))`,
        backgroundColor: `color-mix(in oklab, ${hex} 14%, var(--color-paper-raised))`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: hex }}
        aria-hidden
      />
      {label}
    </span>
  );
}
