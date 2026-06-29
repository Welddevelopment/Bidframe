"use client";

import Link from "next/link";

// The two landing-page calls to action (landing-page-brief §3, §14). The primary
// is one forest "Book a demo" button, the only saturated colour in its viewport.
// The secondary is a quiet "See it run" link into the preloaded demo at /review,
// so a cold visitor watches it work with no upload friction. Each fires exactly
// one analytics event; nothing else on the page is instrumented.

// TODO (brief §16.1): swap for the real destination, a scheduling link
// (Cal.com / Calendly) or a team mailto. Built as a single, easily-swapped href.
const BOOKING_URL = "#book-a-demo";

function track(event: string, props?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  // Push to a dataLayer if analytics is wired downstream; a safe no-op otherwise.
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer?.push({ event, ...props });
}

export function BookDemoButton({
  location,
  variant = "button",
  className,
}: {
  location: string;
  variant?: "button" | "link";
  className?: string;
}) {
  const style =
    variant === "button"
      ? "inline-flex items-center justify-center rounded-md bg-forest px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-forest-hover"
      : "text-sm text-ink-muted underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:text-forest";

  return (
    <a
      href={BOOKING_URL}
      onClick={() => track("demo_cta_click", { location })}
      className={`${style} focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper${
        className ? ` ${className}` : ""
      }`}
    >
      Book a demo
    </a>
  );
}

export function SeeItRunLink({ className }: { className?: string }) {
  return (
    <Link
      href="/review"
      onClick={() => track("see_it_run_click")}
      className={`text-sm text-ink-muted underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper${
        className ? ` ${className}` : ""
      }`}
    >
      See it run on a tender you already know
    </Link>
  );
}
