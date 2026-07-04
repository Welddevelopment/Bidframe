// A typeset facsimile of the Bradwell tender's page 7 — the clause 4.6 wall of
// legal text — built in TSX instead of a screenshot so it stays crisp on any
// projector. Before the reveal it reads as undifferentiated legalese; when
// `highlighted` flips, the five buried disqualifiers pick up their oxblood
// marks one after another. Wording follows the extracted requirement
// (brad-r0006); surrounding sections are greeked so no legal text is invented.

const REJECTION_ITEMS = [
  "fixes or adjusts the prices and rates shown in its Tender by agreement or arrangement with any other party;",
  "communicates or discloses the prices or rates shown in its Tender to any other party before the award of the contract;",
  "enters into any agreement with any other party that such party shall refrain from tendering;",
  "offers or agrees to pay or give any sum of money, inducement or valuable consideration in connection with this Tender;",
  "commits an offence under the Bribery Act 2010 or gives any fee or reward the receipt of which is an offence.",
];

function GreekLines({ count, short = false }: { count: number; short?: boolean }) {
  return (
    <div className="pitch-facsimile__greek" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          style={{
            width: short && i === count - 1 ? "62%" : `${100 - ((i * 7) % 13)}%`,
          }}
        />
      ))}
    </div>
  );
}

export function TenderPageFacsimile({ highlighted }: { highlighted: boolean }) {
  return (
    <div
      className={`pitch-facsimile ${highlighted ? "is-highlighted" : ""}`}
      aria-hidden="true"
    >
      <header className="pitch-facsimile__head">
        <span>Invitation to Tender — Grounds Maintenance Services</span>
        <span>Page 7 of 34</span>
      </header>

      <p className="pitch-facsimile__section">4.5 — Tender validity</p>
      <GreekLines count={3} short />

      <p className="pitch-facsimile__section pitch-facsimile__section--live">
        4.6 — Rejection of Tender
      </p>
      <p className="pitch-facsimile__body">
        A Tender will be rejected and shall not be further considered where the
        tenderer:
      </p>
      <ol className="pitch-facsimile__clauses">
        {REJECTION_ITEMS.map((item, i) => (
          <li key={item} style={{ transitionDelay: `${180 + i * 160}ms` }}>
            <span>({String.fromCharCode(97 + i)})</span>
            <em>{item}</em>
          </li>
        ))}
      </ol>

      <p className="pitch-facsimile__section">4.7 — Freedom of information</p>
      <GreekLines count={4} short />
    </div>
  );
}
