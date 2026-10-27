import { expect, test } from "@playwright/test";
import { listPagePaths } from "../scripts/pages.mjs";

// A lazy image without reserved space shifts the layout when it loads (CLS).
for (const path of [...listPagePaths(), "/404"]) {
  test(`lazy images on ${path} have explicit dimensions`, async ({ page }) => {
    await page.goto(path);
    const unsized = await page
      .locator('img[loading="lazy"]')
      .evaluateAll((images) =>
        images
          .filter((image) =>
            ["width", "height"].some((name) => !/^[1-9]\d*$/.test(image.getAttribute(name) ?? "")),
          )
          .map((image) => image.getAttribute("src")),
      );
    expect(unsized).toEqual([]);
  });

  // DevTools Issues through the Chrome DevTools Protocol: Chromium projects only.
  test(`Chromium reports no lazy image issue on ${path}`, async ({ page }) => {
    const cdp = await page.context().newCDPSession(page);
    const issues: string[] = [];
    cdp.on("Audits.issueAdded", ({ issue }) => {
      if (issue.code === "LazyLoadImageIssue") {
        issues.push(issue.details.lazyLoadImageIssueDetails?.url ?? "");
      }
    });
    await cdp.send("Audits.enable");
    await page.goto(path);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForLoadState("networkidle");
    expect(issues).toEqual([]);
  });

  test(`lazy images on ${path} keep the ratio of their attributes`, async ({ page }) => {
    await page.goto(path);
    const distorted = await page.locator('img[loading="lazy"]').evaluateAll((images) =>
      images
        .filter((image) => image.getBoundingClientRect().width > 0)
        .filter((image) => {
          const { width, height } = image.getBoundingClientRect();
          const ratio = Number(image.getAttribute("width")) / Number(image.getAttribute("height"));
          return Math.abs(width / height / ratio - 1) > 0.01;
        })
        .map((image) => image.getAttribute("src")),
    );
    expect(distorted).toEqual([]);
  });
}
