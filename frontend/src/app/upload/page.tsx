import { AppMain } from "@/components/AppMain";
import { AuthGate } from "@/components/AuthGate";
import { DocumentHeader } from "@/components/DocumentHeader";
import { TendersList } from "@/components/TendersList";
import { UploadDropzone } from "@/components/UploadDropzone";

export const metadata = { title: "Tenders · Bidframe" };

export default function UploadPage() {
  return (
    <AuthGate>
      <DocumentHeader title="Your tenders" showReference={false} />
      <AppMain>
        {/* The upload entry: one prominent, centred slot as the single focal
            action, with the register of already-uploaded tenders filed
            beneath it — one page for adding a tender and reopening one. */}
        <div className="mx-auto max-w-2xl pt-10">
          <UploadDropzone />
        </div>
        <section aria-label="Your tenders" className="mx-auto mt-14 max-w-2xl">
          <h2 className="font-serif text-lg font-semibold leading-snug text-ink">
            Previously uploaded
          </h2>
          <p className="mb-4 mt-1 max-w-[60ch] text-sm text-ink-muted">
            Every tender you have uploaded, ready to reopen where you left off.
          </p>
          <TendersList />
        </section>
      </AppMain>
    </AuthGate>
  );
}
