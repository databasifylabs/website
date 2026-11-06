import { expect, test } from "@playwright/test";
import { COMPARISON, FEATURES, SECTIONS, STEPS } from "../../lib/site";

test("section headings come from the site copy", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#features h2")).toHaveText(SECTIONS.features.heading);
  await expect(page.locator("#how-it-works h2")).toHaveText(SECTIONS.howItWorks.heading);
  await expect(page.locator("#comparison h2")).toHaveText(SECTIONS.comparison.heading);
  await expect(page.locator("#works-with")).toHaveCount(0);
});

test("cards in a row have equal heights", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const heights = await page.locator("#features article").evaluateAll((cards) => cards.map((card) => Math.round(card.getBoundingClientRect().height)));
  expect(new Set(heights.slice(0, 3)).size).toBe(1);
});

test("features lists a card per feature", async ({ page }) => {
  await page.goto("/");
  const headings = page.locator("#features h3");
  await expect(headings).toHaveCount(FEATURES.length);
  for (const [index, feature] of FEATURES.entries()) {
    await expect(headings.nth(index)).toHaveText(feature.title);
  }
});

test("how it works shows three numbered steps", async ({ page }) => {
  await page.goto("/");
  const steps = page.locator("#how-it-works li");
  await expect(steps).toHaveCount(STEPS.length);
  for (const [index, step] of STEPS.entries()) {
    await expect(steps.nth(index)).toContainText(String(index + 1));
    await expect(steps.nth(index)).toContainText(step.title);
    await expect(steps.nth(index)).toContainText(step.body);
  }
});

test("comparison is a table with a row per topic", async ({ page }) => {
  await page.goto("/");
  const table = page.locator("#comparison table");
  await expect(table.getByRole("columnheader", { name: "Managed database service" })).toBeVisible();
  await expect(table.getByRole("columnheader", { name: "Databasify" })).toBeVisible();
  await expect(page.locator("#comparison").getByRole("region", { name: SECTIONS.comparison.scrollLabel })).toHaveAttribute("tabindex", "0");
  await expect(table.locator("tbody tr")).toHaveCount(COMPARISON.length);
  for (const { row, managed, databasify } of COMPARISON) {
    const tableRow = table.locator("tbody tr").filter({ has: page.getByRole("rowheader", { name: row }) });
    await expect(tableRow).toContainText(managed);
    await expect(tableRow).toContainText(databasify);
  }
});

test("page text has no prices", async ({ page }) => {
  await page.goto("/");
  expect(await page.locator("body").innerText()).not.toContain("$");
});
