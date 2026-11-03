import type { Metadata } from "next";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Portfolio" };

export default async function AppHome() {
  const { user } = await requireSession("/app");
  const firstName = user.name?.split(" ")[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-[32px] font-semibold leading-[38px] tracking-[-0.01em]">
          {firstName ? `Welcome, ${firstName}` : "Welcome to Yieldr"}
        </h1>
        <p className="text-ink-muted">Your portfolio will appear here.</p>
      </div>

      <section className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line-strong bg-raised p-8">
        <h2 className="text-[22px] font-semibold leading-7">No properties yet</h2>
        <p className="max-w-[60ch] text-ink-muted">
          Adding investors and properties arrives in the next phase. You'll enter each property
          once and see its projection on its own and within your whole portfolio.
        </p>
      </section>
    </div>
  );
}
