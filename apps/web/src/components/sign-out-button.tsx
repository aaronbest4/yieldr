"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
      className="rounded-md border border-line-strong px-3 py-1.5 text-sm font-medium hover:bg-brand-tint"
    >
      Sign out
    </button>
  );
}
