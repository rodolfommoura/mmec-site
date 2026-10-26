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

### Changed

- TypeScript stays on 6.x (Dependabot ignores majors) until typescript-eslint and `@astrojs/check` support 7.
- Reviewer subagent runs on a different model (Sonnet) from the builder.
- Removed a redundant `Write` deny rule for the legacy repository from `.claude/settings.json` (the `Edit` rule covers it).

Current phase: Phase 1, foundation (in review).
