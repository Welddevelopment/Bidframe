import { AppMain } from "@/components/AppMain";
import { AuthGate } from "@/components/AuthGate";
import { DocumentHeader } from "@/components/DocumentHeader";
import { TeamsManager } from "@/components/TeamsManager";

export const metadata = { title: "Teams · Bidframe" };

export default function TeamsPage() {
  return (
    <AuthGate>
      <DocumentHeader title="Your teams" showReference={false} />
      <AppMain>
        <div className="mx-auto max-w-4xl pt-6">
          <p className="mb-8 max-w-[62ch] text-sm leading-relaxed text-ink-muted">
            Add teammates once, then share tenders with the whole team.
          </p>
          <TeamsManager />
        </div>
      </AppMain>
    </AuthGate>
  );
}
