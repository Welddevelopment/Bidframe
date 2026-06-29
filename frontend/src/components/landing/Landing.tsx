import { BookDemoButton, SeeItRunLink } from "./BookDemoButton";
import { HeroResolve } from "./HeroResolve";

// The public landing page (landing-page-brief). It is itself a civic record: the
// same paper, masthead, rules, mono record voice, and real product components as
// the app, so the medium makes the credibility argument before a word is read.
// One job: get a bid writer to book a demo. Copy is final per the brief §7
// (British spelling, no em dashes, no hype, count facts never score). The two
// width caps from layout.md apply: a ~1160px container, prose capped near 64ch.

const CONTAINER = "mx-auto w-full max-w-[1160px] px-6";
const PROSE = "max-w-[64ch]";

export function Landing() {
  return (
    <>
      {/* §7.1 Masthead: a mono running head over the one 2px ink rule on the
          page. No nav tabs; a single quiet "Book a demo" link mirrors the hero. */}
      <header className="border-b-2 border-ink bg-paper">
        <div className={`${CONTAINER} flex items-center justify-between py-4`}>
          <span className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-ink">
            Bidframe
          </span>
          <BookDemoButton location="masthead" variant="link" />
        </div>
      </header>

      <main>
        {/* §7.2 Hero: the promise and the one action above the fold, beside the
            resolve. */}
        <section className={`${CONTAINER} py-16 sm:py-20`}>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-serif text-ink">
                <span className="block text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
                  Never lose a bid
                </span>
                <span className="mt-2 block text-2xl font-medium leading-snug text-ink-muted sm:text-3xl">
                  to a deal-breaker you missed.
                </span>
              </h1>

              <p className={`${PROSE} mt-6 text-lg leading-relaxed text-ink`}>
                Bidframe reads a public-sector tender, finds every requirement, and
                flags the ones that would disqualify you. Each links back to the
                exact clause, so you can check it yourself.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <BookDemoButton location="hero" />
                <SeeItRunLink />
              </div>
            </div>

            <HeroResolve />
          </div>
        </section>

        {/* §7.3 The before: name the cost of the status quo, plainly. */}
        <Section>
          <SectionHead>Three weeks of reading, and one missed line voids it</SectionHead>
          <p className={`${PROSE} mt-4 text-lg leading-relaxed text-ink`}>
            A bid writer spends weeks reading a public-sector tender by hand. The
            requirements are scattered across a hundred pages, and the ones that
            disqualify you if you miss them look just like the ones that do not.
          </p>
        </Section>

        {/* §7.4 The catch: the disqualifier-first feature. */}
        <Section>
          <SectionHead>The one that loses you the bid, first</SectionHead>
          <p className={`${PROSE} mt-4 text-lg leading-relaxed text-ink`}>
            Public tenders have hard pass or fail gates. Bidframe puts those
            deal-breakers at the top, not buried on page 61, so you see the
            bid-killer before you read anything else.
          </p>
        </Section>

        {/* §7.5 How it works: three plain steps, provisional verbs, quiet mono
            numbering tied to real ordered steps. */}
        <Section>
          <SectionHead>How it works</SectionHead>
          <ol className="mt-6 grid gap-8 sm:grid-cols-3">
            <Step
              n="1"
              title="Upload the tender."
              body="Drop in the PDF. Bidframe reads it and finds every requirement, with its source."
            />
            <Step
              n="2"
              title="Review the worklist."
              body="Each requirement comes with its confidence and its clause reference. The deal-breakers and the uncertain ones are flagged for a closer look. You approve, edit, or flag each one."
            />
            <Step
              n="3"
              title="Draft your answers."
              body="Bidframe drafts each answer from your own documents and shows where it came from. It asks you only the handful of things it cannot find. You approve every line."
            />
          </ol>
        </Section>

        {/* §7.6 Trust: traceability, the wedge against generative tools. */}
        <Section>
          <SectionHead>Every line, back to its clause</SectionHead>
          <p className={`${PROSE} mt-4 text-lg leading-relaxed text-ink`}>
            We pulled these from the tender. One click shows the exact sentence on
            the exact page, so you never take our word for it.
          </p>
          {/* A single requirement row with its clause in the mono margin and the
              source excerpt highlighted. Schema fields, no invented format. */}
          <div className="mt-6 max-w-[58ch] rounded-md border border-hairline bg-paper-raised p-4">
            <div className="grid grid-cols-[auto_1fr] gap-x-4">
              <span className="font-mono text-xs text-ink-muted">
                Section 4.2.1
                <br />
                p.14
              </span>
              <div>
                <p className="text-ink">
                  The supplier must hold ISO 9001 certification.
                </p>
                <p className="mt-2 border-l-2 border-forest pl-3 font-mono text-xs leading-relaxed text-ink-muted">
                  &ldquo;Tenderers shall hold and maintain certification to ISO
                  9001 for the duration of the contract.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* §7.7 Honesty: the flag is a feature. One amber row, never a number. */}
        <Section>
          <SectionHead>It tells you when it is not sure</SectionHead>
          <p className={`${PROSE} mt-4 text-lg leading-relaxed text-ink`}>
            Where the tool is unsure, it says so and flags it for you to check. It
            does not guess, and it does not dress a rough draft up as a finished one.
          </p>
          <div className="mt-6 inline-flex items-center gap-2.5 rounded-md border border-hairline bg-paper-raised px-4 py-2.5">
            <span
              aria-hidden
              className="h-2.5 w-2.5 shrink-0 rounded-full bg-signal-amber ring-1 ring-ink/40"
            />
            <span className="text-sm text-ink-muted">Low confidence</span>
          </div>
        </Section>

        {/* §7.8 Answers, with receipts: the auditable-autofill payoff. */}
        <Section>
          <SectionHead>Answers, with receipts</SectionHead>
          <p className={`${PROSE} mt-4 text-lg leading-relaxed text-ink`}>
            Bidframe drafts each answer from your own documents and shows which one
            it came from. You approve every line before it goes in the bid.
          </p>
        </Section>

        {/* §7.9 Proof: the eval numbers as plain, honest counts. Figures in mono,
            labels in Chillax. Never a percentage or a score. */}
        <Section>
          <SectionHead>Measured on a real tender</SectionHead>
          <p className={`${PROSE} mt-4 text-lg leading-relaxed text-ink`}>
            We ran Bidframe on a live public-sector cleaning contract and checked
            every line by hand.
          </p>
          <dl className="mt-8 grid gap-8 sm:grid-cols-3">
            <Count figure="Every deal-breaker" label="caught." />
            <Count
              figure="18 of 19"
              label="requirements found. The one it was unsure of, flagged for you."
            />
            <Count
              figure="0 answers invented."
              label="Every claim links back to your own document."
            />
          </dl>
        </Section>

        {/* §7.10 Before and after: the legibility anchor, a real table with
            hairline rules and no per-cell boxes. */}
        <Section>
          <SectionHead>Before, and with Bidframe</SectionHead>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-ink">
              <thead>
                <tr className="border-b border-ink">
                  <th scope="col" className="py-3 pr-6 font-mono text-xs font-medium uppercase tracking-wide text-ink-muted" />
                  <th scope="col" className="py-3 pr-6 font-serif text-base font-medium">
                    Before
                  </th>
                  <th scope="col" className="py-3 font-serif text-base font-medium">
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
          </div>
        </Section>

        {/* §7.11 Closing call to action. */}
        <section className={`${CONTAINER} border-t border-hairline py-16 sm:py-20`}>
          <SectionHead>See it on a tender you already know</SectionHead>
          <p className={`${PROSE} mt-4 text-lg leading-relaxed text-ink`}>
            The quickest way to judge Bidframe is to watch it read a tender you have
            already bid. Book fifteen minutes and bring one.
          </p>
          <div className="mt-8">
            <BookDemoButton location="closing" />
          </div>
        </section>
      </main>

      {/* §7.12 Footer: minimal, mono record voice, nothing that overclaims. */}
      <footer className="border-t-2 border-ink bg-paper">
        <div className={`${CONTAINER} flex flex-wrap items-center justify-between gap-4 py-8`}>
          <span className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-ink">
            Bidframe
          </span>
          <SeeItRunLink className="!text-ink-muted" />
        </div>
      </footer>
    </>
  );
}

// A standard page section: a top hairline rule between major sections and the
// shared container and rhythm (design-language rule hierarchy).
function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline">
      <div className={`${CONTAINER} py-16 sm:py-20`}>{children}</div>
    </section>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl">
      {children}
    </h2>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="border-t border-hairline pt-4">
      <span className="font-mono text-xs text-ink-muted">{n} / 3</span>
      <h3 className="mt-1 font-sans text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 leading-relaxed text-ink-muted">{body}</p>
    </li>
  );
}

function Count({ figure, label }: { figure: string; label: string }) {
  return (
    <div className="border-t border-hairline pt-4">
      <dt className="font-mono text-lg font-medium leading-snug text-ink">
        {figure}
      </dt>
      <dd className="mt-1.5 leading-relaxed text-ink-muted">{label}</dd>
    </div>
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
    <tr className="border-b border-hairline align-top">
      <th
        scope="row"
        className="py-3 pr-6 font-mono text-xs font-normal uppercase tracking-wide text-ink-muted"
      >
        {label}
      </th>
      <td className="py-3 pr-6 text-ink-muted">{before}</td>
      <td className="py-3 text-ink">{after}</td>
    </tr>
  );
}
