// Fails when CSS outside src/styles/tokens.css hard-codes a colour, font, length or duration
// (docs/phases/02-design-foundations.md). Checks .css files and <style> blocks in .astro files.
import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

const tokensFile = join("src", "styles", "tokens.css");
const tokens = readFileSync(tokensFile, "utf8");

// Media queries cannot read custom properties, so they may only repeat the breakpoint tokens.
const breakpoints = new Set(
  [...tokens.matchAll(/--breakpoint-\w+:\s*([\d.]+rem)\s*;/g)].map(([, value]) => value),
);

const rules = [
  { name: "hex colour", pattern: /#[0-9a-f]{3,8}\b/i },
  { name: "colour function", pattern: /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i },
  {
    name: "named colour",
    declarationValueOnly: true,
    pattern: /\b(?:white|black|red|green|blue|gray|grey|silver|navy|maroon)\b/i,
  },
  { name: "font family literal", pattern: /font-family:(?!\s*(?:var\(|inherit\b))/ },
  { name: "font shorthand", pattern: /(?<![-\w])font:(?!\s*inherit\b)/ },
  { name: "font weight literal", pattern: /font-weight:\s*\d/ },
  {
    name: "length literal",
    pattern: /(?<![\w.-])-?\d*\.?\d+(?:px|rem|em|pt|ch|vw|vh|dvh|svh|lvh)\b/,
  },
  { name: "duration literal", pattern: /(?<![\w.-])\d*\.?\d+m?s\b/ },
  { name: "line colour used for text", pattern: /(?<![-\w])color:\s*var\(--color-line\)/ },
];

function listFiles(dir) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name))
    .filter((file) => [".css", ".astro"].includes(extname(file)));
}

/** CSS of a file with its starting line, so reports point at the real line. */
function cssBlocks(file, source) {
  if (extname(file) === ".css") return [{ css: source, firstLine: 1 }];
  return [...source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((match) => ({
    css: match[1],
    firstLine: source.slice(0, match.index).split("\n").length,
  }));
}

function checkMediaLine(line) {
  const lengths = line.match(/\d*\.?\d+(?:px|rem|em)\b/g) ?? [];
  return lengths.filter((length) => !breakpoints.has(length));
}

const problems = [];

for (const file of listFiles("src")) {
  if (file === tokensFile) continue;
  for (const { css, firstLine } of cssBlocks(file, readFileSync(file, "utf8"))) {
    const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, (comment) =>
      comment.replace(/[^\n]/g, " "),
    );
    withoutComments.split("\n").forEach((line, index) => {
      const location = `${file}:${firstLine + index}`;
      if (/^\s*@media\b/.test(line)) {
        for (const value of checkMediaLine(line)) {
          problems.push(`${location}: breakpoint ${value} is not a --breakpoint-* token`);
        }
        return;
      }
      // Value of a declaration, without custom property references such as var(--color-green).
      const value = /^\s*[\w-]+\s*:(.*);\s*$/.exec(line)?.[1]?.replace(/var\(--[\w-]+\)/g, "");
      for (const rule of rules) {
        const subject = rule.declarationValueOnly ? value : line;
        if (subject !== undefined && rule.pattern.test(subject)) {
          problems.push(`${location}: ${rule.name}: ${line.trim()}`);
        }
      }
    });
  }
}

for (const problem of problems) console.error(problem);
console.log(`Design literal check: ${problems.length} problem(s).`);
process.exitCode = problems.length === 0 ? 0 : 1;
