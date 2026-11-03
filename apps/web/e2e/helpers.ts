import { readFile } from "node:fs/promises";
import path from "node:path";
import { expect, type Page } from "@playwright/test";

const OUTBOX = path.join(process.cwd(), ".data", "outbox.jsonl");

interface SentEmail {
  to: string;
  subject: string;
  text: string;
}

/** The newest magic link emailed to this address, read from the file transport's outbox. */
export async function latestMagicLink(email: string): Promise<string> {
  let link: string | undefined;
  await expect
    .poll(
      async () => {
        const raw = await readFile(OUTBOX, "utf8").catch(() => "");
        const messages = raw
          .split("\n")
          .filter(Boolean)
          .map((line) => JSON.parse(line) as SentEmail)
          .filter((m) => m.to === email);
        link = messages.at(-1)?.text.match(/https?:\/\/\S+/)?.[0];
        return link;
      },
      { timeout: 10_000 },
    )
    .toBeTruthy();
  return link as string;
}

export function uniqueEmail(prefix: string) {
  return `${prefix}+${Date.now()}${Math.floor(Math.random() * 1000)}@yieldr.test`;
}

export async function signInWithMagicLink(page: Page, email: string, next = "/app") {
  await page.goto(`/sign-in?next=${encodeURIComponent(next)}`);
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Email me a sign-in link" }).click();
  await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
  await page.goto(await latestMagicLink(email));
}
