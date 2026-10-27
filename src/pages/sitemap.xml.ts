// sitemap.xml: every public page, extensionless (docs/url-map.md), with its last change date.
// The design specimen and the not-found page are never listed.
import type { APIRoute } from "astro";
import { pageLastModified } from "../config/page-dates";
import { getPublications, publicationHref, publicationsPath } from "../config/publications";
import { legalNavigation } from "../config/site";

export const GET: APIRoute = async ({ site }) => {
  const publications = await getPublications();
  const paths = [
    "/",
    publicationsPath,
    ...publications.map(publicationHref),
    ...legalNavigation.map((item) => item.href),
  ];
  const urls = paths.map((path) => {
    const lastmod = pageLastModified[path];
    if (!lastmod) throw new Error(`No last-modified date for ${path} in src/config/page-dates.ts.`);
    return `  <url>\n    <loc>${new URL(path, site).href}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  });
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
