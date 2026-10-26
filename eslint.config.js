// @ts-check
import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [
      "dist/",
      ".astro/",
      ".wrangler/",
      ".lighthouseci/",
      "playwright-report/",
      "test-results/",
    ],
  },
  js.configs.recommended,
  tseslint.configs.strict,
  astro.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // Lighthouse CI only loads CommonJS config files.
    files: ["**/*.cjs"],
    languageOptions: { sourceType: "commonjs" },
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
);
