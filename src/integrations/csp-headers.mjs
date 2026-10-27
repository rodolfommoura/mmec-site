// @ts-check
/**
 * Writes the Content-Security-Policy into `dist/_headers` after every build.
 *
 * `public/_headers` holds the placeholder below; this hook replaces it with a policy that
 * allows only same-origin resources plus the SHA-256 hash of every inline `<script>` and
 * `<style>` found in the built pages (in practice the `@font-face` blocks of the Fonts API).
 * Hashing the real output means a new inline block can never be blocked silently, and no
 * `'unsafe-inline'` is needed. The Cloudflare Web Analytics hosts are added only when a
 * site token is configured (docs/decisions/0003-analytics.md).
 */
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { webAnalytics } from "../config/analytics.ts";

export const cspPlaceholder = "%CONTENT_SECURITY_POLICY%";

/**
 * Contents of inline (no `src`) executable scripts and of style elements in one page.
 * Regexes fit Astro's minified output (double-quoted attributes); a miss is caught by the
 * browser CSP test in tests/console.spec.ts.
 */
export function inlineBlocks(/** @type {string} */ html) {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter(([, attributes]) => !/\bsrc=/.test(attributes))
    // JSON-LD is data, never executed, so script-src does not apply to it.
    .filter(([, attributes]) => !/type="application\/ld\+json"/.test(attributes))
    .map(([, , content]) => content);
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(
    ([, content]) => content,
  );
  return { scripts, styles };
}

const sha256 = (/** @type {string} */ content) =>
  `'sha256-${createHash("sha256").update(content, "utf8").digest("base64")}'`;

/**
 * @param {{ scriptHashes: string[]; styleHashes: string[]; analytics: boolean }} sources
 */
export function buildPolicy({ scriptHashes, styleHashes, analytics }) {
  const directives = {
    "default-src": ["'self'"],
    "script-src": ["'self'", ...scriptHashes, ...(analytics ? [webAnalytics.scriptOrigin] : [])],
    "style-src": ["'self'", ...styleHashes],
    "img-src": ["'self'"],
    "font-src": ["'self'"],
    "connect-src": ["'self'", ...(analytics ? [webAnalytics.reportOrigin] : [])],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "upgrade-insecure-requests": [],
  };
  return Object.entries(directives)
    .map(([name, values]) => [name, ...values].join(" "))
    .join("; ");
}

async function listHtmlFiles(/** @type {string} */ dir) {
  const entries = await readdir(dir, { recursive: true });
  return entries.filter((entry) => entry.endsWith(".html")).map((entry) => join(dir, entry));
}

/** @returns {import("astro").AstroIntegration} */
export function cspHeaders() {
  return {
    name: "mmec-csp-headers",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const distDir = fileURLToPath(dir);
        const scriptHashes = new Set();
        const styleHashes = new Set();
        for (const file of await listHtmlFiles(distDir)) {
          const { scripts, styles } = inlineBlocks(await readFile(file, "utf8"));
          for (const content of scripts) scriptHashes.add(sha256(content));
          for (const content of styles) styleHashes.add(sha256(content));
        }

        const headersFile = join(distDir, "_headers");
        const headers = await readFile(headersFile, "utf8");
        if (!headers.includes(cspPlaceholder)) {
          throw new Error(`${cspPlaceholder} not found in public/_headers.`);
        }
        const policy = buildPolicy({
          scriptHashes: [...scriptHashes].sort(),
          styleHashes: [...styleHashes].sort(),
          analytics: Boolean(webAnalytics.token),
        });
        await writeFile(headersFile, headers.replace(cspPlaceholder, policy));
        logger.info(
          `CSP written: ${scriptHashes.size} inline script and ${styleHashes.size} inline style hashes.`,
        );
      },
    },
  };
}
