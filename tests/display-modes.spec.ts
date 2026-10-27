import { expect, test, type Page } from "@playwright/test";
import { listPagePaths } from "../scripts/pages.mjs";
import { contact } from "../src/config/site";

const paths = [...listPagePaths(), "/404"];

// WCAG 1.4.12 Text Spacing: the minimum values a user style sheet may apply.
const textSpacing = `
  * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
  p { margin-bottom: 2em !important; }
`;

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

/** Visible logo images, with the file they show and whether it loaded. */
async function visibleLogos(page: Page) {
  return page.locator("img.logo").evaluateAll((images) =>
    (images as HTMLImageElement[])
      .filter((image) => image.getClientRects().length > 0)
      .map((image) => ({
        src: image.getAttribute("src") ?? "",
        frameBackground: getComputedStyle(image.parentElement as Element).backgroundColor,
      })),
  );
}

// 1280 px at 400 % and at 200 % zoom.
for (const width of [320, 640]) {
  for (const path of paths) {
    test(`${path} reflows without horizontal scrolling at ${width} px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 256 });
      await page.goto(path);
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
    });
  }
}

for (const path of paths) {
  test(`${path} keeps its layout with WCAG text spacing at 320 px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(path);
    await page.addStyleTag({ content: textSpacing });
    expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
  });
}

test("reduced motion turns off transitions and smooth scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const motion = await page.evaluate(() => ({
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    moving: [...document.querySelectorAll("*")].filter((element) => {
      const style = getComputedStyle(element);
      const durations = `${style.transitionDuration},${style.animationDuration}`.split(",");
      return durations.some((duration) => parseFloat(duration) > 0);
    }).length,
  }));
  expect(motion).toEqual({ scrollBehavior: "auto", moving: 0 });
});

test.describe("forced colours", () => {
  test("show only the ink logo files, which stay visible on the system background", async ({
    page,
  }) => {
    await page.emulateMedia({ forcedColors: "active", colorScheme: "light" });
    await page.goto("/");
    const logos = await visibleLogos(page);
    // Header and footer.
    expect(logos).toHaveLength(2);
    for (const logo of logos) expect(logo.src).toMatch(/-ink\.svg$/);
  });

  test("keep the cream behind the ink logos under a dark theme", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active", colorScheme: "dark" });
    await page.goto("/");
    const logos = await visibleLogos(page);
    expect(logos).toHaveLength(2);
    for (const logo of logos) {
      expect(logo.src).toMatch(/-ink\.svg$/);
      expect(logo.frameBackground).toBe("rgb(245, 242, 234)");
    }
  });
});

test.describe("print", () => {
  for (const path of paths) {
    test(`${path} prints no button and no e-mail address twice`, async ({ page }) => {
      await page.goto(path);
      await page.emulateMedia({ media: "print" });
      await expect(page.locator(".button:visible")).toHaveCount(0);
      // Print adds no address after e-mail links because their text is the address.
      for (const link of await page.locator('a[href^="mailto:"]:visible').all()) {
        await expect(link).toHaveText(contact.email);
        const after = await link.evaluate(
          (element) => getComputedStyle(element, "::after").content,
        );
        expect(after).toBe("none");
      }
    });
  }
});
