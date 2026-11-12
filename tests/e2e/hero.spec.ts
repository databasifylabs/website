import { expect, test } from "@playwright/test";
import { CTA_LABELS, HEADLINE_LINES, HERO_PILL, INSTALL_COMMAND, LINKS, TAGLINE } from "../../lib/site";

test("hero shows the headline, calls to action and install command", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("#hero");
  const headline = hero.getByRole("heading", { level: 1, name: HEADLINE_LINES.join(" "), exact: true });
  await expect(headline).toBeVisible();
  await expect(headline.locator(":scope > span")).toHaveText([...HEADLINE_LINES]);
  await expect(hero.getByText(TAGLINE)).toBeVisible();
  await expect(hero.getByRole("link", { name: HERO_PILL })).toHaveAttribute("href", LINKS.github);
  await expect(hero.getByText(HERO_PILL)).toBeVisible();
  await expect(hero.getByRole("link", { name: CTA_LABELS.getStarted, exact: true })).toHaveAttribute("href", LINKS.getStarted);
  await expect(hero.getByRole("link", { name: CTA_LABELS.starOnGitHub, exact: true })).toHaveAttribute("href", LINKS.github);
  await expect(hero.locator("code")).toHaveText(INSTALL_COMMAND);
});

for (const scheme of ["light", "dark"] as const) {
  test(`hero screenshot follows the ${scheme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/");
    const screenshot = page.locator('#hero img[alt="The Databasify dashboard"]:visible');
    await expect(screenshot).toHaveCount(1);
    await expect.poll(() => screenshot.evaluate((img: HTMLImageElement) => img.currentSrc)).toContain(`dashboard-${scheme}`);
  });
}

test("hero background stays still under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const animations = await page.locator("#hero").evaluate((hero) => hero.getAnimations({ subtree: true }).length);
  expect(animations).toBe(0);
  await expect(page.locator("#hero h1 svg path").first()).toHaveCSS("stroke-dashoffset", "0px");
});

test("headline underline is decorative and draws in once", async ({ page }) => {
  await page.goto("/");
  const underline = page.locator("#hero h1 svg");
  await expect(underline).toHaveAttribute("aria-hidden", "true");
  await expect(underline).toBeVisible();
  const animations = await underline.evaluate((svg) => svg.getAnimations({ subtree: true }).map((animation) => animation.effect?.getTiming().iterations));
  expect(animations.length).toBeGreaterThan(0);
  expect(animations.every((iterations) => iterations === 1)).toBe(true);
});

for (const width of [320, 375]) {
  test(`${width}px: the large hero fits without horizontal scroll`, async ({ page }) => {
    await page.setViewportSize({ width, height: 812 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const code = page.locator("#hero code");
    expect(await code.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  });
}
