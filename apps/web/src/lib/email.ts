import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export interface Email {
  to: string;
  subject: string;
  text: string;
  html: string;
}

type Transport = "console" | "file" | "resend";

function transport(): Transport {
  const configured = process.env.EMAIL_TRANSPORT as Transport | undefined;
  if (configured) return configured;
  return process.env.RESEND_API_KEY ? "resend" : "console";
}

/** The file transport writes here; the end-to-end tests read magic links back from it. */
export const OUTBOX_PATH = path.join(process.cwd(), ".data", "outbox.jsonl");

export async function sendEmail(email: Email): Promise<void> {
  const mode = transport();

  if (mode === "console") {
    console.info(`[email] to=${email.to} subject="${email.subject}"\n${email.text}`);
    return;
  }

  if (mode === "file") {
    if (process.env.NODE_ENV === "production" && process.env.VERCEL) {
      throw new Error("EMAIL_TRANSPORT=file is for local development and tests only.");
    }
    await mkdir(path.dirname(OUTBOX_PATH), { recursive: true });
    await appendFile(OUTBOX_PATH, `${JSON.stringify({ ...email, sentAt: new Date().toISOString() })}\n`);
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "Yieldr <hello@mail.yieldr.property>",
      to: [email.to],
      subject: email.subject,
      text: email.text,
      html: email.html,
    }),
  });
  if (!response.ok) {
    throw new Error(`Resend rejected the email (${response.status}): ${await response.text()}`);
  }
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export function magicLinkEmail(to: string, url: string): Email {
  const safeUrl = escapeHtml(url);
  return {
    to,
    subject: "Your Yieldr sign-in link",
    text: `Sign in to Yieldr:\n\n${url}\n\nThis link expires in 15 minutes and can be used once. If you didn't ask for it, you can ignore this email.`,
    html: `<div style="font-family:Segoe UI,system-ui,sans-serif;color:#1f2e26;background:#f2f1ea;padding:32px">
  <div style="max-width:480px;margin:0 auto;background:#fbfaf6;border:1px solid #d6d3c6;border-radius:10px;padding:32px">
    <p style="font-size:20px;font-weight:700;color:#3a5a40;margin:0 0 24px">yieldr</p>
    <p style="font-size:15px;line-height:24px;margin:0 0 24px">Use this button to sign in. It expires in 15 minutes and works once.</p>
    <a href="${safeUrl}" style="display:inline-block;background:#3a5a40;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600">Sign in to Yieldr</a>
    <p style="font-size:13px;line-height:20px;color:#5b6658;margin:24px 0 0">If you didn't ask for this, you can ignore this email.</p>
  </div>
</div>`,
  };
}
