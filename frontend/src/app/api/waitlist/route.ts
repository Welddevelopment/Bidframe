import { NextResponse } from "next/server";

// The waitlist endpoint. Same-origin (no CORS, the destination is never exposed
// in client code), with the spam defence and storage on the server:
//   - Honeypot: real users never fill the hidden "website" field; bots fill every
//     field. If it comes back with anything, we accept the request (so the bot
//     moves on) but store nothing.
//   - Validation: a basic email shape check, server-side.
//   - Storage: if WAITLIST_WEBHOOK is set (a Formspree / Google-Apps-Script /
//     Slack-style URL), the email is forwarded there so it lands in a clean list.
//     Otherwise it is logged, so a signup is still captured (visible in the host's
//     function logs) until a webhook is wired. Set WAITLIST_WEBHOOK to upgrade —
//     no code change needed.
// A real rate limit needs a shared store (KV/Redis); the honeypot covers the bulk
// of bot traffic for now. Add one before any serious volume.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const WEBHOOK = process.env.WAITLIST_WEBHOOK;

export async function POST(request: Request): Promise<NextResponse> {
  let body: { email?: unknown; website?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const honeypot = typeof body.website === "string" ? body.website.trim() : "";

  // Honeypot tripped: silently accept, store nothing.
  if (honeypot) return NextResponse.json({ ok: true });

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
  }

  if (WEBHOOK) {
    try {
      await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, source: "bidframe-waitlist" }),
      });
    } catch {
      // Never fail the visitor on a forwarding hiccup; capture it in the log.
      console.error("[waitlist] forward failed:", email);
    }
  } else {
    console.log("[waitlist] signup:", email);
  }

  return NextResponse.json({ ok: true });
}
