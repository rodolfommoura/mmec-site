// The callbacks passed to page.evaluate() run in Chromium, not in Node.
/* global document, Image, OffscreenCanvas, DOMMatrix */
// Proves that the brand files in the working tree draw exactly the same artwork as at a Git ref
// (default `main`), after `strip-brand-metadata.mjs` has run. Three checks per file:
// SVG path coordinates are numerically identical, SVG renders are pixel-identical in Chromium,
// and PNG pixels are identical. Usage: `node scripts/verify-brand-artwork.mjs [git-ref]`.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { chromium } from "@playwright/test";

const ref = process.argv[2] ?? "main";
const files = [
  ...readdirSync("public/brand", { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name).split("\\").join("/")),
  "public/favicon.svg",
];

const readAtRef = (file) => execFileSync("git", ["show", `${ref}:${file}`]);

/** Every number of every path, in order, so `L` compaction and zero trimming must not matter. */
const pathNumbers = (svg) =>
  [...svg.matchAll(/ d="([^"]*)"/g)].flatMap(([, d]) => d.match(/-?\d*\.?\d+/g).map(Number));
const pathCommands = (svg) =>
  [...svg.matchAll(/ d="([^"]*)"/g)].map(([, d]) => d.replace(/[^MZmz]/g, "")).join("|");

async function renderSvg(page, svg) {
  const { width, height } = await page.evaluate((markup) => {
    document.body.innerHTML = markup;
    const box = document.querySelector("svg").viewBox.baseVal;
    return { width: box.width, height: box.height };
  }, svg.toString("utf8"));
  // Render at a fixed 1000 px width; transparent background so antialiasing differences show.
  const scale = 1000 / width;
  await page.setViewportSize({ width: 1000, height: Math.ceil(height * scale) });
  await page.evaluate(() => {
    const element = document.querySelector("svg");
    element.setAttribute("width", "100%");
    element.removeAttribute("height");
    element.style.display = "block";
  });
  return page.screenshot({ omitBackground: true });
}

/** Decodes a PNG in the browser, so no image library is needed. */
async function rawPixels(page, png) {
  const values = await page.evaluate(
    async (dataUrl) => {
      const image = new Image();
      image.src = dataUrl;
      await image.decode();
      const canvas = new OffscreenCanvas(image.naturalWidth, image.naturalHeight);
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      return [...context.getImageData(0, 0, canvas.width, canvas.height).data];
    },
    `data:image/png;base64,${png.toString("base64")}`,
  );
  return Buffer.from(values);
}

async function artworkBox(page, svg) {
  return page.evaluate((markup) => {
    document.body.innerHTML = markup;
    const root = document.querySelector("svg");
    const box = root.viewBox.baseVal;
    const paths = [...root.querySelectorAll("path")].map((path) => {
      const b = path.getBBox();
      const m = path.transform.baseVal.consolidate()?.matrix ?? new DOMMatrix();
      return { x: m.e + b.x * m.a, y: m.f + b.y * m.d, w: b.width * m.a, h: b.height * m.d };
    });
    return { viewBox: [box.width, box.height], paths };
  }, svg.toString("utf8"));
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent("<!doctype html><body style='margin:0'></body>");
let failures = 0;

for (const file of files) {
  const before = readAtRef(file);
  const after = readFileSync(file);
  const extension = extname(file);
  let identical;
  if (extension === ".svg") {
    const sameNumbers =
      JSON.stringify(pathNumbers(before.toString())) ===
      JSON.stringify(pathNumbers(after.toString()));
    const sameCommands = pathCommands(before.toString()) === pathCommands(after.toString());
    const pixelsBefore = await rawPixels(page, await renderSvg(page, before));
    const pixelsAfter = await rawPixels(page, await renderSvg(page, after));
    identical = sameNumbers && sameCommands && pixelsBefore.equals(pixelsAfter);
    const box = await artworkBox(page, after);
    console.log(
      `${identical ? "same" : "DIFF"} ${file} (numbers: ${sameNumbers}, subpaths: ${sameCommands}, render: ${pixelsBefore.equals(pixelsAfter)})`,
    );
    console.log(`     viewBox ${box.viewBox.join("x")}; paths ${JSON.stringify(box.paths)}`);
  } else if (extension === ".png") {
    identical = (await rawPixels(page, before)).equals(await rawPixels(page, after));
    console.log(`${identical ? "same" : "DIFF"} ${file} (decoded pixels)`);
  } else {
    continue;
  }
  if (!identical) failures += 1;
}

await browser.close();
process.exitCode = failures === 0 ? 0 : 1;
