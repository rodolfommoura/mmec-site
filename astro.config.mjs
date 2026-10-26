// @ts-check
import { defineConfig, fontProviders } from "astro/config";

// Latin subset, as published by Fontsource for the `latin` files.
const latinRange = /** @type {[string, ...string[]]} */ ([
  "U+0000-00FF",
  "U+0131",
  "U+0152-0153",
  "U+02BB-02BC",
  "U+02C6",
  "U+02DA",
  "U+02DC",
  "U+0304",
  "U+0308",
  "U+0329",
  "U+2000-206F",
  "U+20AC",
  "U+2122",
  "U+2191",
  "U+2193",
  "U+2212",
  "U+2215",
  "U+FEFF",
  "U+FFFD",
]);

/** Self-hosted variable WOFF2 from the installed @fontsource-variable packages (OFL). */
const fontFile = (/** @type {string} */ family, /** @type {string} */ style) =>
  `@fontsource-variable/${family}/files/${family}-latin-wght-${style}.woff2`;

export default defineConfig({
  site: "https://mmec.adv.br",
  output: "static",
  // Extensionless URLs without a trailing slash, as on the legacy site (docs/url-map.md).
  trailingSlash: "never",
  build: {
    format: "file",
  },
  // The last fallback is a generic family, so Astro generates metric-adjusted fallback faces
  // (Times New Roman for serif, Arial for sans-serif) to avoid layout shift while fonts load.
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Cormorant Garamond",
      cssVariable: "--font-cormorant-garamond-face",
      fallbacks: ["Garamond", "Georgia", "serif"],
      display: "swap",
      unicodeRange: latinRange,
      options: {
        variants: [
          { src: [fontFile("cormorant-garamond", "normal")], weight: "300 700", style: "normal" },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Newsreader",
      cssVariable: "--font-newsreader-face",
      fallbacks: ["Georgia", "serif"],
      display: "swap",
      unicodeRange: latinRange,
      options: {
        variants: [
          { src: [fontFile("newsreader", "normal")], weight: "200 800", style: "normal" },
          { src: [fontFile("newsreader", "italic")], weight: "200 800", style: "italic" },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Public Sans",
      cssVariable: "--font-public-sans-face",
      fallbacks: ["Arial", "sans-serif"],
      display: "swap",
      unicodeRange: latinRange,
      options: {
        variants: [
          { src: [fontFile("public-sans", "normal")], weight: "100 900", style: "normal" },
        ],
      },
    },
  ],
});
