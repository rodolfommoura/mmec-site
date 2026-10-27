// robots.txt allows crawling everywhere, on the workers.dev hosts too: a crawler must be able
// to fetch a page there to see its noindex (X-Robots-Tag in public/_headers, robots meta on
// preview builds). Indexing rules: docs/security.md, "Search engines".
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) =>
  new Response(
    ["User-agent: *", "Allow: /", "", `Sitemap: ${new URL("/sitemap.xml", site).href}`, ""].join(
      "\n",
    ),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
