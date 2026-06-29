import { MatrixView } from "@/components/MatrixView";
import { mockTender } from "@/data/mock-requirements";

// The product's document view, relocated from "/" to "/review" so the landing
// page owns the root (landing-page-brief §5). The full-bleed header, triage line,
// and worklist body all live inside MatrixView. This route is also the preloaded
// demo the landing page's "See it run" link points at. Data source rules are
// unchanged: mock by default, live when NEXT_PUBLIC_API_BASE_URL is set.
export default function Review() {
  return <MatrixView title={mockTender.title} />;
}
