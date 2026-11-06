import { expect, test } from "@playwright/test";
import { CTA_LABELS, FAQ, INSTALL_COMMAND, LINKS, TOUR } from "../../lib/site";

test("tour tabs work by keyboard", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Clusters & failover" }).focus();
  await page.keyboard.press("ArrowRight");
  const backups = page.getByRole("tab", { name: "Backups & PITR" });
  await expect(backups).toHaveAttribute("aria-selected", "true");
  await expect(backups).toBeFocused();
  await expect(page.getByRole("tabpanel", { name: "Backups & PITR" })).toBeVisible();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "Domains & TLS" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(page.getByRole("tab", { name: "Clusters & failover" })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("tab", { name: "Domains & TLS" })).toHaveAttribute("aria-selected", "true");
});

test("clicking a tour tab shows only its panel", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("tab", { name: "Migrations" }).click();
  await expect(page.locator('#tour [role="tabpanel"]:visible')).toHaveCount(1);
  await expect(page.getByRole("tabpanel", { name: "Migrations" })).toBeVisible();
});

test("FAQ answers open and close", async ({ page }) => {
  await page.goto("/");
  const item = page.locator("#faq details").first();
  await item.locator("summary").click();
  await expect(item.getByText(FAQ[0].a)).toBeVisible();
  await item.locator("summary").click();
  await expect(item.getByText(FAQ[0].a)).toBeHidden();
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("all tab panels and FAQ answers are in the HTML", async ({ page }) => {
    await page.goto("/");
    const html = await page.content();
    for (const tab of TOUR) {
      expect(html).toContain(tab.body);
    }
    for (const item of FAQ) {
      expect(html).toContain(item.a);
    }
  });
});

test("final CTA has the install command and both buttons", async ({ page }) => {
  await page.goto("/");
  const cta = page.locator("#get-started");
  await expect(cta.locator("code")).toHaveText(INSTALL_COMMAND);
  await expect(cta.getByRole("link", { name: CTA_LABELS.getStarted, exact: true })).toHaveAttribute("href", LINKS.getStarted);
  await expect(cta.getByRole("link", { name: CTA_LABELS.starOnGitHub, exact: true })).toHaveAttribute("href", LINKS.github);
});
