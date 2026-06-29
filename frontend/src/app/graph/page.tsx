import { AppMain } from "@/components/AppMain";
import { DocumentHeader } from "@/components/DocumentHeader";
import { GraphView } from "@/components/GraphView";

export const metadata = { title: "Graph · Bidframe" };

export default function GraphPage() {
  return (
    <>
      <DocumentHeader title="Requirement relationships" />
      <AppMain>
        <GraphView />
      </AppMain>
    </>
  );
}
