# tests

Playwright tests run against the built site (`npm run build` first, `npm run test:a11y`).

- `a11y.spec.ts`: axe-core with the WCAG 2.0, 2.1 and 2.2 A/AA rules on every built page and the 404 page; checks `lang="pt-BR"` and `noindex`.
- `contrast.spec.ts`: every text and UI colour pair in `src/design/contrast.ts` meets WCAG 2.2 AA (4.5:1 text, 3:1 UI), `line` is never text, and the contrast table in `docs/brand.md` matches `src/styles/tokens.css`.
- `header.spec.ts`: mobile menu with and without JavaScript, Escape closes it, logo stays at 300 px, skip link.
- `specimen.spec.ts`: `/_design` is keyboard-complete (every control reachable by Tab with a visible focus ring) and `noindex`. Skipped when the build has no specimen.
- `console.spec.ts`: no console errors on any built page.
- `home.spec.ts`: home page anchors, metadata, overflow and third-party requests.
- `publications.spec.ts`: each publication shows the real size and page count of its PDF, the legacy PDFs are served byte for byte, the legal notice and type and year label are present, print hides the buttons and shows the PDF address; legal pages show their update date; the 404 page answers `404` and links home, to the publications and to the contact address.

`npm run check` builds with the specimen (`npm run build:specimen`) before the tests, so the specimen is validated, link-checked and tested with axe.
