import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { listPagePaths } from "../scripts/pages.mjs";

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const paths = [...listPagePaths(), "/404"];

for (const path of paths) {
  test(`no WCAG 2.2 AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("every page declares pt-BR and noindex", async ({ page }) => {
  for (const path of paths) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  }
});
