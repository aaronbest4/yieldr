import { getDb, schema } from "@yieldr/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, magicLink, organization } from "better-auth/plugins";
import { magicLinkEmail, sendEmail } from "./email";
import { enabledProviders } from "./providers";

const adminEmails = new Set(
  (process.env.YIELDR_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

const providers = enabledProviders();

export const auth = betterAuth({
  appName: "Yieldr",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(getDb(), { provider: "pg", schema }),
  socialProviders: {
    ...(providers.google
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            prompt: "select_account" as const,
          },
        }
      : {}),
    ...(providers.microsoft
      ? {
          microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID as string,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
            // "common" accepts work, school and personal Microsoft accounts.
            tenantId: process.env.MICROSOFT_TENANT_ID || "common",
          },
        }
      : {}),
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "microsoft"],
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            role: adminEmails.has(user.email.toLowerCase()) ? "admin" : "user",
          },
        }),
      },
    },
  },
  plugins: [
    magicLink({
      expiresIn: 60 * 15,
      sendMagicLink: async ({ email, url }) => {
        await sendEmail(magicLinkEmail(email, url));
      },
    }),
    organization(),
    admin(),
    // Must be last: lets server actions set auth cookies.
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
