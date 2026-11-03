import Link from "next/link";
import { Logo } from "@/components/logo";

const plans = [
  {
    name: "Individual",
    monthly: 8,
    annual: 80,
    detail: "You, or you and your partner. Up to 4 properties.",
  },
  {
    name: "Individual Large",
    monthly: 14,
    annual: 140,
    detail: "You, or you and your partner. 5 or more properties.",
  },
  {
    name: "Adviser",
    monthly: 22,
    annual: 220,
    detail: "Per adviser. Unlimited clients and properties, with your branding on reports.",
    perUser: true,
  },
];

const features = [
  {
    title: "Your whole portfolio, taxed once",
    body: "Yieldr works out each owner's tax across every property they hold, so negative gearing is never counted twice.",
  },
  {
    title: "Current tax and duty, every year",
    body: "Income tax, Medicare, stamp duty and land tax tables are kept up to date for every state, including changes already legislated.",
  },
  {
    title: "Reports you can hand over",
    body: "Summary, detailed and portfolio reports that explain every figure in plain English.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-line px-[max(16px,env(safe-area-inset-left))]">
        <div className="mx-auto flex max-w-6xl items-center justify-between py-4">
          <Logo />
          <nav className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="rounded-md px-3 py-2 font-medium text-ink hover:bg-brand-tint"
            >
              Sign in
            </Link>
            <Link
              href="/sign-in"
              className="rounded-md bg-brand px-4 py-2 font-semibold text-on-brand hover:bg-brand-strong"
            >
              Start free trial
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-[max(16px,env(safe-area-inset-left))]">
        <section className="mx-auto grid max-w-6xl gap-12 py-16 md:grid-cols-[1.2fr_1fr] md:items-center md:py-24">
          <div className="flex flex-col gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">
              Property investment projections for Australia
            </p>
            <h1 className="text-[40px] font-bold leading-[44px] tracking-[-0.02em] md:text-[56px] md:leading-[60px]">
              Know what a property really costs you, before you buy.
            </h1>
            <p className="max-w-[60ch] text-ink-muted">
              Yieldr projects rent, loan costs, depreciation and tax for every financial year, then
              shows the after-tax cost per week and what you could be left with if you sell.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/sign-in"
                className="rounded-md bg-brand px-5 py-3 font-semibold text-on-brand hover:bg-brand-strong"
              >
                Start a 3-day free trial
              </Link>
              <a
                href="#pricing"
                className="rounded-md border border-line-strong px-5 py-3 font-medium"
              >
                See pricing
              </a>
            </div>
          </div>

          <figure
            aria-label="Example projection"
            className="rounded-lg border border-line bg-raised p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-muted">
              Example · 2026–27
            </p>
            <p className="figure mt-2 font-display text-[40px] font-bold leading-[44px]">
              <span className="border-b-4 border-wattle text-gain">+$202</span>
              <span className="text-[22px] font-semibold text-ink-muted"> a week</span>
            </p>
            <p className="mt-1 text-ink-muted">
              in your pocket after tax, for a $321,456 property at 6.5% interest only.
            </p>
            <dl className="figure mt-6 grid grid-cols-2 gap-x-6 gap-y-2">
              <dt className="text-ink-muted">Rent</dt>
              <dd className="text-right">$35,672</dd>
              <dt className="text-ink-muted">Interest</dt>
              <dd className="text-right text-cost">($17,372)</dd>
              <dt className="text-ink-muted">Expenses</dt>
              <dd className="text-right text-cost">($6,697)</dd>
              <dt className="text-ink-muted">Equity in 10 years</dt>
              <dd className="text-right text-gain">$256,364</dd>
            </dl>
            <figcaption className="mt-4 text-xs text-ink-muted">
              Illustrative figures. Projections are estimates, not guarantees.
            </figcaption>
          </figure>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 pb-16 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex flex-col gap-2 border-t border-line pt-6">
              <h2 className="text-[22px] font-semibold leading-7">{f.title}</h2>
              <p className="text-ink-muted">{f.body}</p>
            </div>
          ))}
        </section>

        <section id="pricing" className="mx-auto max-w-6xl pb-24">
          <h2 className="text-[32px] font-semibold leading-[38px] tracking-[-0.01em]">Pricing</h2>
          <p className="mt-2 text-ink-muted">
            Prices include GST. Every plan starts with a 3-day free trial.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col gap-3 rounded-lg border bg-raised p-6 ${
                  plan.perUser ? "border-2 border-wattle" : "border-line"
                }`}
              >
                <h3 className="text-[22px] font-semibold leading-7">{plan.name}</h3>
                <p className="figure">
                  <span className="font-display text-[40px] font-bold leading-[44px]">
                    ${plan.monthly}
                  </span>
                  <span className="text-ink-muted">
                    {" "}
                    /month{plan.perUser ? " per adviser" : ""}
                  </span>
                </p>
                <p className="figure text-ink-muted">or ${plan.annual} a year</p>
                <p>{plan.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-[max(16px,env(safe-area-inset-left))]">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 py-8 text-sm text-ink-muted">
          <span>© {new Date().getFullYear()} Yieldr</span>
          <span>General information only. Not financial or tax advice.</span>
        </div>
      </footer>
    </div>
  );
}
