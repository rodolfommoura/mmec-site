# tests

Playwright tests run against the built site (`npm run build` first, `npm run test:a11y`).

- `a11y.spec.ts`: axe-core with the WCAG 2.0, 2.1 and 2.2 A/AA rules on every built page and the 404 page; checks `lang="pt-BR"` and `noindex`.
