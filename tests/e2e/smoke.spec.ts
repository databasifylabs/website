import { expect, test } from "@playwright/test";

test("home renders in both themes without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    await expect(page).toHaveTitle(/Databasify/);
    await expect(page.locator("html")).toHaveClass(new RegExp(scheme));
  }
  expect(errors).toEqual([]);
});
