import { expect, test } from "@playwright/test";
import { approvedOrigins } from "./support/site-headers";

const widths = [320, 390, 768, 1024, 1440];

// Legacy anchors that must keep landing on the right place (docs/url-map.md).
const legacyAnchors = [
  "inicio",
  "topo",
  "escritorio",
  "atuacao",
  "inteligencia",
  "contato",
  "conteudo-principal",
  ...Array.from({ length: 6 }, (_, index) => `area-${index + 1}`),
];

// Only the hosts approved in docs/decisions/0003-analytics.md, and only with a site token.
test("makes no unapproved third-party request on load", async ({ page, baseURL }) => {
  const external: string[] = [];
  page.on("request", (request) => {
    const url = request.url();
    if (url.startsWith(baseURL ?? "")) return;
    if (!approvedOrigins.some((origin) => url.startsWith(origin))) external.push(url);
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(external).toEqual([]);
});

for (const width of widths) {
  test(`has no horizontal overflow at ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}

test("keeps every legacy anchor", async ({ page }) => {
  await page.goto("/");
  for (const id of legacyAnchors) {
    await expect(page.locator(`[id="${id}"]`), id).toHaveCount(1);
  }
});

test("has one h1 and six practice areas", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("#atuacao h3")).toHaveCount(6);
});

test("every image has an alt attribute", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("img:not([alt])")).toHaveCount(0);
});

test("declares canonical URL and Open Graph image", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://mmec.adv.br/",
  );
  const image = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(image).toBe("https://mmec.adv.br/og/mmec-og-default.png");
  const response = await request.get(new URL(image ?? "").pathname);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("image/png");
});

test("links to the renamed Google Maps listing without embedding it", async ({ page }) => {
  await page.goto("/");
  const mapLink = page.locator("#contato").getByRole("link", { name: "Abrir no Google Maps" });
  await expect(mapLink).toHaveAttribute(
    "href",
    /^https:\/\/www\.google\.com\/maps\/place\/Machado\+Moura\+e\+Cardoso\+Advogados\+Associados\/@-15\.8463737,-47\.8944906,/,
  );
  await expect(mapLink).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.locator("iframe")).toHaveCount(0);
});
