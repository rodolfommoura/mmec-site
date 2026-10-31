// Checks the response headers of the built site, served by Wrangler with the same asset rules
// as the Worker (_headers). The policy itself is checked in the browser by tests/console.spec.ts.
// With a base URL (`node scripts/check-headers.mjs https://mmec.adv.br`) it checks that live
// site instead; dist/ must then be built from the deployed commit (hashed asset name).
import { readdirSync } from "node:fs";
import { serveSite } from "./serve-site.mjs";

const securityHeaders = {
  "content-security-policy": /^default-src 'self';.*frame-ancestors 'none'/,
  "strict-transport-security": /^max-age=\d+$/,
  "x-content-type-options": /^nosniff$/,
  "x-frame-options": /^DENY$/,
  "referrer-policy": /^strict-origin-when-cross-origin$/,
  "permissions-policy": /^(?:[a-z-]+=\(\)(?:, |$))+$/,
  "cross-origin-opener-policy": /^same-origin$/,
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

// mmec.adv.br is indexable; every workers.dev host is noindex (public/_headers).
const robotsSamples = [
  { host: "mmec.adv.br", robots: null },
  { host: "mmec-site.example.workers.dev", robots: /^noindex, nofollow$/ },
  { host: "branch-mmec-site.example.workers.dev", robots: /^noindex, nofollow$/ },
];

function check(sample, response, body) {
  const problems = [];
  // Production HTML must not carry the preview robots meta tag (src/config/indexing.ts).
  if (sample.status === 200 && sample.type === "text/html" && /<meta name="robots"/.test(body)) {
    problems.push("robots meta tag in the HTML");
  }
  if (response.status !== sample.status) problems.push(`status ${response.status}`);
  for (const [name, pattern] of Object.entries(securityHeaders)) {
    const value = response.headers.get(name);
    if (!value || !pattern.test(value)) problems.push(`${name}: ${value ?? "missing"}`);
  }
  const cache = response.headers.get("cache-control") ?? "";
  if (sample.cache && !sample.cache.test(cache)) problems.push(`cache-control: ${cache}`);
  const type = response.headers.get("content-type") ?? "";
  if (sample.type && !type.startsWith(sample.type)) problems.push(`content-type: ${type}`);
  const robots = response.headers.get("x-robots-tag");
  if (sample.robots === null && robots) problems.push(`x-robots-tag: ${robots}`);
  if (sample.robots && !sample.robots.test(robots ?? "")) {
    problems.push(`x-robots-tag: ${robots ?? "missing"}`);
  }
  return problems;
}

const site = await serveSite(process.argv[2]);
// A live workers.dev host is noindex by design (public/_headers); any other live host is indexable.
const liveRobots =
  site.live && site.base.hostname.endsWith(".workers.dev") ? /^noindex, nofollow$/ : null;
// Locally the request host is chosen per check; live, only the given site can be reached.
const checks = [
  ...samples.map((sample) => ({ ...sample, robots: site.live ? liveRobots : null })),
  ...(site.live ? [] : robotsSamples.map((sample) => ({ ...sample, path: "/", status: 200 }))),
];

let failures = 0;
try {
  for (const sample of checks) {
    const response = await site.fetch(sample.path, sample.host);
    const body = await response.text();
    const problems = check(sample, response, body);
    failures += problems.length > 0 ? 1 : 0;
    const label = `${sample.host ?? ""}${sample.path}`;
    console.log(
      `${problems.length > 0 ? "FAIL" : "ok"} ${label}${problems.length > 0 ? `: ${problems.join("; ")}` : ""}`,
    );
  }
} finally {
  await site.dispose();
}

console.log(`Checked headers on ${checks.length} requests, ${failures} failed.`);
process.exitCode = failures === 0 ? 0 : 1;
