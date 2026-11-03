import Link from "next/link";
import { Logo } from "./logo";
import { SignOutButton } from "./sign-out-button";

export function AppHeader({ email, isAdmin }: { email: string; isAdmin: boolean }) {
  return (
    <header className="border-b border-line bg-raised px-[max(16px,env(safe-area-inset-left))]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 py-3">
        <Link href="/app">
          <Logo />
        </Link>
        <nav className="flex items-center gap-4">
          {isAdmin && (
            <Link href="/admin" className="font-medium text-brand">
              Admin
            </Link>
          )}
          <span className="text-sm text-ink-muted" data-testid="signed-in-as">
            {email}
          </span>
          <SignOutButton />
        </nav>
      </div>
    </header>
  );
}
