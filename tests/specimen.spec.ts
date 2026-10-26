import { existsSync } from "node:fs";
import { expect, test } from "@playwright/test";

test.skip(!existsSync("dist/_design.html"), "design specimen not in this build");

test("every focusable element on the specimen is reachable by Tab with a visible focus ring", async ({
  page,
}) => {
  await page.goto("/_design");
  const focusableCount = await page
    .locator("a[href], button:not([disabled]), input:not([disabled]), textarea, select")
    .evaluateAll((elements) => elements.filter((element) => element.checkVisibility()).length);

  const visited = new Set<string>();
  for (let index = 0; index < focusableCount; index += 1) {
    await page.keyboard.press("Tab");
    const focus = await page.evaluate(() => {
      const element = document.activeElement as HTMLElement;
      const style = getComputedStyle(element);
      const path: string[] = [];
      for (let node: Element | null = element; node; node = node.parentElement) {
        path.unshift(`${node.tagName}:${[...(node.parentElement?.children ?? [])].indexOf(node)}`);
      }
      return { path: path.join("/"), outline: style.outlineStyle, width: style.outlineWidth };
    });
    expect(focus.outline, `focus ring on ${focus.path}`).not.toBe("none");
    expect(parseFloat(focus.width)).toBeGreaterThanOrEqual(2);
    visited.add(focus.path);
  }
  expect(visited.size).toBe(focusableCount);
});

test("the specimen is noindex", async ({ page }) => {
  await page.goto("/_design");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
