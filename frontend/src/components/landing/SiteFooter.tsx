import Link from "next/link";

import { BrandLogo } from "@/components/BrandLogo";
import { BookDemoButton } from "@/components/landing/BookDemoButton";

// The site foot on the dark ink band: the reversed brand lockup, the audience
// line, a small set of quiet paper-toned links, and a mono running foot. No
// invented email or overclaims, only what the page already stands behind.
const CONTAINER = "mx-auto w-full max-w-[1160px] px-6";

const linkClass =
  "rounded-sm text-sm text-paper/70 underline decoration-paper/30 decoration-1 underline-offset-4 transition-colors hover:text-paper hover:decoration-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className={`${CONTAINER} border-t border-paper/15 py-10`}>
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <BrandLogo reversed className="h-7 w-auto" />
            <p className="mt-2.5 max-w-[34ch] text-sm text-paper/60">
              For SME bidders and small bid-writing consultancies.
            </p>
          </div>
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <Link href="/demo" className={linkClass}>
              See the demo
            </Link>
            <Link href="/login" className={linkClass}>
              Sign in
            </Link>
            <BookDemoButton variant="link" tone="dark" location="footer" />
          </nav>
        </div>
        <p className="mt-10 font-mono text-xs tracking-[0.2em] text-paper/45">
          BIDFRAME
        </p>
      </div>
    </footer>
  );
}
