"use client";

import { useRequirements } from "@/context/RequirementsContext";
import { isApiEnabled } from "@/lib/api";
import { AutofillButton } from "./AutofillButton";
import { CapabilityUpload } from "./CapabilityUpload";
import { EvidenceLibrary } from "./EvidenceLibrary";
import { GapInterview } from "./GapInterview";
import { NoTenderLoaded } from "./NoTenderLoaded";

// The answers surface body. On the live product with no tender loaded it shows the
// onboarding empty state rather than the sample drafts + gap interview; otherwise
// it draws the draft action, capability upload, and the gap to-do list. The mock
// showcase build (no API) keeps its sample answers.
export function AnswersBody() {
  const { tenderId } = useRequirements();

  if (isApiEnabled() && !tenderId) {
    return (
      <NoTenderLoaded
        heading="No answers to draft yet"
        body="Upload a tender first. Bidframe drafts each answer from your own documents and lists the gaps it needs you to fill."
      />
    );
  }

  return (
    <>
      <p className="max-w-[64ch] text-sm text-ink-muted">
        Draft answers built from your own documents, plus the gaps we need you to
        fill.
      </p>

      {/* The draft action is the single primary action for this surface.
          Capability upload sits underneath it as a quiet secondary panel. */}
      <div className="mt-6 flex flex-col gap-4">
        <AutofillButton />
        <CapabilityUpload />
        <EvidenceLibrary />
      </div>

      <div className="mt-8">
        <GapInterview />
      </div>
    </>
  );
}
