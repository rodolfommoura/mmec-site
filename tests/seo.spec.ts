import { expect, test } from "@playwright/test";
import { listPagePaths } from "../scripts/pages.mjs";
import { contact } from "../src/config/site";

// The design specimen is internal: never in the sitemap, never canonical.
const publicPaths = listPagePaths().filter((path) => path !== "/_design");
const siteUrl = "https://mmec.adv.br";

test("every public page has a unique title, description and canonical URL", async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const path of publicPaths) {
    await page.goto(path);
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(title, path).not.toBe("");
    expect(description, path).toBeTruthy();
    expect(canonical, path).toBe(`${siteUrl}${path}`);
    expect(titles.has(title), `duplicate title on ${path}`).toBe(false);
    expect(descriptions.has(description ?? ""), `duplicate description on ${path}`).toBe(false);
    titles.add(title);
    descriptions.add(description ?? "");
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
  }
});

test("sitemap lists exactly the public pages, each with lastmod", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);
  const xml = await response.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc);
  const lastmods = [...xml.matchAll(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g)];
  expect([...locs].sort()).toEqual(publicPaths.map((path) => `${siteUrl}${path}`).sort());
  expect(lastmods).toHaveLength(locs.length);
});

test("robots.txt allows crawling and points to the sitemap", async ({ request }) => {
  const text = await (await request.get("/robots.txt")).text();
  expect(text).toContain("User-agent: *");
  expect(text).toContain("Allow: /");
  expect(text).not.toContain("Disallow: /");
  expect(text).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
});

test("security.txt names the contact address and a future expiry", async ({ request }) => {
  const text = await (await request.get("/.well-known/security.txt")).text();
  expect(text).toContain(`Contact: mailto:${contact.email}`);
  const expires = text.match(/^Expires: (.+)$/m)?.[1] ?? "";
  const daysLeft = (Date.parse(expires) - Date.now()) / 86_400_000;
  expect(daysLeft).toBeGreaterThan(300);
  expect(daysLeft).toBeLessThanOrEqual(366);
});

test("home declares a LegalService with verified facts only", async ({ page }) => {
  await page.goto("/");
  const scripts = page.locator('script[type="application/ld+json"]');
  await expect(scripts).toHaveCount(1);
  const data = JSON.parse((await scripts.textContent()) ?? "{}");
  expect(data["@type"]).toBe("LegalService");
  expect(Object.keys(data).sort()).toEqual(
    ["@context", "@type", "address", "name", "telephone", "url"].sort(),
  );
  expect(data.telephone).toBe("+556137035558");
  expect(data.address.postalCode).toBe("71615-560");
});
