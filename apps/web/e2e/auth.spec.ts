import { expect, test } from "@playwright/test";
import { signInWithMagicLink, uniqueEmail } from "./helpers";

test("the homepage shows the product and pricing", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /really costs you/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pricing" })).toBeVisible();
  await expect(page.getByText("Prices include GST")).toBeVisible();
});

test("the app sends signed-out visitors to sign in", async ({ page }) => {
  await page.goto("/app");
  await expect(page).toHaveURL(/\/sign-in\?next=%2Fapp/);
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
});

test("a new user signs up with a magic link, then signs out", async ({ page }) => {
  const email = uniqueEmail("investor");
  await signInWithMagicLink(page, email);

  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByTestId("signed-in-as")).toHaveText(email);
  await expect(page.getByRole("link", { name: "Admin" })).toHaveCount(0);

  // Ordinary users are kept out of the admin area.
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/app$/);

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/app");
  await expect(page).toHaveURL(/\/sign-in/);
});

test("an email listed in YIELDR_ADMIN_EMAILS becomes a super-admin", async ({ page }) => {
  await signInWithMagicLink(page, "admin@yieldr.test", "/admin");
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Admin" })).toBeVisible();
  await expect(page.getByText("Users", { exact: true })).toBeVisible();
});

test("the health check reports the database is up", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({ ok: true, database: "up" });
});
