import { test } from "@playwright/test";

test("screens", async ({ page }) => {
  for (const [name, url, w] of [["home", "/", 1280], ["home-m", "/", 390], ["signin", "/sign-in", 1280]] as const) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(url);
    await page.waitForTimeout(500);
    const buf = await page.screenshot({ fullPage: true, type: "jpeg", quality: 60 });
    console.log(`SHOT-${name}:${buf.toString("base64")}`);
  }
  await page.emulateMedia({ colorScheme: "dark" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  await page.waitForTimeout(500);
  console.log(`SHOT-home-dark:${(await page.screenshot({ type: "jpeg", quality: 60 })).toString("base64")}`);
});
