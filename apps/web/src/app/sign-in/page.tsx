import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { enabledProviders } from "@/lib/providers";
import { getSession } from "@/lib/session";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

/** Only allow same-site relative paths as the post-sign-in destination. */
function safeNext(value: string | string[] | undefined) {
  const next = Array.isArray(value) ? value[0] : value;
  return next?.startsWith("/") && !next.startsWith("//") ? next : "/app";
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const next = safeNext((await searchParams).next);
  if (await getSession()) redirect(next);

  return (
    <main className="flex min-h-dvh items-center justify-center px-[max(16px,env(safe-area-inset-left))] py-12">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <Link href="/" className="self-start">
          <Logo />
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-semibold leading-[38px] tracking-[-0.01em]">Sign in</h1>
          <p className="text-ink-muted">New to Yieldr? Signing in creates your account.</p>
        </div>
        <SignInForm providers={enabledProviders()} next={next} />
      </div>
    </main>
  );
}
