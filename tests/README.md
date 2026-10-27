# tests

Playwright tests run against the built site (`npm run build` first, `npm run test:a11y`).

- `a11y.spec.ts`: axe-core with the WCAG 2.0, 2.1 and 2.2 A/AA rules on every built page and the 404 page; checks `lang="pt-BR"` and `noindex`.
- `contrast.spec.ts`: every text and UI colour pair in `src/design/contrast.ts` meets WCAG 2.2 AA (4.5:1 text, 3:1 UI), `line` is never text, and the contrast table in `docs/brand.md` matches `src/styles/tokens.css`.
- `header.spec.ts`: mobile menu with and without JavaScript, Escape closes it, logo stays at 300 px, skip link.
- `specimen.spec.ts`: `/_design` is keyboard-complete (every control reachable by Tab with a visible focus ring) and `noindex`. Skipped when the build has no specimen.
- `console.spec.ts`: no console errors on any built page, served with the production Content-Security-Policy from `dist/_headers` (`support/site-headers.ts`), so a CSP violation fails the test; an injected inline script is refused.
- `home.spec.ts`: home page anchors, metadata, overflow and third-party requests (only the hosts approved in `docs/decisions/0003-analytics.md`, and only with a site token).
- `seo.spec.ts`: unique titles and descriptions, canonical URLs and Twitter cards on every public page; the sitemap lists exactly the public pages with `lastmod`; `robots.txt`; `security.txt`; the home JSON-LD holds only verified facts.
- `images.spec.ts`: every `<img loading="lazy">` on a built page has positive integer `width` and `height` attributes, Chromium raises no lazy image issue (DevTools Issues, read through the protocol) and every rendered image keeps the ratio of its attributes.
- `publications.spec.ts`: each publication shows the real size and page count of its PDF, the legacy PDFs are served byte for byte, the legal notice and type and year label are present, print hides the buttons and shows the PDF address; legal pages show their update date; the 404 page answers `404` and links home, to the publications and to the contact address.

`npm run check` builds with the specimen (`npm run build:specimen`) before the tests, so the specimen is validated, link-checked and tested with axe.
