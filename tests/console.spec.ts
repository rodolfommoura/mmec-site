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
  await serveWithSiteHeaders(page, baseURL ?? "");
  await page.goto("/");
  // Lets every routed file finish, so no route handler is still answering when the page closes.
  await page.waitForLoadState("networkidle");
  // An inline script that no hash allows must be refused. The violation event is standard; the
  // console wording differs between engines.
  const violatedDirective = await page.evaluate(
    () =>
      new Promise<string>((resolve) => {
        document.addEventListener("securitypolicyviolation", (event) =>
          resolve(event.effectiveDirective),
        );
        const script = document.createElement("script");
        script.textContent = "window.__cspProbe = true;";
        document.head.append(script);
      }),
  );
  expect(violatedDirective).toMatch(/^script-src/);
  expect(await page.evaluate(() => "__cspProbe" in window)).toBe(false);
});
