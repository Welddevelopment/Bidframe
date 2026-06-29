import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bidframe — never lose a bid to a deal-breaker you missed",
  description:
    "Bidframe reads a public-sector tender, finds every requirement, flags the deal-breakers that would disqualify you, and links each to its source clause. Built for SME bidders and small bid-writing consultancies.",
  openGraph: {
    title: "Bidframe — never lose a bid to a deal-breaker you missed",
    description:
      "Bidframe reads a public-sector tender, finds every requirement, flags the deal-breakers that would disqualify you, and links each to its source clause. Built for SME bidders and small bid-writing consultancies.",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* Masthead */}
      <header className="border-b-2 border-ink bg-paper">
        <div className="mx-auto flex max-w-[1160px] items-center justify-between px-6 py-4">
          <h1 className="font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">
            BIDFRAME
          </h1>
          <Link
            href="#demo"
            className="text-sm text-ink-muted transition-colors hover:text-ink"
          >
            Book a demo
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1160px] px-6 py-16">
        {/* Hero */}
        <section className="mb-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="max-w-[64ch]">
              <h2 className="font-serif text-[34px] font-semibold leading-tight text-ink">
                Never lose a bid
              </h2>
              <p className="font-serif text-[24px] font-medium text-ink-muted">
                to a deal-breaker you missed.
              </p>
              <p className="mt-6 text-base leading-relaxed text-ink">
                Bidframe reads a public-sector tender, finds every requirement, and
                flags the ones that would disqualify you. Each links back to the exact
                clause, so you can check it yourself.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <a
                  href="#demo"
                  className="rounded-md bg-forest px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-forest-hover"
                  data-analytics="demo_cta_click"
                  data-location="hero"
                >
                  Book a demo
                </a>
                <Link
                  href="/review"
                  className="text-sm text-ink-muted transition-colors hover:text-ink"
                  data-analytics="see_it_run_click"
                >
                  See it run on a tender you already know.
                </Link>
              </div>
            </div>

            {/* Hero resolve - static for now, animation to be added */}
            <div className="flex items-center justify-center bg-paper-raised p-8">
              <div className="text-center">
                <div className="mb-4 h-32 w-48 border border-hairline bg-paper p-4">
                  <div className="space-y-2">
                    <div className="h-1 w-full bg-hairline" />
                    <div className="h-1 w-3/4 bg-hairline" />
                    <div className="h-1 w-1/2 bg-hairline" />
                  </div>
                </div>
                <p className="font-mono text-xs text-ink-muted">
                  Tender resolves into register
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The before */}
        <section className="mb-20">
          <h2 className="font-serif text-[19px] font-semibold text-ink mb-4">
            Three weeks of reading, and one missed line voids it
          </h2>
          <p className="max-w-[64ch] text-base leading-relaxed text-ink">
            A bid writer spends weeks reading a public-sector tender by hand. The
            requirements are scattered across a hundred pages, and the ones that
            disqualify you if you miss them look just like the ones that do not.
          </p>
        </section>

        {/* The catch */}
        <section className="mb-20">
          <h2 className="font-serif text-[19px] font-semibold text-ink mb-4">
            The one that loses you the bid, first
          </h2>
          <p className="max-w-[64ch] text-base leading-relaxed text-ink">
            Public tenders have hard pass or fail gates. Bidframe puts those
            deal-breakers at the top, not buried on page 61, so you see the
            bid-killer before you read anything else.
          </p>
        </section>

        {/* How it works */}
        <section className="mb-20">
          <h2 className="font-serif text-[19px] font-semibold text-ink mb-8">
            How it works
          </h2>
          <div className="max-w-[64ch] space-y-6">
            <div className="flex gap-4">
              <span className="font-mono text-sm text-ink-muted">1</span>
              <div>
                <p className="font-medium text-ink">Upload the tender.</p>
                <p className="text-sm text-ink-muted">
                  Drop in the PDF. Bidframe reads it and finds every requirement,
                  with its source.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="font-mono text-sm text-ink-muted">2</span>
              <div>
                <p className="font-medium text-ink">Review the worklist.</p>
                <p className="text-sm text-ink-muted">
                  Each requirement comes with its confidence and its clause reference.
                  The deal-breakers and the uncertain ones are flagged for a closer
                  look. You approve, edit, or flag each one.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="font-mono text-sm text-ink-muted">3</span>
              <div>
                <p className="font-medium text-ink">Draft your answers.</p>
                <p className="text-sm text-ink-muted">
                  Bidframe drafts each answer from your own documents and shows where
                  it came from. It asks you only the handful of things it cannot find.
                  You approve every line.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Every line, back to its clause */}
        <section className="mb-20">
          <h2 className="font-serif text-[19px] font-semibold text-ink mb-4">
            Every line, back to its clause
          </h2>
          <p className="max-w-[64ch] text-base leading-relaxed text-ink mb-6">
            We pulled these from the tender. One click shows the exact sentence on the
            exact page, so you never take our word for it.
          </p>
          <div className="max-w-[64ch] rounded-md border border-hairline bg-paper-raised p-4">
            <div className="flex gap-4">
              <span className="font-mono text-xs text-ink-muted">Section 4.2.1</span>
              <p className="text-sm text-ink">
                The supplier must hold current ISO 9001 certification valid for the
                full contract term.
              </p>
            </div>
          </div>
        </section>

        {/* It tells you when it is not sure */}
        <section className="mb-20">
          <h2 className="font-serif text-[19px] font-semibold text-ink mb-4">
            It tells you when it is not sure
          </h2>
          <p className="max-w-[64ch] text-base leading-relaxed text-ink mb-6">
            Where the tool is unsure, it says so and flags it for you to check. It
            does not guess, and it does not dress a rough draft up as a finished one.
          </p>
          <div className="max-w-[64ch] rounded-md border border-hairline bg-paper-raised p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-ink bg-signal-amber">
                <div className="h-2 w-2 rounded-full bg-signal-amber" />
              </div>
              <span className="text-sm text-ink">Low confidence</span>
            </div>
          </div>
        </section>

        {/* Answers, with receipts */}
        <section className="mb-20">
          <h2 className="font-serif text-[19px] font-semibold text-ink mb-4">
            Answers, with receipts
          </h2>
          <p className="max-w-[64ch] text-base leading-relaxed text-ink">
            Bidframe drafts each answer from your own documents and shows which one it
            came from. You approve every line before it goes in the bid.
          </p>
        </section>

        {/* Measured on a real tender */}
        <section className="mb-20">
          <h2 className="font-serif text-[19px] font-semibold text-ink mb-4">
            Measured on a real tender
          </h2>
          <p className="max-w-[64ch] text-base leading-relaxed text-ink mb-6">
            We ran Bidframe on a live public-sector cleaning contract and checked
            every line by hand.
          </p>
          <div className="max-w-[64ch] space-y-3">
            <p className="font-mono text-sm text-ink">
              Every deal-breaker caught.
            </p>
            <p className="font-mono text-sm text-ink">
              18 of 19 requirements found. The one it was unsure of, flagged for you.
            </p>
            <p className="font-mono text-sm text-ink">
              0 answers invented. Every claim links back to your own document.
            </p>
          </div>
        </section>

        {/* Before and after table */}
        <section className="mb-20">
          <h2 className="font-serif text-[19px] font-semibold text-ink mb-6">
            Before, and with Bidframe
          </h2>
          <div className="max-w-[64ch]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="py-2 text-left font-medium text-ink-muted"></th>
                  <th className="py-2 text-left font-medium text-ink-muted">
                    Before
                  </th>
                  <th className="py-2 text-left font-medium text-ink-muted">
                    With Bidframe
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-hairline">
                  <td className="py-2 font-medium text-ink">Time</td>
                  <td className="py-2 text-ink-muted">
                    Weeks of expert reading
                  </td>
                  <td className="py-2 text-ink">Minutes</td>
                </tr>
                <tr className="border-b border-hairline">
                  <td className="py-2 font-medium text-ink">The deal-breaker</td>
                  <td className="py-2 text-ink-muted">
                    A missed gate voids the whole bid
                  </td>
                  <td className="py-2 text-ink">Caught and shown first</td>
                </tr>
                <tr className="border-b border-hairline">
                  <td className="py-2 font-medium text-ink">Trust</td>
                  <td className="py-2 text-ink-muted">
                    You hope the checklist is complete
                  </td>
                  <td className="py-2 text-ink">
                    Every requirement links to its clause
                  </td>
                </tr>
                <tr className="border-b border-hairline">
                  <td className="py-2 font-medium text-ink">Uncertainty</td>
                  <td className="py-2 text-ink-muted">Invisible</td>
                  <td className="py-2 text-ink">Flagged for you to check</td>
                </tr>
                <tr className="border-b border-hairline">
                  <td className="py-2 font-medium text-ink">Your response</td>
                  <td className="py-2 text-ink-muted">A blank page</td>
                  <td className="py-2 text-ink">
                    Drafted from your own documents
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-ink">Control</td>
                  <td className="py-2 text-ink-muted"></td>
                  <td className="py-2 text-ink">
                    You approve, edit, or flag every line
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mb-20">
          <h2 className="font-serif text-[19px] font-semibold text-ink mb-4">
            See it on a tender you already know
          </h2>
          <p className="max-w-[64ch] text-base leading-relaxed text-ink mb-6">
            The quickest way to judge Bidframe is to watch it read a tender you have
            already bid. Book fifteen minutes and bring one.
          </p>
          <a
            href="#demo"
            className="inline-block rounded-md bg-forest px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-forest-hover"
            data-analytics="demo_cta_click"
            data-location="footer"
          >
            Book a demo
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-hairline bg-paper">
        <div className="mx-auto max-w-[1160px] px-6 py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs text-ink-muted">BIDFRAME</p>
              <p className="mt-1 text-sm text-ink-muted">
                <a href="mailto:hello@bidframe.com" className="hover:text-ink">
                  hello@bidframe.com
                </a>
              </p>
            </div>
            <Link
              href="/review"
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              See the demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
