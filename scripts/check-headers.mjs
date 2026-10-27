// Checks the response headers of the built site, served by Wrangler with the same asset rules
// as the Worker (_headers). The policy itself is checked in the browser by tests/console.spec.ts.
import { readdirSync } from "node:fs";

// No usage telemetry from CI or local test runs; set before Wrangler loads.
process.env.WRANGLER_SEND_METRICS ??= "false";
const { unstable_startWorker } = await import("wrangler");

const securityHeaders = {
  "content-security-policy": /^default-src 'self';.*frame-ancestors 'none'/,
  "strict-transport-security": /^max-age=\d+$/,
  "x-content-type-options": /^nosniff$/,
  "x-frame-options": /^DENY$/,
  "referrer-policy": /^strict-origin-when-cross-origin$/,
  "permissions-policy": /^(?:[a-z-]+=\(\)(?:, |$))+$/,
  "cross-origin-opener-policy": /^same-origin$/,
  // Preview only, removed at the cutover (Phase 8).
  "x-robots-tag": /^noindex, nofollow$/,
};

const shortCache = /^public, max-age=0, must-revalidate$/;
const immutable = /^public, max-age=31536000, immutable$/;
const hashedAsset = `/_astro/${readdirSync("dist/_astro").find((file) => file.endsWith(".css"))}`;

const samples = [
  { path: "/", status: 200, cache: shortCache, type: "text/html" },
  { path: "/publicacoes/cartilha-eleicoes-2026", status: 200, cache: shortCache },
  { path: "/assets/docs/cartilha-eleicoes-2026.pdf", status: 200, type: "application/pdf" },
  { path: hashedAsset, status: 200, cache: immutable, type: "text/css" },
  { path: "/.well-known/security.txt", status: 200, type: "text/plain" },
  { path: "/sitemap.xml", status: 200, type: "application/xml" },
  { path: "/pagina-inexistente", status: 404, type: "text/html" },
];

function check(sample, response) {
  const problems = [];
  if (response.status !== sample.status) problems.push(`status ${response.status}`);
  for (const [name, pattern] of Object.entries(securityHeaders)) {
    const value = response.headers.get(name);
    if (!value || !pattern.test(value)) problems.push(`${name}: ${value ?? "missing"}`);
  }
  const cache = response.headers.get("cache-control") ?? "";
  if (sample.cache && !sample.cache.test(cache)) problems.push(`cache-control: ${cache}`);
  const type = response.headers.get("content-type") ?? "";
  if (sample.type && !type.startsWith(sample.type)) problems.push(`content-type: ${type}`);
  return problems;
}

const worker = await unstable_startWorker({
  config: "wrangler.jsonc",
  dev: { server: { hostname: "127.0.0.1", port: 0 }, inspector: false, logLevel: "warn" },
});

let failures = 0;
try {
  await worker.ready;
  for (const sample of samples) {
    const response = await worker.fetch(`http://localhost${sample.path}`, {
      redirect: "manual",
      headers: { "Sec-Fetch-Mode": "navigate", Accept: "text/html" },
    });
    await response.arrayBuffer();
    const problems = check(sample, response);
    failures += problems.length > 0 ? 1 : 0;
    console.log(
      `${problems.length > 0 ? "FAIL" : "ok"} ${sample.path}${problems.length > 0 ? `: ${problems.join("; ")}` : ""}`,
    );
  }
} finally {
  await worker.dispose();
}

console.log(`Checked headers on ${samples.length} paths, ${failures} failed.`);
process.exitCode = failures === 0 ? 0 : 1;
