import { expect, test, type Page } from "@playwright/test";
import { listPagePaths } from "../scripts/pages.mjs";

// The design specimen has its own keyboard test (specimen.spec.ts), which covers its form fields.
const paths = [...listPagePaths().filter((path) => path !== "/_design"), "/404"];
const viewports = [
  { width: 1280, height: 800 },
  { width: 375, height: 740 },
];

interface FocusStop {
  name: string;
  outlineStyle: string;
  outlineWidth: number;
  width: number;
  height: number;
}

/** Tabs from the top of the page until focus leaves the document or comes back to the start. */
async function walkFocus(page: Page): Promise<FocusStop[]> {
  const stops: FocusStop[] = [];
  for (let i = 0; i < 100; i += 1) {
    await page.keyboard.press("Tab");
    const stop = await page.evaluate(() => {
      const element = document.activeElement;
      if (!(element instanceof HTMLElement) || element === document.body) return null;
      // Marks the element, so the walk ends when focus wraps round, even past twin links.
      if (element.dataset.focusWalk) return null;
      element.dataset.focusWalk = "seen";
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return {
        name: `${element.tagName} "${element.textContent?.trim()}" ${element.getAttribute("href") ?? ""}`,
        outlineStyle: style.outlineStyle,
        outlineWidth: parseFloat(style.outlineWidth),
        width: box.width,
        height: box.height,
      };
    });
    if (!stop) break;
    stops.push(stop);
  }
  return stops;
}

for (const viewport of viewports) {
  for (const path of paths) {
    test(`every focus stop on ${path} at ${viewport.width} px is visible with a focus ring`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(path);
      const stops = await walkFocus(page);
      const focusable = await page
        .locator("a[href], button")
        .evaluateAll(
          (elements) =>
            elements.filter((element) => element.checkVisibility({ visibilityProperty: true }))
              .length,
        );
      expect(stops.length).toBe(focusable);
      expect(stops[0].name).toContain("Ir para o conteúdo");
      for (const stop of stops) {
        expect.soft(stop.outlineStyle, stop.name).toBe("solid");
        expect.soft(stop.outlineWidth, stop.name).toBeGreaterThanOrEqual(2);
        expect.soft(stop.width * stop.height, stop.name).toBeGreaterThan(0);
      }
    });
  }
}

test("focus ring stays visible in forced colours", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/");
  for (const stop of await walkFocus(page)) {
    expect.soft(stop.outlineStyle, stop.name).toBe("solid");
  }
});
