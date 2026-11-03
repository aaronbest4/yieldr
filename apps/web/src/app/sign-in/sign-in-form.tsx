"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import type { EnabledProviders } from "@/lib/providers";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; email: string } | { kind: "error"; message: string };

export function SignInForm({ providers, next }: { providers: EnabledProviders; next: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function social(provider: "google" | "microsoft") {
    const { error } = await authClient.signIn.social({ provider, callbackURL: next });
    if (error) setStatus({ kind: "error", message: error.message ?? "Sign-in failed. Try again." });
  }

  async function sendLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ kind: "sending" });
    const { error } = await authClient.signIn.magicLink({ email, callbackURL: next });
    if (error) {
      setStatus({ kind: "error", message: error.message ?? "We couldn't send the link. Try again." });
    } else {
      setStatus({ kind: "sent", email });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="flex flex-col gap-2 rounded-lg border border-line bg-raised p-6">
        <h2 className="text-[22px] font-semibold leading-7">Check your email</h2>
        <p className="text-ink-muted">
          We sent a sign-in link to <strong className="text-ink">{status.email}</strong>. It expires in 15 minutes.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-2 self-start font-medium text-brand underline underline-offset-4"
        >
          Use a different email
        </button>
      </div>
    );
  }

  const hasSocial = providers.google || providers.microsoft;

  return (
    <div className="flex flex-col gap-6">
      {hasSocial && (
        <div className="flex flex-col gap-3">
          {providers.google && (
            <button
              type="button"
              onClick={() => social("google")}
              className="rounded-md border border-line-strong bg-raised px-4 py-3 font-medium hover:bg-brand-tint"
            >
              Continue with Google
            </button>
          )}
          {providers.microsoft && (
            <button
              type="button"
              onClick={() => social("microsoft")}
              className="rounded-md border border-line-strong bg-raised px-4 py-3 font-medium hover:bg-brand-tint"
            >
              Continue with Microsoft
            </button>
          )}
        </div>
      )}

      {hasSocial && (
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">
          <span className="h-px flex-1 bg-line" />
          or
          <span className="h-px flex-1 bg-line" />
        </div>
      )}

      <form onSubmit={sendLink} className="flex flex-col gap-3">
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-sm border border-line-strong bg-raised px-3 py-3"
        />
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="rounded-md bg-brand px-4 py-3 font-semibold text-on-brand hover:bg-brand-strong disabled:opacity-60"
        >
          {status.kind === "sending" ? "Sending…" : "Email me a sign-in link"}
        </button>
      </form>

      {status.kind === "error" && (
        <p role="alert" className="text-cost">
          {status.message}
        </p>
      )}
    </div>
  );
}
