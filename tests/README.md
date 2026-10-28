# tests

Playwright tests run against the built site (`npm run build` first, `npm run test:a11y`) in three engines: Chromium, Firefox and WebKit (`playwright.config.ts`). Install the browsers once with `npx playwright install chromium firefox webkit`; `npx playwright test --project=firefox` runs one engine. CI runs all three (`.github/workflows/ci.yml`); only WebKit needs extra system libraries there, installed with `npx playwright install-deps webkit`.

Engine-specific handling, each explained next to the code:

- `support/keyboard.ts`: WebKit follows Safari, where Tab skips links; the Tab walks press Option+Tab there, and are skipped on WebKit builds other than macOS, which cannot reach a link from the keyboard at all.
- `support/site-headers.ts`: WebKit applies `upgrade-insecure-requests` to `localhost`, so the upgraded `https` request is answered from the local server.
- `analytics.spec.ts`: the Host header is dropped before `route.fetch`, because Firefox exposes it and `astro preview` answers 403 to another host.
- `images.spec.ts`: the DevTools Issues test runs on Chromium only.

- `a11y.spec.ts`: axe-core with the WCAG 2.0, 2.1 and 2.2 A/AA rules on every built page and the 404 page; checks `lang="pt-BR"` and that no public page carries a robots meta tag (the production build is indexable).
- `contrast.spec.ts`: every text and UI colour pair in `src/design/contrast.ts` meets WCAG 2.2 AA (4.5:1 text, 3:1 UI), `line` is never text, and the contrast table in `docs/brand.md` matches `src/styles/tokens.css`.
- `header.spec.ts`: mobile menu with and without JavaScript, Escape closes it, logo stays at 300 px, skip link.
- `specimen.spec.ts`: `/_design` is keyboard-complete (every control reachable by Tab with a visible focus ring) and `noindex`. Skipped when the build has no specimen.
- `console.spec.ts`: no console errors on any built page, served with the production Content-Security-Policy from `dist/_headers` (`support/site-headers.ts`), so a CSP violation fails the test; an injected inline script is refused with a `script-src` violation event.
- `home.spec.ts`: home page anchors, metadata, overflow and third-party requests (only the hosts approved in `docs/decisions/0003-analytics.md`, and only with a site token).
- `seo.spec.ts`: unique titles and descriptions, canonical URLs and Twitter cards on every public page; the sitemap lists exactly the public pages with `lastmod`; `robots.txt`; `security.txt`; the home JSON-LD holds only verified facts.
- `analytics.spec.ts`: with a site token, a local server and the build served as a preview host (`*.workers.dev`) load no beacon, make no request to `cloudflareinsights.com` and log no console error; served as `mmec.adv.br` and `www.mmec.adv.br` under the production policy, it loads the beacon with the token.
- `images.spec.ts`: every `<img loading="lazy">` on a built page has positive integer `width` and `height` attributes, Chromium raises no lazy image issue (DevTools Issues, read through the protocol; Chromium only) and every rendered image keeps the ratio of its attributes.
- `keyboard.spec.ts`: Tab walk of every page and the 404 at 1280 and 375 px; the skip link is the first stop and every stop shows a solid focus ring, also in forced colours.
- `display-modes.spec.ts`: no horizontal scrolling on any page at 320 px (400 % zoom) and 640 px (200 % zoom), nor with WCAG 1.4.12 text spacing; reduced motion stops every transition and smooth scrolling; forced colours show the ink logo files (on cream under a dark theme); print shows no button and no e-mail address twice.
- `publications.spec.ts`: each publication shows the real size and page count of its PDF, the legacy PDFs are served byte for byte, the index loads the first cover with priority and the others lazily, the legal notice and type and year label are present, print hides the buttons and shows the PDF address; legal pages show their update date; the 404 page answers `404` and links home, to the publications and to the contact address.

`npm run check` builds with the specimen (`npm run build:specimen`) before the tests, so the specimen is validated, link-checked and tested with axe.
