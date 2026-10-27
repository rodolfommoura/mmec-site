// Extracts every visible text segment (and text-bearing attribute) from the built pages and
// reports the ones that do not appear verbatim in docs/content-sources.md. The report is a
// starting list for a human audit: a segment can be sourced by a PDF or a rewrite-log row
// without being quoted word for word.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const distDir = "dist";
const sourcesFile = "docs/content-sources.md";

// Attribute values may contain ">" (for example `sizes="(width >= 64rem) ..."`).
const tagPattern = /<[a-z!/](?:[^>"']|"[^"]*"|'[^']*')*>/gi;

const textAttributes = ["alt", "aria-label", "title", "content"];
const textMetaNames = new Set([
  "description",
  "og:title",
  "og:description",
  "og:image:alt",
  "twitter:title",
  "twitter:description",
]);

function normalise(text) {
  return text
    .replace(/&nbsp;|&#160;|\u00a0/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\\\|/g, "|")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function attributeSegments(html) {
  const segments = [];
  for (const tag of html.matchAll(tagPattern)) {
    const source = tag[0];
    const metaName = /(?:name|property)="([^"]+)"/.exec(source)?.[1];
    for (const attribute of textAttributes) {
      const value = new RegExp(`\\s${attribute}="([^"]*)"`).exec(source)?.[1];
      if (!value) continue;
      if (attribute === "content" && !(metaName && textMetaNames.has(metaName))) continue;
      segments.push(value);
    }
  }
  return segments;
}

function textSegments(html) {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "");
  const title = /<title>([\s\S]*?)<\/title>/i.exec(body)?.[1] ?? "";
  const withoutHead = body.replace(/<head[\s\S]*?<\/head>/i, "");
  // Block-level boundaries end a segment; inline tags (a, strong, em, abbr, span) do not.
  const blocks = withoutHead
    .replace(
      /<\/?(p|h[1-6]|li|dt|dd|td|th|caption|figcaption|div|section|header|footer|nav|main|aside|article|ul|ol|dl|table|tr|br|address|button|label|blockquote)\b[^>]*>/gi,
      "\n",
    )
    .replace(tagPattern, "")
    .split("\n");
  return [title, ...blocks];
}

function listHtmlFiles() {
  return readdirSync(distDir, { recursive: true })
    .filter((file) => file.endsWith(".html") && !file.startsWith("_design"))
    .map((file) => file.split("\\").join("/"))
    .sort();
}

const sources = normalise(readFileSync(sourcesFile, "utf8"));

function isQuotedPart(part) {
  return sources.includes(part) || sources.includes(part.replace(/[.:;,]$/, ""));
}

// A paragraph on the new site often joins several rows of the inventory, so a segment also
// counts as quoted when each of its sentences is.
function isQuoted(segment) {
  if (isQuotedPart(segment)) return true;
  const sentences = segment.split(/(?<=[.;:])\s+/).filter((part) => part.length > 0);
  return sentences.length > 1 && sentences.every(isQuotedPart);
}

let unmatched = 0;

for (const file of listHtmlFiles()) {
  const html = readFileSync(join(distDir, file), "utf8");
  const seen = new Set();
  const misses = [];
  for (const raw of [...textSegments(html), ...attributeSegments(html)]) {
    const segment = normalise(raw);
    if (segment.length < 2 || seen.has(segment)) continue;
    seen.add(segment);
    if (!isQuoted(segment)) misses.push(raw.replace(/\s+/g, " ").trim());
  }
  unmatched += misses.length;
  console.log(`\n## ${file} (${seen.size} segments, ${misses.length} not quoted verbatim)`);
  for (const miss of misses) console.log(`- ${miss}`);
}

console.log(`\nTotal segments not quoted verbatim: ${unmatched}`);
