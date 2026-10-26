// Lighthouse CI: budgets from docs/phases/01-foundation.md, run against `astro preview`.
const { chromium } = require("@playwright/test");

const port = 4323;

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npx astro preview --port ${port}`,
      startServerReadyPattern: "localhost",
      url: [`http://localhost:${port}/`],
      numberOfRuns: 3,
      chromePath: chromium.executablePath(),
      settings: {
        chromeFlags: "--headless=new --no-sandbox",
        // The preview is noindex on purpose until Phase 8, which this audit would penalise.
        // Re-enable it in Phase 8 when noindex is removed.
        skipAudits: ["is-crawlable"],
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.95 }],
        "categories:accessibility": ["error", { minScore: 1 }],
        "categories:best-practices": ["error", { minScore: 1 }],
        "categories:seo": ["error", { minScore: 1 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: "lighthouse-report",
    },
  },
};
