import { expect, test, type Page } from "@playwright/test";
import { webAnalytics } from "../src/config/analytics";
import { contentSecurityPolicy, serveWithSiteHeaders } from "./support/site-headers";

const cloudflareInsights = /^https:\/\/([a-z0-9-]+\.)*cloudflareinsights\.com\//;

/** Requests to Cloudflare Web Analytics, answered with stubs so no data leaves the test. */
async function stubAnalytics(page: Page): Promise<string[]> {
  const requests: string[] = [];
  await page.route(cloudflareInsights, (route) => {
    const url = route.request().url();
    requests.push(url);
    return url.startsWith(webAnalytics.scriptOrigin)
      ? route.fulfill({ contentType: "text/javascript", body: "" })
      : route.fulfill({ status: 204, body: "" });
  });
  return requests;
}

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test.skip(!webAnalytics.token, "No Web Analytics site token: the beacon is never rendered.");

// Lighthouse and the tests run on a local server, where Cloudflare's CORS policy rejects the
// beacon's report; the same build must stay silent there.
test("loads no beacon on a local server", async ({ page, baseURL }) => {
  const errors = collectConsoleErrors(page);
  const requests: string[] = [];
  page.on("request", (request) => {
    if (cloudflareInsights.test(request.url())) requests.push(request.url());
  });
  await serveWithSiteHeaders(page, baseURL ?? "");
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(requests).toEqual([]);
  expect(await page.locator("script[data-cf-beacon]").count()).toBe(0);
  expect(errors).toEqual([]);
});

// The build served under the preview and production host names, with the production policy.
for (const host of ["mmec-site.example.workers.dev", "mmec.adv.br"]) {
  test(`loads the beacon with the site token on ${host}`, async ({ page, baseURL }) => {
    const errors = collectConsoleErrors(page);
    const requests = await stubAnalytics(page);
    await page.route(`https://${host}/**`, async (route) => {
      const { pathname, search } = new URL(route.request().url());
      const response = await route.fetch({ url: `${baseURL}${pathname}${search}` });
      return route.fulfill({
        response,
        headers: { ...response.headers(), "content-security-policy": contentSecurityPolicy ?? "" },
      });
    });
    await page.goto(`https://${host}/`);
    await page.waitForLoadState("networkidle");

    const config = await page.locator("script[data-cf-beacon]").getAttribute("data-cf-beacon");
    expect(JSON.parse(config ?? "{}")).toEqual({ token: webAnalytics.token });
    expect(requests).toEqual([webAnalytics.scriptUrl]);
    expect(errors).toEqual([]);
  });
}
