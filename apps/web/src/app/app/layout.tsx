import { AppHeader } from "@/components/app-header";
import { requireSession } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession("/app");
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader email={session.user.email} isAdmin={session.user.role === "admin"} />
      <main className="flex-1 px-[max(16px,env(safe-area-inset-left))] py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
