"use client";

import { useState } from "react";

// The waitlist capture (lower priority than Book a demo, per the build call): a
// single email field so interest has somewhere to land if outreach works. It
// POSTs to the same-origin /api/waitlist route, which holds the spam check and
// the storage (it forwards to WAITLIST_WEBHOOK if set, else logs). A hidden
// honeypot field below catches bots, and a one-line consent note sits under the
// input. No login: a waitlist is a zero-friction capture by design.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type State = "idle" | "loading" | "done";

// Record only that a signup happened, never the address: keep PII out of analytics.
function track(): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer?.push({ event: "waitlist_submit" });
}

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  // Honeypot: a hidden field real users never see. If it comes back filled, the
  // server treats the submission as a bot and drops it.
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("That email does not look right. Try again.");
      return;
    }
    setError(null);
    setState("loading");
    track();
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      if (!res.ok) throw new Error("bad status");
      setState("done");
    } catch {
      setState("idle");
      setError("Something went wrong. Try again, or book a demo instead.");
    }
  }

  if (state === "done") {
    return (
      <p className="mt-4 font-mono text-sm text-forest" role="status">
        You are on the list. We&rsquo;ll be in touch when a place opens.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4" noValidate>
      {/* Honeypot: hidden from people, irresistible to bots. It must stay empty;
          the server drops any submission that fills it. Off-screen, not in the
          tab order, and aria-hidden, so assistive tech ignores it too. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="waitlist-website">Leave this field empty</label>
        <input
          id="waitlist-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div className="mx-auto flex max-w-[24rem] flex-col gap-2 sm:flex-row">
        <label htmlFor="waitlist-email" className="sr-only">
          Your email
        </label>
        <input
          id="waitlist-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="you@company.co.uk"
          aria-invalid={error !== null}
          className="h-10 flex-1 rounded-md border border-hairline bg-paper px-3 text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper-raised"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="h-10 shrink-0 rounded-md border border-ink/25 px-4 text-sm font-medium text-ink transition-colors hover:bg-paper-recessed focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper-raised disabled:opacity-60"
        >
          {state === "loading" ? "Adding…" : "Join the waitlist"}
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-[24rem] text-xs text-ink-muted">
        We&rsquo;ll only use this to tell you when a place opens.
      </p>
      {error && (
        <p className="mt-2 text-sm text-signal-oxblood" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
