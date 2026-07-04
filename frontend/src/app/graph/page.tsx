import { AppMain } from "@/components/AppMain";
import { AuthGate } from "@/components/AuthGate";
import { DocumentHeader } from "@/components/DocumentHeader";
import { StructureView } from "@/components/StructureView";

export const metadata = { title: "Marks & structure · Bidframe" };

export default function GraphPage() {
  return (
    <AuthGate>
      <DocumentHeader title="Marks & structure" />
      <AppMain>
        <StructureView />
      </AppMain>
    </AuthGate>
  );
}
