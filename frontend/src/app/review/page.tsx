import type { Tender } from "@/types/requirement";
import { AuthGate } from "@/components/AuthGate";
import { MatrixView } from "@/components/MatrixView";
import bradwellPrebake from "@/data/bradwell-prebake.json";

// The document view: one tender filling the screen. The full-bleed header (title,
// triage line, single Next action) and the centred worklist body both live inside
// MatrixView, which owns the shared selection and filter state (layout.md sections
// 1, 2 and 8). This page is the thin shell that names the tender. The title seeds
// the demo/export label; live, MatrixView shows the loaded tender (or the
// NoTenderLoaded gate) — matching the app-wide RequirementsProvider default.
const demoDefault = bradwellPrebake as unknown as Tender;

export default function ReviewPage() {
  return (
    <AuthGate>
      <MatrixView title={demoDefault.title} />
    </AuthGate>
  );
}
