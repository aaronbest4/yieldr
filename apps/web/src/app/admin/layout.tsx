import { AppHeader } from "@/components/app-header";
import { requireAdmin } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader email={session.user.email} isAdmin />
      <main className="flex-1 px-[max(16px,env(safe-area-inset-left))] py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
