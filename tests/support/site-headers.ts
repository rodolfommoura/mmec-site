// `astro preview` ignores public/_headers. These helpers make the browser see what the Worker
// serves: the Content-Security-Policy the build wrote into dist/_headers.
import { readFileSync } from "node:fs";
import type { Page } from "@playwright/test";
import { webAnalytics } from "../../src/config/analytics";

const policyLine = /^\s+Content-Security-Policy: (.+)$/m;

export const contentSecurityPolicy = readFileSync("dist/_headers", "utf8").match(policyLine)?.[1];

/** Third-party origins approved in docs/decisions/0003-analytics.md, used only with a token. */
export const approvedOrigins: readonly string[] = webAnalytics.token
  ? [webAnalytics.scriptOrigin, webAnalytics.reportOrigin]
  : [];

/**
 * Serves same-origin responses with the real policy. Approved analytics requests get empty
 * answers, so tests never depend on (or send data to) Cloudflare.
 */
export async function serveWithSiteHeaders(page: Page, baseURL: string) {
  if (!contentSecurityPolicy) throw new Error("No Content-Security-Policy in dist/_headers.");
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (approvedOrigins.some((origin) => url.startsWith(origin))) {
      const isScript = url.startsWith(webAnalytics.scriptOrigin);
      return route.fulfill(
        isScript ? { contentType: "text/javascript", body: "" } : { status: 204, body: "" },
      );
    }
    // `upgrade-insecure-requests` makes WebKit ask for same-origin files over https, even on
    // localhost (Chromium and Firefox exempt it). In production the site is https only, so the
    // upgraded request is answered from the local http server and the policy stays unchanged.
    const upgraded = baseURL.replace(/^http:/, "https:");
    const local = url.startsWith(upgraded) ? baseURL + url.slice(upgraded.length) : url;
    if (!local.startsWith(baseURL)) return route.continue();
    const response = await route.fetch({ url: local });
    return route.fulfill({
      response,
      headers: { ...response.headers(), "content-security-policy": contentSecurityPolicy },
    });
  });
}
