import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import {
  colorPairs,
  contrastRatio,
  minimumRatio,
  readBrandColors,
} from "../src/design/contrast.ts";

const colors = readBrandColors(readFileSync("src/styles/tokens.css", "utf8"));

for (const pair of colorPairs) {
  test(`${pair.foreground} on ${pair.background} meets ${minimumRatio[pair.kind]}:1 (${pair.use})`, () => {
    const ratio = contrastRatio(colors[pair.foreground], colors[pair.background]);
    expect(ratio).toBeGreaterThanOrEqual(minimumRatio[pair.kind]);
  });
}

test("line is never a text colour and bronze is never text on a dark background", () => {
  for (const pair of colorPairs) {
    expect(pair.foreground).not.toBe("line");
    if (pair.kind === "text" && pair.foreground === "bronze") {
      expect(["green", "ink"]).not.toContain(pair.background);
    }
  }
});

test("brand.md contrast table matches the tokens", () => {
  const brand = readFileSync("docs/brand.md", "utf8");
  const rows = [...brand.matchAll(/\| `--color-(\w+)` \| `(#[0-9A-F]{6})` \|[^|]*\| ([\d.]+) \|/g)];
  expect(rows.length).toBeGreaterThan(0);
  for (const [, name, hex, documented] of rows) {
    expect(colors[name as keyof typeof colors]).toBe(hex);
    const ratio = contrastRatio(hex ?? "", colors.cream);
    expect(Math.abs(ratio - Number(documented))).toBeLessThanOrEqual(0.1);
  }
});
