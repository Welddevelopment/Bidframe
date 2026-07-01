import type { Metadata } from "next";
import { Landing } from "@/components/landing/Landing";

// The public landing page lives at the app root so it inherits the design
// tokens and fonts, and the CTAs flow into the live product. The demo matrix
// now lives at /review (landing-page-brief §5). The composition is in
// components/landing/Landing.tsx.
const title = "Bidframe: never lose a bid to a deal-breaker you missed";
const description =
  "Bidframe reads a public-sector tender, finds every requirement, flags the deal-breakers that would disqualify you, and links each to its source clause. Built for SME bidders and small bid-writing consultancies.";

// TODO: og.png generated post-build from the hero still (1200x630 screenshot).
// The path is referenced now; the bitmap is dropped into public/ separately.
const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "A public-sector tender resolving into a compliance checklist, with the deal-breaker settled at the top.",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    siteName: "Bidframe",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

export default function Page() {
  return <Landing />;
}
