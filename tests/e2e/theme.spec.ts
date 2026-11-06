import { expect, test } from "@playwright/test";

test("toggle switches theme and persists across reload", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("reduced motion leaves content visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const revealed = page.locator("[data-reveal]");
  await expect(revealed.first()).toBeVisible();
  for (const el of await revealed.all()) {
    await expect(el).toHaveCSS("opacity", "1");
  }
});

test("above-the-fold reveal never flickers", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    const samples: number[] = [];
    Object.assign(window, { revealOpacities: samples });
    const sample = () => {
      const el = document.querySelector("[data-reveal]");
      if (el) samples.push(Number(getComputedStyle(el).opacity));
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await page.goto("/");
  await page.waitForTimeout(800);
  const samples = await page.evaluate(() => (window as unknown as { revealOpacities: number[] }).revealOpacities);
  expect(samples.length).toBeGreaterThan(0);
  expect(Math.min(...samples)).toBe(1);
});
