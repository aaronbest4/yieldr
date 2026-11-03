# Yieldr

Property investment projections for Australian investors and their advisers, at [yieldr.property](https://yieldr.property).

## What's here

| Path | What |
| --- | --- |
| `apps/web` | Next.js app: the public site at `/`, sign-in at `/sign-in`, the app at `/app`, super-admin at `/admin` |
| `packages/engine` | The calculation engine: pure TypeScript, no framework or database code, fully unit tested |
| `packages/db` | Postgres schema (Drizzle ORM) and migrations |

Sign-in uses [Better Auth](https://www.better-auth.com) with Google, Microsoft and email magic links. Organisations, members and roles come from its organization plugin. Super-admin, banning and impersonation come from its admin plugin.

## Running it locally

You need Node 22+, pnpm 10 (`corepack enable`) and Docker.

```sh
pnpm install
docker compose up -d                      # Postgres 17 on localhost:5432
cp .env.example apps/web/.env.local       # then set BETTER_AUTH_SECRET (openssl rand -base64 32)
pnpm db:migrate
pnpm dev                                  # http://localhost:3000
```

Without Google or Microsoft keys, only the email option shows on the sign-in page. Without a Resend key, the magic link is printed in the terminal running `pnpm dev`. Add your email to `YIELDR_ADMIN_EMAILS` before you first sign in to become a super-admin.

## Commands

| Command | Does |
| --- | --- |
| `pnpm dev` | Runs the app with hot reload |
| `pnpm test` | Engine unit tests (Vitest) |
| `pnpm e2e` | End-to-end tests (Playwright) against a running Postgres |
| `pnpm lint` / `pnpm format` | Biome lint and format check / fix |
| `pnpm typecheck` | TypeScript across the workspace |
| `pnpm db:generate` | Creates a migration after a schema change. Commit the result. |
| `pnpm db:migrate` | Applies migrations to `DATABASE_URL` |

CI runs all of these on every pull request, including the sign-up, sign-in, sign-out and admin-access tests against a real Postgres.

## Conventions

- Money is calculated in dollars and rounded to cents at the edges. Taxable income ignores cents, as the ATO does.
- Years are Australian financial years (1 July to 30 June), named by the year they end in: FY2027 is 2026–27.
- Tax rates are data with effective dates (`packages/engine/src/tax/schedule.ts`, moving to the database in Phase 1). Never hardcode a rate in a calculation.
- Brand tokens in `apps/web/src/app/globals.css` mirror the Yieldr design system. Change them there first.

## Never commit secrets

This repository is public. Keys go in `apps/web/.env.local` (git-ignored) locally, and in Vercel's environment variables in production.
