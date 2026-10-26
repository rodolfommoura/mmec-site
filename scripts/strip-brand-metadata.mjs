// Removes provenance metadata (C2PA content credentials) from the brand files copied from
// `Marca/standardized`, and compacts SVG path data without changing any coordinate.
// Run it again whenever brand files are re-copied: `node scripts/strip-brand-metadata.mjs`.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const brandDir = "public/brand";
const extraFiles = ["public/favicon.svg"];

/** C2PA manifests live in a `<metadata>` block; the namespace is declared on the root element. */
function stripSvg(source) {
  return source
    .replace(/<metadata>[\s\S]*?<\/metadata>/g, "")
    .replace(/\s+xmlns:c2pa="[^"]*"/g, "")
    .replace(/ d="([^"]*)"/g, (_, data) => ` d="${compactPathData(data)}"`);
}

/**
 * Lossless: drops trailing zeros ("126.00" -> "126", "148.50" -> "148.5") and repeated `L`
 * commands, which SVG treats as implicit after `M` and `L`. Every coordinate keeps its value.
 */
function compactPathData(data) {
  return data
    .replace(/(\d+)\.(\d*?)0+\b/g, (_, int, frac) => (frac ? `${int}.${frac}` : int))
    .replace(/ L(?=-?\d)/g, " ")
    .replace(/ L /g, " ");
}

/** C2PA manifests in PNG files are stored in `caBX` chunks; every other chunk is kept as is. */
function stripPng(buffer) {
  const signatureLength = 8;
  const chunks = [buffer.subarray(0, signatureLength)];
  let offset = signatureLength;
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("latin1", offset + 4, offset + 8);
    const end = offset + 12 + length;
    if (type !== "caBX") chunks.push(buffer.subarray(offset, end));
    offset = end;
  }
  return Buffer.concat(chunks);
}

function listFiles(dir) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

for (const file of [...listFiles(brandDir), ...extraFiles]) {
  const extension = extname(file).toLowerCase();
  const before = readFileSync(file);
  let after;
  if (extension === ".svg") after = Buffer.from(stripSvg(before.toString("utf8")), "utf8");
  else if (extension === ".png") after = stripPng(before);
  else continue;
  if (!after.equals(before)) {
    writeFileSync(file, after);
    console.log(`${file}: ${before.length} -> ${after.length} bytes`);
  }
}
