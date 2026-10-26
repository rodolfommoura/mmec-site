// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://mmec.adv.br",
  output: "static",
  // Extensionless URLs without a trailing slash, as on the legacy site (docs/url-map.md).
  trailingSlash: "never",
  build: {
    format: "file",
  },
});
