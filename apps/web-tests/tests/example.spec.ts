import { test, expect } from "@playwright/test";
import { t, initI18n } from "@shared/i18n";
import { log } from "@shared/logger";
import AxeBuilder from "@axe-core/playwright";
import { createHtmlReport } from "axe-html-reporter";

test("homepage should load and show correct title text", async ({ page }) => {
  initI18n("fr");
  log("Running Playwright test…");

  await page.goto("https://example.com");
  
  // on wcag standard 2.2 aa
  // const accessibilityScanResults = await new AxeBuilder({ page }).withTags("wcag2aa").analyze();
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  // using shared i18n lib
  console.log("Translated title =", t("login.title"));

  const title = await page.title();
  expect(title).toContain("Example");
  log(`scan result: ${JSON.stringify(accessibilityScanResults)}`);
  createHtmlReport({
    results: accessibilityScanResults,
  });
  expect(accessibilityScanResults.violations).toEqual([]);
});
