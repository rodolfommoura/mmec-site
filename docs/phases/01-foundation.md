# Phase 1: Repository foundation and tooling

**Goal:** a clean, professional repository that builds an empty branded placeholder, runs CI, and deploys to the preview Worker `mmec-site`. Nothing visual yet.

## Prompt

```
Read CLAUDE.md and docs/phases/01-foundation.md. Execute Phase 1 on branch chore/foundation.
Stop when the pull request is open. Do not deploy to the production Worker and do not touch the domain.
```

## Tasks

1. Scaffold Astro (static output, TypeScript strict) in the repository root. Verify the current stable versions first; keep the dependency list as small as possible.
2. Repository hygiene: the seed already provides `.gitignore`, `.gitattributes`, `.editorconfig`, `LICENSE`, `CODEOWNERS`, PR template, `dependabot.yml`, `SECURITY.md` and `CONTRIBUTING.md`. Review them against the real project (for example add Astro and Playwright paths to `.gitignore` if missing) and add `.nvmrc` pinned to the current Node LTS (verify it). Do not recreate what exists.
3. Quality tooling: ESLint, Prettier, `astro check`, an accessibility check (axe through Playwright against the built site), a link checker, and an HTML validator. Wire them to the scripts named in CLAUDE.md, including `npm run check`.
4. CI in `.github/workflows/ci.yml`: install with `npm ci`, run `npm run check`, build, upload the Lighthouse CI report with budgets (performance ≥ 95, accessibility = 100, best practices = 100, SEO = 100). Use least-privilege `permissions:` and pin third-party actions to a commit SHA (Dependabot for npm and Actions is already configured). Name the job `ci`: it becomes the required status check in the `main` ruleset.
5. Cloudflare: `wrangler.jsonc` with name `mmec-site`, `assets.directory` pointing at the Astro `dist`, `not_found_handling: "404-page"`. Connect the repository to a new Worker `mmec-site` through the Cloudflare dashboard (Workers Builds) and document the steps in `docs/deploy.md`. If a step needs the owner (login, approvals), write the exact steps and stop; do not work around it.
6. A placeholder home page with `lang="pt-BR"`, an `h1` with the firm name, and `robots` set to `noindex` on the preview. Keep `noindex` until Phase 8.
7. Copy the brand files listed in `docs/brand.md` into `public/brand/` (ask the owner to supply them if they are not in the repo).
8. Document the setup in `docs/CHANGELOG.md` and `docs/deploy.md`.

## Definition of done

- `npm ci && npm run check && npm run build` passes locally and in CI.
- Preview URL of `mmec-site` serves the placeholder with `noindex`.
- Commit history is clean Conventional Commits.
- Reviewer verdict recorded.

## Human gate

Check the PR, then on GitHub enable branch protection on `main` requiring the CI check. Open the preview URL once.
