// Date the content of each public page last changed (ISO date), printed as <lastmod> in
// sitemap.xml. Update the entry when a page's text changes; the sitemap build fails if a
// page has no date, and tests/seo.spec.ts checks the sitemap against the built pages.
export const pageLastModified: Readonly<Record<string, string>> = {
  "/": "2026-10-26",
  "/publicacoes": "2026-10-26",
  "/publicacoes/calendario-voz-do-brasil-2026": "2026-10-26",
  "/publicacoes/cartilha-eleicoes-2026": "2026-10-26",
  "/publicacoes/cartilha-propaganda-partidaria-2026": "2026-10-26",
  "/privacidade": "2026-10-27",
  "/termos": "2026-10-27",
};
