import type { Metadata } from "next";
import { Landing } from "@/components/landing/Landing";

// The public landing page is the root route (landing-page-brief §5); the product
// matrix moved to /review. Metadata is set here in voice, British spelling, no
// hype (§12). Note: the brief wrote the title with an em dash, but the copy rules
// ban em dashes, so the system docs win (§6) and a colon is used instead.
export const metadata: Metadata = {
  title: "Bidframe: never lose a bid to a deal-breaker you missed",
  description:
    "Bidframe reads a public-sector tender, finds every requirement, flags the deal-breakers that would disqualify you, and links each to its source clause. Built for SME bidders and small bid-writing consultancies.",
  openGraph: {
    title: "Bidframe: never lose a bid to a deal-breaker you missed",
    description:
      "Bidframe reads a public-sector tender, finds every requirement, flags the deal-breakers that would disqualify you, and links each to its source clause. Built for SME bidders and small bid-writing consultancies.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bidframe: never lose a bid to a deal-breaker you missed",
    description:
      "Bidframe reads a public-sector tender, finds every requirement, flags the deal-breakers that would disqualify you, and links each to its source clause.",
  },
};

export default function Home() {
  return <Landing />;
}
