// Checks every legacy URL in docs/url-map.md against the built site, served by Wrangler with
// the same asset rules as the Worker (_redirects, html_handling, not_found_handling).
// With a base URL (`node scripts/check-redirects.mjs https://mmec.adv.br`) it checks that live
// site instead.
import { readFileSync } from "node:fs";
import { serveSite } from "./serve-site.mjs";

// "Any other path with a trailing slash": platform behaviour, checked on one sample page.
const trailingSlashSample = { path: "/privacidade/", target: "/privacidade" };

// Paths in backticks; "/publicacoes/..." is a placeholder in the table, not a URL.
const codePaths = (cell) =>
  [...cell.matchAll(/`(\/[^`]*)`/g)]
    .map(([, path]) => path)
    .filter((path) => !path.includes("..."));

/** Rows of every Markdown table under each "## " heading of the URL map. */
function readTables(markdown) {
  const tables = new Map();
  let heading = "";
  for (const line of markdown.split("\n")) {
    if (line.startsWith("## ")) heading = line.slice(3).trim();
    if (!line.startsWith("|") || /^\|\s*-/.test(line)) continue;
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    const rows = tables.get(heading) ?? [];
    tables.set(heading, [...rows, cells]);
  }
  // The first row of each table is its header.
  return new Map([...tables].map(([name, rows]) => [name, rows.slice(1)]));
}

/** One expectation per URL: allowed status codes and, for redirects, the target path. */
function expectations(tables) {
  const expected = [];
  const targets = new Map();

  for (const [oldCell, fate, newCell, status] of tables.get("Pages") ?? []) {
    const newPath = codePaths(newCell)[0];
    for (const path of codePaths(oldCell)) {
      if (fate === "kept") expected.push({ path, statuses: [200] });
      if (fate.startsWith("kept as the not-found page")) expected.push({ path, statuses: [404] });
      if (fate === "redirected" && status === "301") {
        // Trailing-slash rows name "the matching URL": the target of the same path without it.
        const target = newPath ?? targets.get(path.replace(/\/$/, ""));
        if (!target) throw new Error(`No target found for ${path} in docs/url-map.md.`);
        targets.set(path, target);
        expected.push({ path, statuses: [301], target });
      }
    }
  }
  expected.push({ ...trailingSlashSample, statuses: [301, 307, 308] });

  for (const [oldCell, fate] of tables.get("Documents") ?? []) {
    for (const path of codePaths(oldCell)) {
      if (fate === "kept") expected.push({ path, statuses: [200], contentType: "application/pdf" });
    }
  }
  for (const [oldCell, fate] of tables.get("Images, icons, styles and scripts") ?? []) {
    for (const path of codePaths(oldCell)) {
      if (fate === "kept or redirected") expected.push({ path, statuses: [200, 301] });
      if (fate === "removed") expected.push({ path, statuses: [404] });
    }
  }
  for (const [oldCell, fate] of tables.get("Crawling files") ?? []) {
    for (const path of codePaths(oldCell)) {
      if (fate === "kept") expected.push({ path, statuses: [200] });
    }
  }
  for (const [newCell] of tables.get("New URLs (no legacy equivalent)") ?? []) {
    for (const path of codePaths(newCell)) {
      // Reserved paths are not built and answer 404 like any unknown path.
      expected.push({ path, statuses: path === "/equipe" ? [404] : [200] });
    }
  }
  return expected;
}

function check(expectation, response, base) {
  const problems = [];
  if (!expectation.statuses.includes(response.status)) {
    problems.push(`status ${response.status}, expected ${expectation.statuses.join(" or ")}`);
  }
  const location = response.headers.get("location");
  const target = expectation.target;
  if (target && location) {
    // A redirect must stay on the same host: one hop, never to another origin.
    const url = new URL(location, base);
    if (url.origin !== base.origin || url.pathname !== target) {
      problems.push(`redirects to ${location}, expected ${target}`);
    }
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (expectation.contentType && !contentType.startsWith(expectation.contentType)) {
    problems.push(`content type ${contentType}, expected ${expectation.contentType}`);
  }
  return problems;
}

const tables = readTables(readFileSync("docs/url-map.md", "utf8"));
const expected = expectations(tables);

const site = await serveSite(process.argv[2]);

let failures = 0;
try {
  for (const expectation of expected) {
    const response = await site.fetch(expectation.path);
    await response.arrayBuffer();
    const problems = check(expectation, response, site.base);
    failures += problems.length > 0 ? 1 : 0;
    const label = problems.length > 0 ? "FAIL" : "ok";
    const detail = problems.length > 0 ? `: ${problems.join("; ")}` : ` ${response.status}`;
    console.log(`${label} ${expectation.path}${detail}`);
  }
} finally {
  await site.dispose();
}

console.log(`Checked ${expected.length} URLs, ${failures} failed.`);
process.exitCode = failures === 0 ? 0 : 1;
