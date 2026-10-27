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

/** Serves the local build under another host name, with the production policy. */
async function serveAs(page: Page, host: string, baseURL: string): Promise<string> {
  const policy = contentSecurityPolicy;
  if (!policy) throw new Error("No Content-Security-Policy in dist/_headers.");
  await page.route(`https://${host}/**`, async (route) => {
    const { pathname, search } = new URL(route.request().url());
    const response = await route.fetch({ url: `${baseURL}${pathname}${search}` });
    return route.fulfill({
      response,
      headers: { ...response.headers(), "content-security-policy": policy },
    });
  });
  return `https://${host}/`;
}

/** Opens a page and returns the beacon config, the Cloudflare requests and console errors. */
async function openPage(page: Page, url: string) {
  const errors = collectConsoleErrors(page);
  const requests = await stubAnalytics(page);
  await page.goto(url);
  await page.waitForLoadState("networkidle");
  const beacon = page.locator("script[data-cf-beacon]");
  const config = (await beacon.count()) ? await beacon.getAttribute("data-cf-beacon") : null;
  return { config, requests, errors };
}

test.skip(!webAnalytics.token, "No Web Analytics site token: the beacon is never rendered.");

// Cloudflare accepts the beacon's report only from the registered host, so the same build stays
// silent on a local server (tests, Lighthouse) and on the preview Worker.
test("loads no beacon on a local server", async ({ page, baseURL }) => {
  await serveWithSiteHeaders(page, baseURL ?? "");
  const { config, requests, errors } = await openPage(page, "/");
  expect(config).toBeNull();
  expect(requests).toEqual([]);
  expect(errors).toEqual([]);
});

for (const host of [
  "mmec-site.rodolfo-e70.workers.dev",
  "feat-security-privacy-seo-mmec-site.rodolfo-e70.workers.dev",
]) {
  test(`loads no beacon on the preview host ${host}`, async ({ page, baseURL }) => {
    const url = await serveAs(page, host, baseURL ?? "");
    const { config, requests, errors } = await openPage(page, url);
    expect(config).toBeNull();
    expect(requests).toEqual([]);
    expect(errors).toEqual([]);
  });
}

for (const host of webAnalytics.hosts) {
  test(`loads the beacon with the site token on ${host}`, async ({ page, baseURL }) => {
    const url = await serveAs(page, host, baseURL ?? "");
    const { config, requests, errors } = await openPage(page, url);
    expect(JSON.parse(config ?? "{}")).toEqual({ token: webAnalytics.token });
    // A CSP refusal would be a console error and leave the stub unrequested.
    expect(requests).toEqual([webAnalytics.scriptUrl]);
    expect(errors).toEqual([]);
  });
}

test("the beacon hosts are exactly mmec.adv.br and www.mmec.adv.br", () => {
  expect([...webAnalytics.hosts].sort()).toEqual(["mmec.adv.br", "www.mmec.adv.br"]);
});
