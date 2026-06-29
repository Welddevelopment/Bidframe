import { AppMain } from "@/components/AppMain";
import { DocumentHeader } from "@/components/DocumentHeader";
import { UploadDropzone } from "@/components/UploadDropzone";

export const metadata = { title: "Upload · Bidframe" };

export default function UploadPage() {
  return (
    <>
      <DocumentHeader title="Upload a tender" />
      <AppMain>
        <p className="mb-6 max-w-[64ch] text-sm text-ink-muted">
          Drop in a tender PDF and we&rsquo;ll pull out the requirements.
          Deal-breakers are flagged, uncertainty surfaced.
        </p>

        <UploadDropzone />
      </AppMain>
    </>
  );
}
