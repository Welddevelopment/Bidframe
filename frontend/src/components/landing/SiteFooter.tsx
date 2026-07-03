import Link from "next/link";

import { BrandLogo } from "@/components/BrandLogo";
import { BookDemoButton } from "@/components/landing/BookDemoButton";
import { PineBranch } from "@/components/landing/art/PineBranch";
import { Seal } from "@/components/landing/art/Seal";
import { TreelineDivider } from "@/components/landing/art/TreelineDivider";

// The site foot as a destination rather than an afterthought: a second,
// nearer treeline drops the page from the pine closing band onto the deeper
// pine-deep ground, where the reversed brand lockup sits large beside the
// engraved seal. Beneath them, the audience line, a small set of quiet
// paper-toned links, and a mono running foot. No invented email or
// overclaims, only what the page already stands behind. Everything textual
// holds at paper/60 or stronger, which clears AA on pine-deep.
const CONTAINER = "mx-auto w-full max-w-[1160px] px-4 sm:px-6";

const linkClass =
  "link-draw rounded-sm text-sm text-paper/70 transition-colors hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-pine-deep";

export function SiteFooter() {
  return (
    <footer className="landing-footer relative overflow-hidden text-paper">
      {/* the divider's own background paints the pine of the closing band
          above, so the pine-deep trees read as a nearer ridge in front of it */}
      <TreelineDivider
        flip
        className="-mb-px block h-14 w-full bg-pine text-pine-deep sm:h-24"
      />
      <div className="landing-footer__ground relative bg-pine-deep">
        <span aria-hidden className="landing-footer__canopy absolute inset-0" />
        <span aria-hidden className="landing-footer__stars absolute inset-0" />
        <span aria-hidden className="landing-footer__mist" />
        <span aria-hidden className="landing-footer__mote landing-footer__mote--1" />
        <span aria-hidden className="landing-footer__mote landing-footer__mote--2" />
        <span aria-hidden className="landing-footer__mote landing-footer__mote--3" />
        <PineBranch
          className="pointer-events-none absolute -right-16 top-8 hidden h-56 w-auto rotate-[16deg] text-paper/[0.08] lg:block"
        />
        <Seal
          id="seal-footer-watermark"
          className="pointer-events-none absolute left-[7%] bottom-8 hidden h-44 w-44 -rotate-[9deg] text-paper/[0.05] lg:block"
        />
        <div className={`${CONTAINER} landing-footer__content relative py-12 sm:py-16`}>
          <div className="landing-footer__panel">
            <div className="landing-footer__brand">
              <BrandLogo reversed className="h-9 w-auto max-w-[12rem] sm:h-12 sm:max-w-none" />
              <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-paper/70">
                For SME bidders and small bid-writing consultancies.
              </p>
            </div>
            <nav aria-label="Footer" className="landing-footer__nav">
              <Link href="/demo" className={linkClass}>
                See the demo
              </Link>
              <Link href="/login" className={linkClass}>
                Sign in
              </Link>
              <BookDemoButton variant="link" tone="pine" location="footer" />
            </nav>
            <div className="landing-footer__seal">
              <Seal
                id="seal-footer"
                className="relative h-24 w-24 text-paper/[0.72] sm:h-28 sm:w-28"
              />
            </div>
          </div>
          <div className="landing-footer__bottom">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
              BIDFRAME
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/[0.45]">
              Public tender worklist
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/[0.45]">
              Filed by Bidframe · 2026
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
