import type { Metadata } from "next";
import type { Tender } from "@/types/requirement";
import { RequirementsProvider } from "@/context/RequirementsContext";
import { MatrixView } from "@/components/MatrixView";
import mixedPackPrebake from "@/data/mixedpack-prebake.json";

// The mixed-pack front door: the SAME interactive product (MatrixView) as /showcase, but seeded
// with a frozen run over a real MIXED pack — a PDF ITT + a Word return-forms doc + an Excel pricing
// schedule + a CSV checklist. Proves the whole mixed-pack story instantly, offline, with no backend,
// no API key, no auth: one compliance matrix across four file formats, per-file source provenance,
// deal-breakers caught in the Word/Excel/CSV too, and NO fake PDF highlight on Office rows. This is
// what makes the shipped ingestion feature demoable/screenshot-able — see ops/mixed-pack-04/05.
const packTender = mixedPackPrebake as unknown as Tender;

export const metadata: Metadata = {
  title: "Bidframe — tender pack walkthrough",
  robots: { index: false },
};

export default function PackPage() {
  return (
    <RequirementsProvider initialTender={packTender}>
      <MatrixView title={packTender.title} />
    </RequirementsProvider>
  );
}
