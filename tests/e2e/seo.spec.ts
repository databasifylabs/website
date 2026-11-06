import { expect, test } from "@playwright/test";
import { TAGLINE } from "../../lib/site";

test("page metadata points at databasify.io", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://databasify.io/");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", TAGLINE);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://databasify.io/og.png");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", "https://databasify.io/og.png");
});

for (const path of ["/sitemap.xml", "/robots.txt", "/og.png"]) {
  test(`${path} is served`, async ({ request }) => {
    expect((await request.get(path)).status()).toBe(200);
  });
}
