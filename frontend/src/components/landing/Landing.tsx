import Link from "next/link";
import { BookDemoButton, SeeItRunLink } from "./BookDemoButton";
import { HeroResolve } from "./HeroResolve";
import { BotanicalSprig } from "./BotanicalSprig";
import { Reveal } from "./Reveal";
import { ConfidenceIndicator } from "@/components/ConfidenceIndicator";
import { BrandLogo } from "@/components/BrandLogo";
import { DealBreakerCard, ClauseCard, AnswerCard } from "./ProductShots";
import { ProofNumbers } from "./ProofNumbers";
import { CredibilityBand } from "./CredibilityBand";
import { HowItWorks } from "./HowItWorks";
import { SiteFooter } from "./SiteFooter";

// The public landing page (landing-page-brief). It is itself a civic record: the
// same paper, masthead, rules, mono record voice, and real product components as
// the app, so the medium makes the credibility argument before a word is read.
// One job: get a bid writer to book a demo.
//
// Layout follows layout.md and SLOP-CHECK: the content-bearing bands run a real
// two-column split (prose one side, the section's card the other) and alternate
// which side the visual sits on from band to band, so the page has rhythm and no
// dead right column. On mobile everything stacks in source order (text before
// visual). Hierarchy comes from type, space, and three rule weights, not boxes.
// The hero and the closing are the two deliberate centred focal moments; the
// giant proof numbers are the climax, held back to just before the closing CTA.

const CONTAINER = "mx-auto w-full max-w-[1160px] px-6";

export function Landing() {
  return (
    <div className="bg-paper paper-grid">
      {/* Masthead: a slim warm letterhead carrying the one 2px ink rule and the
          prominent forest CTA. */}
      <header className="sticky top-0 z-30 border-b-2 border-ink bg-paper/85 backdrop-blur-sm">
        <div className={`${CONTAINER} flex items-center justify-between py-3`}>
          <BrandLogo className="h-7 w-auto" />
          <div className="flex items-center gap-5">
            <Link
              href="/demo"
              className="hidden rounded-sm text-sm text-ink-muted underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:inline"
            >
              See the demo
            </Link>
            <Link
              href="/login"
              className="hidden rounded-sm text-sm text-ink-muted underline decoration-hairline decoration-1 underline-offset-4 transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:inline"
            >
              Sign in
            </Link>
            <BookDemoButton location="masthead" />
          </div>
        </div>
      </header>

      <main>
        {/* Hero: a centred two-line headline, a single supporting line, then the
            product sheet. The one symmetric moment, earned. */}
        <section className={`${CONTAINER} relative pt-16 pb-10 text-center sm:pt-24 sm:pb-14`}>
          <BotanicalSprig className="pointer-events-none absolute left-1 top-10 hidden h-16 w-16 text-forest/25 sm:block" />
          <BotanicalSprig className="pointer-events-none absolute right-1 top-10 hidden h-16 w-16 -scale-x-100 text-forest/25 sm:block" />
          <h1 className="hero-enter font-serif font-semibold tracking-tight text-ink">
            <span className="block text-balance text-5xl leading-[1.02] sm:whitespace-nowrap sm:text-6xl md:text-7xl">
              Never lose a bid
            </span>
            <span className="mt-3 block text-balance text-2xl font-medium leading-[1.12] sm:whitespace-nowrap sm:text-3xl md:text-4xl">
              to a deal-breaker you missed.
            </span>
          </h1>
          <p className="hero-enter-2 mx-auto mt-6 max-w-[58ch] text-balance text-lg leading-relaxed text-ink-muted sm:text-xl">
            Bidframe reads a public-sector tender, finds every requirement, and
            flags the ones that would disqualify you. Each links back to the exact
            clause, so you can check it yourself.
          </p>
          <div className="hero-enter-3 mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <BookDemoButton location="hero" size="lg" />
            <SeeItRunLink size="lg" />
          </div>
          <p className="hero-enter-3 mx-auto mt-5 font-mono text-xs text-ink-muted">
            Fifteen minutes. Bring a tender you have already bid.
          </p>
        </section>

        <section className={`${CONTAINER} relative pb-20`}>
          <BotanicalSprig className="pointer-events-none absolute -left-2 top-0 z-10 hidden h-16 w-16 text-forest/55 sm:block" />
          <BotanicalSprig className="pointer-events-none absolute -right-2 bottom-24 z-10 hidden h-16 w-16 rotate-180 text-forest/55 sm:block" />
          <HeroResolve />
        </section>

        {/* The before: calm, left-aligned, low weight. A quiet single-column
            opener, no visual, so the two-column bands below land with rhythm. */}
        <Band>
          <Head>Three weeks of reading, and one missed line voids it</Head>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-ink-muted">
            A bid writer spends weeks reading a public-sector tender by hand. The
            requirements are scattered across a hundred pages, and the ones that
            disqualify you look just like the ones that do not.
          </p>
        </Band>

        {/* The catch: the hero feature, given weight. Text left, the oxblood
            deal-breaker lifted off the page on the right. The point of tension. */}
        <SplitBand visual={<DealBreakerCard />}>
          <Head>The one that loses you the bid, first</Head>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            Public tenders have hard pass or fail gates. Bidframe puts the
            deal-breakers at the top, not buried on page 61, so you see the
            bid-killer before you read anything else.
          </p>
        </SplitBand>

        {/* How it works: three numbered steps joined by a ruled through-line. Full
            width, its own three columns, so it reads as a ledger row. */}
        <Band>
          <Head>Three steps, and you stay in control</Head>
          <div className="mt-9">
            <HowItWorks />
          </div>
        </Band>

        {/* Trust: the ruled margin and a pressed evidence block. Card left, prose
            right, so the visual flips side from the band above. */}
        <SplitBand visual={<ClauseCard />} reverse surface="recessed">
          <Head>Every line, back to its clause</Head>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            We pulled these from the tender. One click shows the exact sentence on
            the exact page, so you never take our word for it.
          </p>
        </SplitBand>

        {/* Honesty: the four-tier confidence scale as dimensional beads. Text
            left, the scale on the right. */}
        <SplitBand
          visual={
            <div className="card-live surface-grain w-full rounded-lg border border-hairline bg-paper-raised p-7 shadow-[var(--depth-row)]">
              <div className="flex flex-col gap-4">
                <ConfidenceBead
                  confidence={0.3}
                  unanswerable
                  example="No source found for this"
                />
                <ConfidenceBead confidence={0.5} example="The clause is ambiguous" />
                <ConfidenceBead
                  confidence={0.7}
                  example="Likely, but check the date"
                />
                <ConfidenceBead
                  confidence={0.92}
                  example="Matches a clause word for word"
                />
              </div>
            </div>
          }
          visualWidth="lg:w-[360px]"
        >
          <Head>It tells you when it is not sure</Head>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            Where the tool is unsure, it says so and flags it for you to check. It
            does not guess, and it does not dress a rough draft up as a finished
            one.
          </p>
        </SplitBand>

        {/* Answers, with receipts: the autofill payoff and the approval stamp.
            Card left, prose right, flipping side again. */}
        <SplitBand visual={<AnswerCard />} reverse>
          <Head>Answers, with receipts</Head>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            Bidframe drafts each answer from your own documents and shows which one
            it came from. You approve every line before it goes in the bid.
          </p>
        </SplitBand>

        {/* Before and after: a ruled ledger (1px rules, no heavy ink). Full width,
            the table is the visual. */}
        <Band space="air">
          <Head>Before, and with Bidframe</Head>
          <Reveal className="mt-7 overflow-x-auto">
            <table className="w-full max-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ink">
                  <th className="w-[24%] py-3 pr-6" />
                  <th className="py-3 pr-6 font-serif text-base font-medium text-ink-muted">
                    Before
                  </th>
                  <th className="border-l border-forest/30 bg-forest/5 py-3 pl-6 font-serif text-base font-medium text-forest">
                    With Bidframe
                  </th>
                </tr>
              </thead>
              <tbody>
                <Row label="Time" before="Weeks of expert reading" after="Minutes" />
                <Row
                  label="The deal-breaker"
                  before="A missed gate voids the whole bid"
                  after="Caught and shown first"
                />
                <Row
                  label="Trust"
                  before="You hope the checklist is complete"
                  after="Every requirement links to its clause"
                />
                <Row
                  label="Uncertainty"
                  before="Invisible"
                  after="Flagged for you to check"
                />
                <Row
                  label="Your response"
                  before="A blank page"
                  after="Drafted from your own documents"
                />
                <Row
                  label="Control"
                  before=""
                  after="You approve, edit, or flag every line"
                />
              </tbody>
            </table>
          </Reveal>
        </Band>

        {/* Credibility: where the counts come from, in plain provisional terms.
            Sits just before the proof it explains. */}
        <Band space="tight">
          <CredibilityBand />
        </Band>

        {/* Ink band 1: the proof, as giant mono figures reversed out on ink. Held
            back to here so the page builds toward it as the climax before the
            closing action. */}
        <section className="bg-ink">
          <div className={`${CONTAINER} py-24 sm:py-32`}>
            <div className="max-w-[48ch]">
              <Head tone="dark">Measured on a real tender</Head>
              <p className="mt-5 text-lg leading-relaxed text-paper/70">
                We ran Bidframe on a live public-sector cleaning contract and
                checked every line against the source.
              </p>
            </div>
            <Reveal className="mt-12">
              <ProofNumbers />
            </Reveal>
          </div>
        </section>
      </main>

      {/* Ink band 2: the closing. A lifted response card on the dark ground,
          carrying the one primary action: Book a demo. */}
      <section className="bg-ink">
        <div className={`${CONTAINER} py-24 sm:py-32`}>
          <div className="surface-grain mx-auto max-w-[600px] rounded-2xl border border-hairline bg-paper-raised p-8 text-center shadow-[var(--depth-sheet)] sm:p-10">
            <h2 className="mx-auto max-w-[20ch] font-serif text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
              See it on a tender you already know
            </h2>
            <p className="mx-auto mt-4 max-w-[46ch] leading-relaxed text-ink-muted">
              The quickest way to judge Bidframe is to watch it read a tender you
              have already bid. Book fifteen minutes and bring one.
            </p>
            <div className="mt-7 flex justify-center">
              <BookDemoButton location="closing" />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

// A paper section, left-aligned to the reading edge, separated by a section
// rule. Hierarchy from type and space, not boxes. `surface` opts one band onto
// the recessed ground (a third value between paper and the ink bands); `space`
// varies the vertical rhythm so related ideas cluster and the summarising bands
// get more air, instead of a uniform py on every band.
function Band({
  children,
  surface = "paper",
  space = "normal",
}: {
  children: React.ReactNode;
  surface?: "paper" | "recessed";
  space?: "tight" | "normal" | "air";
}) {
  const pad =
    space === "tight"
      ? "py-12 sm:py-14"
      : space === "air"
        ? "py-20 sm:py-28"
        : "py-16 sm:py-20";
  return (
    <section
      className={`border-t border-rule-section ${
        surface === "recessed" ? "bg-paper-recessed" : ""
      }`}
    >
      <div className={`${CONTAINER} ${pad}`}>{children}</div>
    </section>
  );
}

// One confidence bead paired with a short plain example, so the four-tier scale
// teaches what each level means rather than only decorating. The example sits in
// the mono record voice and stays greyscale-safe (no colour, no percentage).
function ConfidenceBead({
  confidence,
  unanswerable = false,
  example,
}: {
  confidence: number;
  unanswerable?: boolean;
  example: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <ConfidenceIndicator
        confidence={confidence}
        unanswerable={unanswerable}
        variant="word"
      />
      <span className="pl-[30px] font-mono text-xs text-ink-muted">
        {example}
      </span>
    </div>
  );
}

// A content-bearing band with a real two-column split: prose on one side, the
// section's card on the other. `reverse` flips which side the card sits on from
// band to band so the page has rhythm; the DOM keeps prose first so that on
// mobile everything stacks in source order (text before visual).
function SplitBand({
  children,
  visual,
  reverse = false,
  visualWidth = "lg:w-[440px]",
  surface = "paper",
}: {
  children: React.ReactNode;
  visual: React.ReactNode;
  reverse?: boolean;
  visualWidth?: string;
  surface?: "paper" | "recessed";
}) {
  return (
    <Band surface={surface}>
      <div
        className={`grid gap-8 lg:items-center lg:gap-16 ${
          reverse ? "lg:grid-cols-[auto_1fr]" : "lg:grid-cols-[1fr_auto]"
        }`}
      >
        <div className={`max-w-[46ch] ${reverse ? "lg:order-2" : ""}`}>
          {children}
        </div>
        <div className={`w-full ${visualWidth} ${reverse ? "lg:order-1" : ""}`}>
          {visual}
        </div>
      </div>
    </Band>
  );
}

function Head({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <h2
      className={`max-w-[20ch] font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl ${
        tone === "dark" ? "text-paper" : "text-ink"
      }`}
    >
      {children}
    </h2>
  );
}

function Row({
  label,
  before,
  after,
}: {
  label: string;
  before: string;
  after: string;
}) {
  return (
    <tr className="border-b border-hairline align-top transition-colors hover:bg-paper-raised">
      <th
        scope="row"
        className="py-3 pr-6 text-left font-mono text-xs font-normal uppercase tracking-wide text-ink-muted"
      >
        {label}
      </th>
      <td className="py-3 pr-6 text-ink-muted">{before}</td>
      <td className="border-l border-forest/30 bg-forest/5 py-3 pl-6 text-ink">
        {after}
      </td>
    </tr>
  );
}
