// Lighthouse CI with the desktop preset; same pages and budgets as lighthouserc.cjs.
const base = require("./lighthouserc.cjs");

module.exports = {
  ci: {
    ...base.ci,
    collect: {
      ...base.ci.collect,
      settings: { ...base.ci.collect.settings, preset: "desktop" },
    },
    upload: { ...base.ci.upload, outputDir: "lighthouse-report/desktop" },
  },
};
