// robots.txt allows crawling everywhere, on the preview too: a crawler must be able to fetch
// a page to see its noindex (X-Robots-Tag in public/_headers, robots meta in BaseLayout).
// Production rules at the cutover: docs/security.md, "Search engines".
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) =>
  new Response(
    ["User-agent: *", "Allow: /", "", `Sitemap: ${new URL("/sitemap.xml", site).href}`, ""].join(
      "\n",
    ),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
