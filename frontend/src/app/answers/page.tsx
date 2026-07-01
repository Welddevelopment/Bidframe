import { AppMain } from "@/components/AppMain";
import { AnswersBody } from "@/components/AnswersBody";
import { AuthGate } from "@/components/AuthGate";
import { DocumentHeader } from "@/components/DocumentHeader";

export const metadata = { title: "Answers, with receipts · Bidframe" };

export default function AnswersPage() {
  return (
    <AuthGate>
      <div className="flex min-h-full flex-col bg-paper">
        <DocumentHeader title="Answers, with receipts" />

        <AppMain className="flex-1">
          <AnswersBody />
        </AppMain>
      </div>
    </AuthGate>
  );
}
