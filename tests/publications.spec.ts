import { createHash } from "node:crypto";
import { expect, test } from "@playwright/test";
import { listPagePaths } from "../scripts/pages.mjs";

const publicationPaths = listPagePaths().filter((path) => path.startsWith("/publicacoes/"));

// The legacy PDFs are served byte for byte (docs/url-map.md, "Documents").
const legacyPdfHashes: Record<string, string> = {
  "/assets/docs/cartilha-eleicoes-2026.pdf":
    "7484d43888cf42875d32cb0ab80d23d85aeedbec55c0eadf0df4f2715fd9e97c",
  "/assets/docs/cartilha-propaganda-partidaria-2026.pdf":
    "6fc200788db7ccdb4e54521f3eece58387261f3bf622e6db7909df8975dbacd9",
  "/assets/docs/calendario-voz-do-brasil-2026.pdf":
    "af03129c8eced7b12f5c237cc9b929038faaa7aacd78bddeb237de65707f1b3e",
};

/** Page count from the PDF page tree: the root /Pages node has the largest /Count. */
function pdfPageCount(pdf: Buffer): number {
  const counts = [...pdf.toString("latin1").matchAll(/\/Count\s+(\d+)/g)].map(([, n]) => Number(n));
  return Math.max(0, ...counts);
}

test("builds the three legacy publications", () => {
  expect(publicationPaths).toEqual([
    "/publicacoes/calendario-voz-do-brasil-2026",
    "/publicacoes/cartilha-eleicoes-2026",
    "/publicacoes/cartilha-propaganda-partidaria-2026",
  ]);
});

for (const path of publicationPaths) {
  test(`${path} shows the real size and page count of its PDF`, async ({ page, request }) => {
    await page.goto(path);
    const details = page.locator("[data-pdf-bytes]");
    const bytes = Number(await details.getAttribute("data-pdf-bytes"));
    const pages = Number(await details.getAttribute("data-pdf-pages"));
    await expect(details).toHaveText(`PDF · ${pages} páginas · ${Math.round(bytes / 1000)} KB`);

    const open = page.getByRole("link", { name: "Abrir PDF completo" });
    const href = (await open.getAttribute("href")) ?? "";
    const response = await request.get(href);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("application/pdf");
    const pdf = await response.body();
    expect(pdf.length).toBe(bytes);
    expect(pdfPageCount(pdf)).toBe(pages);
    if (legacyPdfHashes[href]) {
      expect(createHash("sha256").update(pdf).digest("hex")).toBe(legacyPdfHashes[href]);
    }

    const download = page.getByRole("link", { name: /^Baixar / });
    await expect(download).toHaveAttribute("href", href);
    await expect(download).toHaveAttribute("download", href.split("/").pop() ?? "");
  });

  test(`${path} has one h1, its type and year, and the legal notice`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("dl")).toContainText("Edição");
    await expect(page.getByRole("complementary", { name: "Aviso jurídico" })).toBeVisible();
    await expect(
      page.locator('nav[aria-label="Trilha de navegação"] [aria-current="page"]'),
    ).toHaveCount(1);
  });

  test(`${path} prints without buttons and with the PDF address`, async ({ page }) => {
    await page.goto(path);
    await page.emulateMedia({ media: "print" });
    await expect(page.getByRole("link", { name: "Abrir PDF completo" })).toBeHidden();
    await expect(page.getByText(/^PDF: https:\/\/mmec\.adv\.br\/assets\/docs\//)).toBeVisible();
    await expect(page.locator(".site-nav")).toBeHidden();
  });

  test(`${path} has no horizontal overflow at 320 px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}

// Booklets whose period has ended carry a neutral note on the period they refer to.
const periodNotes: Record<string, string> = {
  "/publicacoes/cartilha-eleicoes-2026": "Edição de 2026, referente ao período das Eleições 2026.",
  "/publicacoes/cartilha-propaganda-partidaria-2026":
    "Edição de 2026, referente ao período do primeiro semestre de 2026.",
};

for (const path of publicationPaths) {
  test(`${path} shows the period note only when its period has ended`, async ({ page }) => {
    await page.goto(path);
    const note = page.locator(".publication-period");
    const expected = periodNotes[path];
    if (expected) await expect(note).toHaveText(expected);
    else await expect(note).toHaveCount(0);
  });
}

test("the index lists every publication, labelled with type and year", async ({ page }) => {
  await page.goto("/publicacoes");
  const cards = page.locator("article.publication-card");
  await expect(cards).toHaveCount(publicationPaths.length);
  for (const card of await cards.all()) {
    await expect(card.locator(".eyebrow")).toHaveText(/^.+ · \d{4}$/);
  }
});

for (const path of ["/privacidade", "/termos"]) {
  test(`${path} shows its last update date`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("time[datetime]")).toHaveAttribute("datetime", /^\d{4}-\d{2}-\d{2}$/);
  });
}

test("the privacy policy names no tool the site does not use", async ({ page }) => {
  await page.goto("/privacidade");
  const text = (await page.locator("main").textContent()) ?? "";
  expect(text).not.toMatch(/Google Analytics|Clarity|rigorosos termos/);
});

test("the privacy policy identifies the controller by CNPJ", async ({ page }) => {
  await page.goto("/privacidade");
  await expect(page.locator("main")).toContainText(
    "Machado Moura e Cardoso Advogados Associados, CNPJ nº 07.028.086/0001-00.",
  );
});

test("the not-found page links home, to the publications and to the contact address", async ({
  page,
}) => {
  const response = await page.goto("/pagina-que-nao-existe");
  expect(response?.status()).toBe(404);
  const main = page.locator("main");
  await expect(main.getByRole("link", { name: "Voltar à página inicial" })).toHaveAttribute(
    "href",
    "/",
  );
  await expect(main.getByRole("link", { name: "Publicações" })).toHaveAttribute(
    "href",
    "/publicacoes",
  );
  await expect(main.getByRole("link", { name: /@/ })).toHaveAttribute("href", /^mailto:/);
});
