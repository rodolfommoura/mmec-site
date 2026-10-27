# Phase 6 audit: accessibility and performance

Audit of the built site (`npm run build`, served by `astro preview`) on 2026-10-27, branch `fix/a11y-performance`, following `docs/phases/06-accessibility-performance.md`. Pages: `/`, `/publicacoes`, the three publication pages, `/privacidade`, `/termos` and the not-found page.

Sections 1 to 3 record the state before the fixes; section 6 the state after them. Every blocking finding is fixed. Automated checks found no accessibility violation; the findings come from the manual checks and Lighthouse diagnostics.

## 1. Automated audits (before fixes)

The Lighthouse rows below already use the setup this phase introduced (every page, both presets), run on the code before the fixes.

| Check                                                   | Command                        | Result                                    |
| ------------------------------------------------------- | ------------------------------ | ----------------------------------------- |
| axe-core, WCAG 2.0/2.1/2.2 A and AA, every page and 404 | `npm run test:a11y`            | 0 violations                              |
| HTML validation (html-validate, recommended rules)      | `npm run test:html`            | 0 errors                                  |
| Internal links and legacy redirects                     | `npm run test:links`           | pass                                      |
| Security headers                                        | `npm run test:headers`         | pass                                      |
| Lighthouse, mobile preset, every page except 404        | `npm run test:lighthouse`      | all pass (table below)                    |
| Lighthouse, desktop preset, every page except 404       | `npm run test:lighthouse`      | all pass (table below)                    |

Lighthouse CI audited only four pages before this phase; it now audits every built page (`scripts/pages.mjs`) with both presets. Medians of three runs:

| Page                                               | Mobile P / A / BP / SEO | Mobile LCP | Desktop P / A / BP / SEO | Desktop LCP | CLS | TBT  |
| -------------------------------------------------- | ----------------------- | ---------- | ------------------------ | ----------- | --- | ---- |
| `/`                                                | 98 / 100 / 100 / 100    | 2.26 s     | 100 / 100 / 100 / 100    | 0.52 s      | 0   | 0 ms |
| `/publicacoes`                                     | 98 / 100 / 100 / 100    | 2.19 s     | 100 / 100 / 100 / 100    | 0.49 s      | 0   | 0 ms |
| `/publicacoes/calendario-voz-do-brasil-2026`       | 99 / 100 / 100 / 100    | 2.18 s     | 100 / 100 / 100 / 100    | 0.47 s      | 0   | 0 ms |
| `/publicacoes/cartilha-eleicoes-2026`              | 99 / 100 / 100 / 100    | 2.11 s     | 100 / 100 / 100 / 100    | 0.47 s      | 0   | 0 ms |
| `/publicacoes/cartilha-propaganda-partidaria-2026` | 99 / 100 / 100 / 100    | 2.11 s     | 100 / 100 / 100 / 100    | 0.47 s      | 0   | 0 ms |
| `/privacidade`                                     | 99 / 100 / 100 / 100    | 1.96 s     | 100 / 100 / 100 / 100    | 0.45 s      | 0   | 0 ms |
| `/termos`                                          | 99 / 100 / 100 / 100    | 2.03 s     | 100 / 100 / 100 / 100    | 0.45 s      | 0   | 0 ms |

Exceptions: the internal design specimen `/_design`, present in `dist/` after `npm run check` but never published, is left out. The not-found page is not audited by Lighthouse. It answers `404` on purpose, which the SEO category scores as a failure (`http-status-code`). It is covered by axe, html-validate and the Playwright tests instead.

Mobile is Lighthouse's simulated slow 4G on a mid-range phone, so the mobile LCP is a lab figure, not a field one. INP has no lab value; the lab proxy (TBT) is 0 ms on every page and the only scripts are the menu toggle (0.7 KB) and the analytics loader (0.7 KB).

## 2. Manual audit log (before fixes)

Driven with Playwright (Chromium 156) and checked on screenshots, since this run has no human at the keyboard.

| Check                         | How                                                                                                                 | Finding                                                                                                                                                                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keyboard-only walkthrough     | Tab through every page at 1280 and 375 px until focus leaves the document                                           | Every link and button is reached in reading order (10 to 23 stops per page); no trap; no focusable element is hidden.                                                                                                                                                         |
| Visible focus                 | Computed outline on every focus stop, normal and forced colours                                                     | Every stop had a 3 px solid outline: green on cream, cream on the green footer, a system colour in forced colours (read from the computed styles during the audit). Each focused element was in the viewport once the smooth scroll settled (checked by hand on the home page). The tests keep a weaker guarantee: a solid outline of at least 2 px on every stop, and in forced colours on the home page only.                                                                                                 |
| Skip link                     | First Tab, Enter                                                                                                    | First focus stop, visible, moves focus to `main` (also covered by `tests/header.spec.ts`).                                                                                                                                                                                       |
| Mobile menu                   | 375 px: open, Tab, Escape; without JavaScript                                                                       | Escape closes and returns focus to "Menu". The menu is a non-modal disclosure that pushes the page down, not an overlay, so it has no focus trap by design (a trap would be wrong for this pattern, WAI-ARIA APG "Disclosure"). Without JavaScript every link shows.               |
| 200 % zoom                    | 1280 px window at 200 % = 640 CSS px viewport                                                                       | No horizontal scroll, no clipped text, on every page.                                                                                                                                                                                                                            |
| 400 % zoom and 320 px reflow  | 320 CSS px viewport (1280 px at 400 %), also 320 x 256                                                              | No horizontal scroll on any page. The header logo box reaches past the viewport only by transparent artboard margin, clipped by `.logo-frame` (documented in `Logo.astro`).                                                                                                      |
| Text spacing (WCAG 1.4.12)    | Line height 1.5, letter 0.12 em, word 0.16 em, paragraph 2 em, at 320 and 1280 px                                   | No overflow and no clipped text on any page.                                                                                                                                                                                                                                     |
| Reduced motion                | `prefers-reduced-motion: reduce`                                                                                    | No transition with a duration, no animation, `scroll-behavior: auto`.                                                                                                                                                                                                            |
| Forced colours                | `forced-colors: active` (Chromium emulation, light system theme), screenshots                                       | **F-01 (blocking).** The footer logo is the cream file on the green band. Forced colours replace the band with the system background, so the logo disappears (white on white). The header ink logo would disappear the same way under a dark high-contrast theme.                |
| Print preview                 | `media: print`, home and publication pages                                                                          | **F-02.** The contact buttons print their full URL inside the button box ("Abrir no Google Maps" prints a 200-character Maps URL); the home buttons print as empty-looking boxes. **F-03.** Every `mailto:` link already shows the address as its text, so print repeats it.     |
| Target size (WCAG 2.5.8)      | Bounding boxes of every focus stop; axe `target-size`                                                               | Pass. Standalone text links ("Acessar a cartilha", "Abrir no WhatsApp", "Voltar à página inicial") are 16 to 18 px tall but meet the spacing exception (no other target within 24 px). See N-02.                                                                                |
| Screen reader                 | NVDA                                                                                                                | **Not done.** NVDA is not installed on this machine and installing software is outside an unattended run. Accessible names, landmarks and heading order are covered by axe. See N-04.                                                                                            |

## 3. Performance (before fixes)

| Page           | Requests | Transfer (preview server) | Fonts                                                    |
| -------------- | -------- | ------------------------- | -------------------------------------------------------- |
| `/`            | 13       | 218 KB                    | 4 files, 188 KB (Newsreader upright and italic, Cormorant, Public Sans) |
| `/publicacoes` | 16       | 195 KB                    | 3 files, 123 KB                                          |
| publication    | 14       | 176 to 183 KB             | 3 files, 123 KB                                          |
| legal pages    | 10 to 11 | 151 to 167 KB             | 3 files, 123 KB                                          |

- Images: covers are served as AVIF (WebP fallback) at 480 and 960 px with `sizes`, 6 to 12 KB each; logos and symbol are SVG. Every image has `width` and `height`; CLS is 0 everywhere.
- Fonts: self-hosted WOFF2, Latin subset, `font-display: swap`, metric-adjusted fallbacks, two preloads (ADR 0004). Fonts are the largest share of every page; the Newsreader italic (64 KB) is loaded on the home page only, for the practice-area summaries.
- CSS: 4 to 5 small external files per page (6 to 8 KB in total). Lighthouse lists them as render-blocking (about 300 ms on simulated mobile). They stay external on purpose: inlining would need a per-page CSP hash for every style block (`astro.config.mjs`). Unused CSS and unused JavaScript audits pass.
- JavaScript: two external scripts of 0.7 KB each. No framework runtime.
- **F-04.** `/publicacoes` (mobile): the first cover is the LCP element and is `loading="lazy"`, without `fetchpriority`. Lighthouse estimates 350 ms of LCP savings.
- **N-01.** `/` (desktop, from 48rem): the LCP element is the decorative watermark symbol, which is lazy. It is hidden below 48rem; lazy keeps phones from downloading it.

## 4. Browser matrix

Run after the fixes. The browser-run suites are `a11y`, `keyboard`, `display-modes`, `header`, `console` and `publications` (100 tests per browser, 200 in total, run with a temporary Playwright configuration that is not kept).

| Browser | Version | How | Result |
| --- | --- | --- | --- |
| Chromium (Playwright build) | 156.0.8078.4 | `npm run check`, Lighthouse | pass |
| Google Chrome (installed) | 155.0.8059.86 | Playwright `channel: "chrome"`, suites above | pass |
| Microsoft Edge (installed) | 156.0.4314.42 | Playwright `channel: "msedge"`, suites above | pass |
| Firefox (installed) | 156.0 | Headless screenshots were planned; the run's permission policy refused to drive the installed Firefox | **not tested** (Q-33) |
| Safari, macOS and iOS | n/a | No Apple device in this run | **not tested** (Q-33) |

The Playwright Firefox and WebKit builds are not installed; downloading them was left out of an unattended run (no software is installed without the owner's approval).

## 5. Findings and decisions

| ID   | Finding                                                             | Severity     | Action                                                                                      |
| ---- | ------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------- |
| F-01 | Logos invisible in forced-colours mode                              | Blocking     | Fix                                                                                         |
| F-02 | Buttons print their URL and an empty-looking box                    | Blocking (print is a firm use case, `print.css`) | Fix                                                   |
| F-03 | `mailto:` addresses printed twice                                   | Minor        | Fix                                                                                         |
| F-04 | LCP cover lazy-loaded on `/publicacoes`                             | Minor        | Fix                                                                                         |
| N-01 | Decorative watermark is the desktop LCP on the home page and lazy   | Non-blocking | Keep (desktop LCP 0.52 s, score 100; eager would cost phones a download they never show)    |
| N-02 | Standalone text links below 44 px tall                              | Non-blocking | Keep (AA met; 44 px is AAA 2.5.5)                                                           |
| N-03 | Render-blocking CSS files                                           | Non-blocking | Keep (CSP without `'unsafe-inline'` or per-page hashes)                                     |
| N-04 | No screen-reader test                                               | Needs owner  | `docs/open-questions.md` Q-32                                                               |
| N-05 | Safari (macOS and iOS) and Firefox not tested | Needs owner | `docs/open-questions.md` Q-33 |
| N-06 | Internal design specimen `/_design` scrolls sideways at 320 px | Non-blocking | Keep (never published; left out of the display tests) |
| N-07 | Lighthouse CI keeps `@lhci/cli` 0.15.1 (Q-31) | Non-blocking | Keep: the dev-only audit findings affect tooling that audits `localhost` only |

## 6. Results after fixes

| ID | Fix | Test |
| --- | --- | --- |
| F-01 | In forced colours the ink logo file replaces the cream one (as in print, `base.css`); under a dark system theme the logo frame keeps the cream background within the clear space (`Logo.astro`). The artwork is unchanged. | `display-modes.spec.ts`, "forced colours" |
| F-02 | The home and contact button groups are `no-print`; the e-mail, telephone and address above them still print. | `display-modes.spec.ts`, "print", every page |
| F-03 | Print no longer appends the address after `mailto:` links; the test checks that every such link shows the address as its text. | same |
| F-04 | `PublicationCard` takes a `priority` prop (eager, `fetchpriority="high"`); `/publicacoes` sets it on the first card only. | `publications.spec.ts`, "the index loads the first cover with priority" |

New tests keep the manual checks that a browser can measure: `tests/keyboard.spec.ts` (Tab walk and focus ring on every page at two widths, and in forced colours) and `tests/display-modes.spec.ts` (reflow at 320 and 640 px, WCAG text spacing, reduced motion, forced colours, print). The new tests were checked to fail on the code before the fixes.

Final runs: `npm run check` passes (165 Playwright tests, 0 axe violations, 0 html-validate errors; links, redirects and headers pass). `npm run test:lighthouse` passes every budget; representative runs:

| Page | Mobile P / A / BP / SEO | Mobile LCP | Desktop P / A / BP / SEO | Desktop LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 98 / 100 / 100 / 100 | 2.26 s | 100 / 100 / 100 / 100 | 0.51 s | 0 | 0 ms |
| `/publicacoes` | 99 / 100 / 100 / 100 | 2.19 s | 100 / 100 / 100 / 100 | 0.49 s | 0 | 0 ms |
| `/publicacoes/calendario-voz-do-brasil-2026` | 99 / 100 / 100 / 100 | 2.18 s | 100 / 100 / 100 / 100 | 0.47 s | 0 | 0 ms |
| `/publicacoes/cartilha-eleicoes-2026` | 99 / 100 / 100 / 100 | 2.11 s | 100 / 100 / 100 / 100 | 0.47 s | 0 | 0 ms |
| `/publicacoes/cartilha-propaganda-partidaria-2026` | 99 / 100 / 100 / 100 | 2.11 s | 100 / 100 / 100 / 100 | 0.47 s | 0 | 0 ms |
| `/privacidade` | 99 / 100 / 100 / 100 | 1.96 s | 100 / 100 / 100 / 100 | 0.45 s | 0 | 0 ms |
| `/termos` | 99 / 100 / 100 / 100 | 2.03 s | 100 / 100 / 100 / 100 | 0.45 s | 0 | 0 ms |

On `/publicacoes` the "LCP image was lazily loaded" audit now passes. The simulated mobile LCP barely moves, because in the lab it is bound by the fonts and the CSS, not by the cover request.

## 7. Remaining items

- Screen-reader smoke test with NVDA (Windows) or VoiceOver (iOS, macOS): Q-32.
- Firefox and Safari check: Q-33. The Phase 7 gate on the owner's phone and computer covers part of it.
- Non-blocking items N-01, N-02, N-03, N-06 and N-07 above: kept; no owner decision needed unless the owner wants 44 px targets everywhere (N-02).
- Repeat `npm run test:lighthouse` with `is-crawlable` re-enabled at the cutover (Phase 8, `docs/security.md`).
