# Changelog

All notable changes to this project are documented here. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [Semantic Versioning](https://semver.org/). The legacy site is `v1.x` (repository `mmec-site-legacy`); this rebuild starts at `v2.0.0`.

## [Unreleased]

### Added

- Project rules, brand rules, reviewer agent and phase plan.
- Naming conventions (`docs/naming.md`), aligned with the office Drive guidelines.
- Repository hygiene files: licence, `.gitignore`, `.gitattributes`, `.editorconfig`, CODEOWNERS, PR template, Dependabot, security policy.
- Phase 0 (discovery): content inventory of the legacy site and its three PDFs (`docs/content-sources.md`), legacy URL map (`docs/url-map.md`), open questions for the owner with proposed defaults and the OAB rules relied on (`docs/open-questions.md`), decision records `0001-stack` and `0002-site-structure`.
- Owner answers to all 20 open questions recorded in `docs/open-questions.md` (analytics direction: Cloudflare Web Analytics plus Google Search Console, decided formally in Phase 5).
- Phase 1 (foundation): Astro 7 static project in TypeScript strict mode, Node 24 LTS pinned in `.nvmrc`; ESLint, Prettier, `astro check`, html-validate, a linkinator link check and axe-core accessibility tests through Playwright, wired to `npm run check`; Lighthouse CI budgets; CI workflow (job `ci`) using only GitHub-owned actions pinned by SHA; `wrangler.jsonc` for the preview Worker `mmec-site`; placeholder home and 404 pages with `noindex`; brand files and the approved favicon copied from the brand folder; `docs/deploy.md`.
- Phase 2 (design foundations): design tokens (`src/styles/tokens.css`) with a single heading-case switch (mixed case by default); base and print layers; self-hosted Latin variable fonts through the Astro Fonts API with metric-adjusted fallbacks (ADR `0004-self-hosted-fonts`); components: header with progressive mobile menu, footer, button, text link, section, prose, publication card, contact block, skip link, breadcrumb, logo; internal specimen at `/_design`, excluded from production builds; contrast, keyboard, mobile menu and console tests; a lint rule against colour, font and spacing literals outside the tokens; C2PA metadata stripped from the brand files with the artwork verified identical; open questions Q-21 to Q-25.
- Phase 3 (home page): opening statement, office, the six practice areas as a plain list, publications with their real covers, and the contact block with both phone numbers (WhatsApp link on `(61) 3879-5003` only) and the postcode; every legacy anchor kept; symbol as a single watermark; plain Google Maps link, no iframe; canonical URL and an Open Graph image rendered at build time from the brand logo (`sharp`); site description in the owner's wording; rewritten sentences recorded in `docs/content-sources.md`; home tests for third-party requests, overflow from 320 to 1440 px, anchors and metadata.
- Phase 4 (publications, legal pages and 404): publications as a typed content collection (`src/content/publications/`, one Markdown file plus one PDF per edition), an index at `/publicacoes` and one page per publication with type and year, edition, PDF size and page count read from or checked against the file, cover, open and download buttons and the legal notice; the three legacy PDFs and covers served unchanged at their legacy paths; `public/_redirects` with every legacy URL of `docs/url-map.md`, tested through Wrangler's local runtime (`scripts/check-redirects.mjs`, part of `npm run test:links`); privacy policy and terms rewritten for the site as it works after Phase 5, dated 26 October 2026, pending the lawyer review (Q-26); a not-found page with links to Home and Publications and the contact address, answering `404` also at `/404` and `/404.html`; print styles for publication pages; Lighthouse CI now audits four pages; open questions Q-26 to Q-28.

### Changed

- TypeScript stays on 6.x (Dependabot ignores majors) until typescript-eslint and `@astrojs/check` support 7.
- Reviewer subagent runs on a different model (Sonnet) from the builder.
- Removed a redundant `Write` deny rule for the legacy repository from `.claude/settings.json` (the `Edit` rule covers it).
- Phase 3 gate requests: the logo wordmark renders at a legible size (cause of the "grainy" logo: the vector SVG was drawn too small, not a raster), with the 300 px minimum now measured on the visible artwork (Q-23) and 400 px of artwork in the header and footer from 64rem; the Maps link opens the renamed Google Business Profile listing (pin `-15.8463737, -47.8944906`; Q-03 resolved); the contact heading reads "Contato"; neutral wording replaces four self-descriptive practice-area phrases; the mobile header keeps the "Menu" button on a second row because it does not fit beside the logo at 360 px (Q-24); before and after screenshots were reviewed at the gate and not kept in the repository.

### Known issues

- The calendar PDF (`/assets/docs/calendario-voz-do-brasil-2026.pdf`) and its cover show an outdated letterhead: an old address (SHIS QI 21 Conjunto 07 Casa 17), an old phone layout and a fragment of the former firm name. Served unchanged at the same URL by owner decision (Q-12); a new export replaces the file at the same path.

Current phase: Phase 4, publications, legal pages and 404 (in review).
