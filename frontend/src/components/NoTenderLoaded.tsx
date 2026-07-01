import Link from "next/link";

// The live-product empty state: shown on the review / answers / graph surfaces
// when no tender has been loaded yet, in place of the sample data. Points the
// user at the upload. The mock showcase build (no API) never renders this.
export function NoTenderLoaded({
  heading = "Nothing to review yet",
  body = "Upload a tender and Bidframe pulls out every requirement, flags the deal-breakers, and brings them here for review.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-20 text-center">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted">
        No tender loaded
      </p>
      <h2 className="mt-3 font-serif text-2xl font-semibold text-ink">
        {heading}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
      <Link
        href="/upload"
        className="mt-6 inline-flex items-center rounded-md bg-forest px-5 py-2.5 text-sm font-semibold text-paper shadow-[var(--depth-control)] transition-colors hover:bg-forest-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        Upload a tender
      </Link>
    </div>
  );
}
