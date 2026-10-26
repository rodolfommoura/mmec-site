# MMEC site: project rules

Institutional website of **Machado Moura e Cardoso Advogados Associados (MMEC)**, a Brasília law firm specialised in broadcasting law (radio and TV). Public domain: `mmec.adv.br`.

This is a rebuild from scratch. The previous site lives in `rodolfommoura/mmec-site-legacy` and **must never be modified**. It is a read-only reference for content only.

## Language

- Site copy: Brazilian Portuguese (pt-BR) only. No English version.
- Everything else is English: code, file and folder names, identifiers, comments, commit messages, PR text, documentation.

## Stack (fixed unless a phase explicitly changes it)

- Astro, static output, TypeScript in strict mode.
- Plain CSS with custom properties (design tokens in `docs/brand.md`). No Tailwind, no UI kit, no component marketplace.
- No React unless a decision record in `docs/decisions/` says otherwise. Client JavaScript is minimal and progressive (the site must be fully readable without it).
- Fonts are self-hosted WOFF2 (OFL). Never call Google Fonts or any third-party font CDN.
- Hosting: Cloudflare Workers static assets, built from this repository. The preview Worker is `mmec-site`. The production Worker `mmec` is **not touched** until Phase 8.
- Use the latest stable versions, pinned by the lockfile. Verify package names and versions on the registry before adding them. Node version is pinned in `.nvmrc`.

## Non-negotiables

1. **Do not invent.** Every factual statement on the site must trace to `docs/content-sources.md` (old site, the PDFs, or text the owner provided). Never add testimonials, client names or logos, case results, awards, statistics, team members, or filler text. Missing content becomes an entry in `docs/open-questions.md`, not made-up copy.
2. **Lawyer advertising rules.** Copy must stay informative and sober, in line with the OAB advertising rules for lawyers (Provimento 205/2021, to be verified in Phase 0): no promise of results, no solicitation, no comparison with other firms, no sensationalism.
3. **Brand.** Follow `docs/brand.md` exactly. Never recolour, stretch, outline or redraw the logo or symbol. Use only the files copied from the firm's brand folder.
4. **Tone.** Sober, precise, institutional. No marketing superlatives, no buzzwords, no emoji.
5. **No generic AI look.** Banned: gradients and glows, glassmorphism, animated counters, marquee tickers, scroll-progress bars, radar or "signal" animations, stock photos (handshakes, scales, gavels), decorative icon grids, dark-mode toggles. See `docs/brand.md` for the allowed visual vocabulary.
6. **Security and privacy by default.** No secrets in the repo. No third-party scripts without a decision record. Strict Content-Security-Policy. LGPD: no tracking before consent, or use a cookieless analytics option (decided in Phase 5).
7. **Accessibility.** WCAG 2.2 AA minimum: semantic HTML, keyboard navigation, visible focus, contrast per the brand table, `prefers-reduced-motion` respected, correct `lang`.
8. **Existing public URLs keep working.** Old paths such as `/cartilha-eleicoes-2026.html` must resolve or 301-redirect (`public/_redirects`).
9. **Email.** The contact address lives in one config file. Until the owner confirms a mailbox on `@mmec.adv.br`, keep the current address. Do not touch DNS or email records in this project.

## Working method

- Work on **one phase at a time**, in order, following `docs/phases/NN-*.md`. Do not start the next phase until the current one is approved (human approval or the runner rule under Git conventions).
- Each phase: create a branch, implement in small commits, run all checks, run the **reviewer** subagent (`.claude/agents/reviewer.md`), fix every blocking finding, open a pull request, and stop.
- Never push to `main`. Never merge your own PR. Never deploy to production.
- When unsure about content, brand or legal wording: stop and add the question to `docs/open-questions.md` instead of guessing.
- Keep a short `docs/CHANGELOG.md`, updated per phase.

## Git conventions

- Trunk-based: `main` is protected and always deployable. Short-lived branches: `feat/…`, `fix/…`, `chore/…`, `docs/…`.
- Conventional Commits (`feat(home): add hero section`), imperative mood, subject ≤ 72 chars, body explains why.
- One logical change per commit. No "wip" commits on a PR. Squash-merge PRs with a clean title.
- Required before merge: CI green and reviewer verdict recorded in the PR description.
- Human approval is required after phases 3, 4, 7 and 8. Phases 2, 5 and 6 are merged by `scripts/run-phases.ps1` when CI is green and the reviewer verdict is APPROVE or APPROVE WITH NOTES; the owner reviews their results at the next human gate.
- Commit the lockfile. Use `npm ci` in CI. Line endings are LF (`.gitattributes`).
- Repository content (texts, brand, documents) belongs to the firm: no open-source licence, `LICENSE` states all rights reserved.

## Commands

Defined in `package.json` during Phase 1 and kept stable:

- `npm run dev`, `npm run build`, `npm run preview`
- `npm run lint`, `npm run typecheck`, `npm run test:a11y`, `npm run test:links`
- `npm run check` runs everything above except dev and preview. It must pass before any PR.

## Where things are

- `docs/brand.md`: colours, type, spacing, logo rules, visual vocabulary.
- `docs/naming.md`: naming of folders, repositories, branches, Workers, URLs, assets and analytics (two lanes: Portuguese for office-facing text, English for technical names).
- `docs/content-sources.md`: where each piece of copy comes from.
- `docs/open-questions.md`: items waiting for the owner.
- `docs/phases/`: one file per phase, with goal, tasks and definition of done.
- `docs/decisions/`: short decision records (ADR style).
