import { expect, test } from "@playwright/test";
import { listPagePaths } from "../scripts/pages.mjs";
import { serveWithSiteHeaders } from "./support/site-headers";

// Served with the production Content-Security-Policy: a violation is a console error.
for (const path of [...listPagePaths(), "/404"]) {
  test(`no console errors or CSP violations on ${path}`, async ({ page, baseURL }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await serveWithSiteHeaders(page, baseURL ?? "");
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}

test("the policy is enforced in the browser", async ({ page, baseURL }) => {
  const violations: string[] = [];
  page.on("console", (message) => {
    if (message.text().includes("Content Security Policy")) violations.push(message.text());
  });
  await serveWithSiteHeaders(page, baseURL ?? "");
  await page.goto("/");
  // An inline script that no hash allows must be refused.
  await page.evaluate(() => {
    const script = document.createElement("script");
    script.textContent = "window.__cspProbe = true;";
    document.head.append(script);
  });
  expect(await page.evaluate(() => "__cspProbe" in window)).toBe(false);
  expect(violations.length).toBeGreaterThan(0);
});
