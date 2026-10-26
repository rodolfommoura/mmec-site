# MMEC site

Institutional website of **Machado Moura e Cardoso Advogados Associados**, a Brasília law firm specialised in broadcasting law. Public domain: [mmec.adv.br](https://mmec.adv.br).

This repository is a ground-up rebuild. The previous site lives in `rodolfommoura/mmec-site-legacy` (frozen, production source until the cutover).

## Status

Pre-development. The work is organised in phases (see [`docs/process.md`](docs/process.md) and [`docs/phases/`](docs/phases/)). Current phase is recorded in [`docs/CHANGELOG.md`](docs/CHANGELOG.md).

## Principles

- Brazilian Portuguese copy only; everything else (code, docs, commits) in English.
- Only verified content: nothing is invented (see [`CLAUDE.md`](CLAUDE.md)).
- Brand rules from the firm's brand manual: [`docs/brand.md`](docs/brand.md).
- Static site, minimal JavaScript, security headers, WCAG 2.2 AA, LGPD-aware.

## Repository layout

```text
.claude/        agent settings and the reviewer subagent
.github/        CODEOWNERS, PR template, Dependabot
docs/           brand, phases, decisions, content sources, open questions
CLAUDE.md       project rules for the coding agent
CONTRIBUTING.md how to propose changes
SECURITY.md     how to report a vulnerability
```

Application code (Astro project, `src/`, `public/`, `wrangler.jsonc`) is added in Phase 1.

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md). Short version: branch from `main`, Conventional Commits, one pull request per change, squash merge after CI and review.

## Licence

All rights reserved. Texts, brand, publications and documents belong to Machado Moura e Cardoso Advogados Associados. See [`LICENSE`](LICENSE).
