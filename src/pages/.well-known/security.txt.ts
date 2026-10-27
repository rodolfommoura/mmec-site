// RFC 9116 security.txt. The contact is the site's contact address (owner decision for
// Phase 5, Q-03). "Expires" is one year after the build, so every deploy renews it.
import type { APIRoute } from "astro";
import { contact } from "../../config/site";

const oneYearMs = 365 * 24 * 60 * 60 * 1000;

export const GET: APIRoute = ({ site }) => {
  const expires = new Date(Date.now() + oneYearMs);
  expires.setUTCHours(0, 0, 0, 0);
  const body = [
    `Contact: mailto:${contact.email}`,
    `Expires: ${expires.toISOString().replace(".000Z", "Z")}`,
    // Portuguese only: no source says the firm handles reports in other languages.
    "Preferred-Languages: pt",
    `Canonical: ${new URL("/.well-known/security.txt", site).href}`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
