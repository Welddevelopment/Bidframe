import { redirect } from "next/navigation";

// The tenders list now lives on /upload (one page to add a tender and reopen
// one). Kept as a redirect so old links and bookmarks keep working.
export default function TendersPage() {
  redirect("/upload");
}
