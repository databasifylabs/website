import path from "node:path";
import { chromium } from "@playwright/test";

const BASE_URL = process.env.CAPTURE_URL ?? "http://127.0.0.1:8123";
const EMAIL = process.env.DEMO_EMAIL ?? "demo@example.com";
const PASSWORD = process.env.DEMO_PASSWORD ?? "12345678";
const [outputArgument, ...onlyIds] = process.argv.slice(2);
const OUTPUT_DIR = path.resolve(outputArgument ?? path.join(import.meta.dirname, "../../assets/screens-src"));
const THEMES = ["light", "dark"];
const SCREENS = [
  { id: "clusters", database: "orders", tab: "overview" },
  { id: "backups", database: "orders", tab: "backups", ready: showRestoreMomentInUsFormat },
  { id: "migrations", database: "analytics", tab: "migrations" },
  { id: "monitoring", database: "orders", tab: "insights", ready: (page) => page.locator(".recharts-line-curve").first().waitFor() },
  { id: "domains", database: "orders", tab: "settings", ready: editDomainOf },
];

async function showRestoreMomentInUsFormat(page) {
  await page.locator("input[type=datetime-local]").evaluate((input) => {
    const moment = new Date(input.value).toLocaleString("en-US");
    input.type = "text";
    input.value = moment;
  });
}

async function editDomainOf(page) {
  await page.getByText("Domain", { exact: true }).evaluate((element) => element.scrollIntoView({ block: "start" }));
  await page.evaluate(() => window.scrollBy(0, -32));
  await page.getByRole("button", { name: "Change" }).click();
}

async function logIn(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill("input[name=email]", EMAIL);
  await page.fill("input[name=password]", PASSWORD);
  await Promise.all([page.waitForURL("**/dashboard"), page.click("button[type=submit]")]);
}

async function databaseUrlsOf(page) {
  await page.goto(`${BASE_URL}/databases`);
  await page.waitForLoadState("networkidle");
  const names = [...new Set(SCREENS.map((screen) => screen.database))];
  const entries = await Promise.all(
    names.map(async (name) => [name, await page.locator("a", { has: page.getByText(name, { exact: true }) }).first().getAttribute("href")]),
  );
  return Object.fromEntries(entries);
}

async function shoot(page, screen, url, theme) {
  await page.goto(`${new URL(url, BASE_URL)}?tab=${screen.tab}`);
  await page.waitForLoadState("networkidle");
  await screen.ready?.(page);
  await page.mouse.move(0, 899);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  const file = path.join(OUTPUT_DIR, `${screen.id}-${theme}.png`);
  await page.screenshot({ path: file });
  console.log(`wrote ${file}`);
}

async function shootTheme(browser, theme) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: theme, locale: "en-US", timezoneId: "UTC", ignoreHTTPSErrors: true });
  await context.addCookies([{ name: "appearance", value: theme, url: BASE_URL }]);
  await context.addInitScript((appearance) => localStorage.setItem("appearance", appearance), theme);
  const page = await context.newPage();
  page.on("console", (message) => message.type() === "error" && console.log(`console: ${message.text()}`));
  await logIn(page);
  const urls = await databaseUrlsOf(page);
  for (const screen of SCREENS.filter((entry) => onlyIds.length === 0 || onlyIds.includes(entry.id))) {
    await shoot(page, screen, urls[screen.database], theme);
  }
  await context.close();
}

const browser = await chromium.launch({ channel: "chrome", args: ["--ignore-certificate-errors", "--lang=en-US"] });
for (const theme of THEMES) {
  await shootTheme(browser, theme);
}
await browser.close();
