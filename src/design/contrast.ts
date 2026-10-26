// WCAG 2.2 contrast for the brand colours. Shared by the design specimen and tests/contrast.spec.ts.

export type ColorName = "ink" | "cream" | "green" | "bronze" | "stone" | "line";

export interface ColorPair {
  foreground: ColorName;
  background: ColorName;
  /** Where the pair is used, in English for the test report. */
  use: string;
  /** "text" needs 4.5:1; "ui" (focus rings, control borders) needs 3:1. */
  kind: "text" | "ui";
}

export const colorNames: readonly ColorName[] = [
  "ink",
  "cream",
  "green",
  "bronze",
  "stone",
  "line",
];

/** Every foreground/background pair the stylesheets use. Keep in sync when a pair is added. */
export const colorPairs: readonly ColorPair[] = [
  { foreground: "ink", background: "cream", use: "body text, headings, form text", kind: "text" },
  {
    foreground: "green",
    background: "cream",
    use: "section titles, button text on bands",
    kind: "text",
  },
  { foreground: "bronze", background: "cream", use: "links", kind: "text" },
  {
    foreground: "stone",
    background: "cream",
    use: "secondary text, eyebrows, captions",
    kind: "text",
  },
  {
    foreground: "cream",
    background: "green",
    use: "text on green bands, primary button",
    kind: "text",
  },
  {
    foreground: "cream",
    background: "ink",
    use: "button hover, menu button when open",
    kind: "text",
  },
  { foreground: "ink", background: "cream", use: "secondary button text and border", kind: "ui" },
  { foreground: "green", background: "cream", use: "focus ring on cream", kind: "ui" },
  { foreground: "cream", background: "green", use: "focus ring on green bands", kind: "ui" },
  { foreground: "stone", background: "cream", use: "form control borders", kind: "ui" },
];

export const minimumRatio = { text: 4.5, ui: 3 } as const;

/** Reads the six `--color-*` hex values from tokens.css, the single source of truth. */
export function readBrandColors(tokensCss: string): Record<ColorName, string> {
  const entries = colorNames.map((name) => {
    const match = tokensCss.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`));
    if (!match?.[1]) throw new Error(`--color-${name} is missing from tokens.css`);
    return [name, match[1].toUpperCase()] as const;
  });
  return Object.fromEntries(entries) as Record<ColorName, string>;
}

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const [r = 0, g = 0, b = 0] = channels.map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const [light, dark] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  ) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

/** Rounded down, so a displayed 4.5 is never a rounded-up 4.49. */
export function formatRatio(ratio: number): string {
  return (Math.floor(ratio * 10) / 10).toFixed(1).replace(".", ",");
}
