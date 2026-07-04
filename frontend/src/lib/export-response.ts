import type { CapabilityDoc, Requirement } from "@/types/requirement";
import { sourceRefLabel } from "@/lib/source-doc";

// Builders for the "Export response pack" menu. Content = the drafted answers
// grouped by requirement, each with its evidence citations and any gap Q/A, in
// the order the workspace is showing them. All builders are pure (reqs + docs +
// title in, string/Blob out). The DOCX path dynamically imports the `docx`
// package so it is code-split out of the main /answers chunk and only pulled
// when a user actually picks DOCX. PDF is not here — it's the browser's own
// Save-as-PDF over the print stylesheet (see globals.css @media print).

export interface ExportInput {
  title: string;
  requirements: Requirement[];
  capabilityDocs: CapabilityDoc[];
}

function docNameLookup(docs: CapabilityDoc[]): (docId: string) => string {
  const byId = new Map(docs.map((d) => [d.doc_id, d.filename]));
  return (docId) => byId.get(docId) ?? docId;
}

// A neutral, structured view of one requirement's response, shared by every
// text-based builder so MD / TXT / DOCX stay in lockstep.
interface Block {
  requirement: string;
  source: string;
  answer: string | null; // null => no draft yet
  evidence: string[]; // "Backed by {filename}, p.{page}: “excerpt”"
  answered: { question: string; answer: string }[];
  outstanding: string[];
}

function toBlocks(input: ExportInput): Block[] {
  const docName = docNameLookup(input.capabilityDocs);
  return input.requirements.map((req) => {
    const answerText = (req.answer?.text ?? req.draft_answer ?? "").trim();

    const answered: { question: string; answer: string }[] = [];
    const outstanding: string[] = [];
    for (const q of req.open_questions ?? []) {
      if (q.answer) answered.push({ question: q.question, answer: q.answer });
      else outstanding.push(q.question);
    }

    return {
      requirement: req.text,
      source: sourceRefLabel(req),
      answer: answerText.length > 0 ? answerText : null,
      evidence: (req.answer?.evidence_refs ?? []).map(
        (ref) => `Backed by ${docName(ref.doc_id)}, p.${ref.page}: “${ref.excerpt}”`
      ),
      answered,
      outstanding,
    };
  });
}

export function buildMarkdown(input: ExportInput): string {
  const blocks = toBlocks(input);
  const out: string[] = [`# ${input.title}`, "", "Response pack — drafted answers with evidence.", ""];
  blocks.forEach((b, i) => {
    out.push(`## ${i + 1}. ${b.requirement}`);
    out.push(`*Source: ${b.source}*`, "");
    out.push("**Answer**", "");
    out.push(b.answer ?? "_No draft yet._", "");
    if (b.evidence.length > 0) {
      for (const e of b.evidence) out.push(`> ${e}`);
      out.push("");
    }
    for (const qa of b.answered) {
      out.push(`- **Q:** ${qa.question}`, `  **A:** ${qa.answer}`);
    }
    for (const q of b.outstanding) out.push(`- **Outstanding:** ${q}`);
    out.push("");
  });
  return out.join("\n");
}

export function buildText(input: ExportInput): string {
  const blocks = toBlocks(input);
  const out: string[] = [input.title, "=".repeat(input.title.length), "", "Response pack — drafted answers with evidence.", ""];
  blocks.forEach((b, i) => {
    out.push(`${i + 1}. ${b.requirement}`);
    out.push(`   Source: ${b.source}`, "");
    out.push("   Answer:");
    out.push(`   ${b.answer ?? "No draft yet."}`, "");
    for (const e of b.evidence) out.push(`   - ${e}`);
    if (b.evidence.length > 0) out.push("");
    for (const qa of b.answered) {
      out.push(`   Q: ${qa.question}`, `   A: ${qa.answer}`);
    }
    for (const q of b.outstanding) out.push(`   Outstanding: ${q}`);
    out.push("");
  });
  return out.join("\n");
}

export async function buildDocx(input: ExportInput): Promise<Blob> {
  // Dynamic import keeps the ~hundreds-of-KB docx lib out of the initial bundle.
  const { Document, Packer, Paragraph, HeadingLevel, TextRun } = await import("docx");
  const blocks = toBlocks(input);

  const children: InstanceType<typeof Paragraph>[] = [
    new Paragraph({ text: input.title, heading: HeadingLevel.TITLE }),
    new Paragraph({ text: "Response pack — drafted answers with evidence." }),
  ];

  blocks.forEach((b, i) => {
    children.push(
      new Paragraph({ text: `${i + 1}. ${b.requirement}`, heading: HeadingLevel.HEADING_2 })
    );
    children.push(
      new Paragraph({ children: [new TextRun({ text: `Source: ${b.source}`, italics: true })] })
    );
    children.push(
      new Paragraph({ children: [new TextRun({ text: "Answer", bold: true })] })
    );
    children.push(new Paragraph({ text: b.answer ?? "No draft yet." }));
    for (const e of b.evidence) {
      children.push(
        new Paragraph({ children: [new TextRun({ text: e, italics: true })] })
      );
    }
    for (const qa of b.answered) {
      children.push(
        new Paragraph({ children: [new TextRun({ text: `Q: ${qa.question}`, bold: true })] })
      );
      children.push(new Paragraph({ text: `A: ${qa.answer}` }));
    }
    for (const q of b.outstanding) {
      children.push(
        new Paragraph({ children: [new TextRun({ text: `Outstanding: ${q}`, bold: true })] })
      );
    }
    children.push(new Paragraph({ text: "" }));
  });

  const doc = new Document({ sections: [{ children }] });
  return Packer.toBlob(doc);
}

export function slugifyTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug.length > 0 ? slug : "response-pack";
}

// Trigger a client-side download for a built Blob (mirrors the CSV export in
// MatrixView). No-op on the server.
export function triggerDownload(blob: Blob, filename: string): void {
  if (typeof window === "undefined") return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
