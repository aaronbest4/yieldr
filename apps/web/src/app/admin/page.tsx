import { getDb, schema, sql } from "@yieldr/db";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminHome() {
  await requireAdmin();
  const db = getDb();
  const [users] = await db.select({ count: sql<number>`count(*)::int` }).from(schema.user);
  const [organisations] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.organization);

  const tiles = [
    { label: "Users", value: users?.count ?? 0 },
    { label: "Organisations", value: organisations?.count ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-[32px] font-semibold leading-[38px] tracking-[-0.01em]">Admin</h1>
      <dl className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-lg border border-line bg-raised p-6">
            <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">
              {tile.label}
            </dt>
            <dd className="figure mt-2 font-display text-[40px] font-bold leading-[44px]">
              {tile.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-ink-muted">
        User management, subscriptions, tax schedules and the audit log are built in Phase 5.
      </p>
    </div>
  );
}
