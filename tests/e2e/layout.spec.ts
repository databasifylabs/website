import { expect, test } from "@playwright/test";
import { CTA_LABELS, LINKS } from "../../lib/site";

test("header links", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  const expected = [
    ["Features", "#features"],
    ["FAQ", "#faq"],
    ["Docs", LINKS.docs],
    ["GitHub", LINKS.github],
  ];
  for (const [name, href] of expected) {
    await expect(header.getByRole("link", { name }).first()).toHaveAttribute("href", href);
  }
  await expect(header.getByRole("link", { name: CTA_LABELS.getStarted, exact: true }).first()).toHaveAttribute("href", LINKS.getStarted);
});

test("footer links", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  const expected = [
    ["Docs", LINKS.docs],
    ["GitHub", LINKS.github],
    ["Security", LINKS.security],
    ["Contributing", LINKS.contributing],
    ["License", LINKS.license],
  ];
  for (const [name, href] of expected) {
    await expect(footer.getByRole("link", { name })).toHaveAttribute("href", href);
  }
  await expect(footer).toContainText(`© Databasify Labs ${new Date().getFullYear()}`);
});

test("header shows no star count without stars", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("banner").locator("svg.lucide-star")).toHaveCount(0);
});

test("header border appears on scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 400 });
  await page.goto("/");
  await page.evaluate(() => {
    document.body.style.minHeight = "3000px";
  });
  const header = page.getByRole("banner");
  await expect(header).toHaveClass(/border-transparent/);
  await page.evaluate(() => window.scrollTo(0, 500));
  await expect(header).toHaveClass(/border-border/);
});

test("375px: no horizontal scroll and menu opens", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("link", { name: "Docs" }).last()).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Docs" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: CTA_LABELS.getStarted, exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
});
