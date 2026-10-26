# Deploy

The site is static HTML built by Astro into `dist/` and served by Cloudflare Workers static assets. There is no server code.

| Worker | Source repository | Role | Touched by |
|---|---|---|---|
| `mmec-site` | `rodolfommoura/mmec-site` (this one) | preview of the rebuild | Phases 1 to 7 |
| `mmec` | `rodolfommoura/mmec-site-legacy` | production at `mmec.adv.br` | **only Phase 8** |

State on 2026-10-26: the Cloudflare account has only the Worker `mmec`. `mmec-site` does not exist yet and is created by the owner with the steps below.

## Configuration in the repository

`wrangler.jsonc`:

- `name: "mmec-site"`: must match the Worker name in the dashboard, or Workers Builds fails.
- `assets.directory: "./dist"`: the Astro build output.
- `assets.html_handling: "auto-trailing-slash"`: same as the legacy Worker. With Astro's `build.format: "file"`, `/privacidade` serves `privacidade.html`, and `/privacidade.html` or `/privacidade/` redirect to `/privacidade`.
- `assets.not_found_handling: "404-page"`: unknown paths answer `404` with `dist/404.html`.
- `workers_dev: true` and `preview_urls: true`: the preview is reachable on `*.workers.dev`; no custom domain or route is configured.
- `previews: {}`: an empty Worker Previews block. Workers Builds runs `wrangler preview` on non-production branches, and that command fails when the block is missing.

`public/_headers` sends `X-Robots-Tag: noindex, nofollow` on every response, and every page carries `<meta name="robots" content="noindex, nofollow">` (`src/config/site.ts`, `indexable: false`). Both stay until Phase 8.

## One-time setup: connect the repository (owner)

Needs the owner's Cloudflare login and a GitHub app approval, so it is not automated.

1. Open the Cloudflare dashboard, **Workers & Pages**, **Create**, **Import a repository** (Workers Builds).
2. If asked, install or extend the **Cloudflare Workers and Pages** GitHub app. Grant access to **only** `rodolfommoura/mmec-site` (add it to the existing selection that already contains `mmec-site-legacy`; do not remove that one).
3. Select `rodolfommoura/mmec-site`.
4. Project settings:
   - Project (Worker) name: `mmec-site`
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Non-production branch deploy command: `npx wrangler versions upload`
   - Root directory: `/` (leave empty)
   - Production branch: `main`
   - Builds for non-production branches: **enabled** (each PR gets a preview URL)
5. Build variables: none. Workers Builds reads `.nvmrc` for the Node version; if the build log shows another version, add the variable `NODE_VERSION` = `24.22.1`.
6. Save and deploy. Do **not** add a custom domain or a route. Do **not** open or change the Worker `mmec`.
7. Afterwards check:
   - the build log shows `npm ci` (lockfile) and `Uploaded mmec-site`;
   - `https://mmec-site.<account-subdomain>.workers.dev/` shows the placeholder;
   - `curl -sI https://mmec-site.<account-subdomain>.workers.dev/ | grep -i x-robots-tag` prints `noindex, nofollow`;
   - an unknown path, for example `/nao-existe`, answers `404`;
   - the Worker `mmec` still lists `mmec-site-legacy` as its repository and its last build is unchanged.
8. Optional: in the GitHub repository, the Workers Builds check appears on pull requests. It is informational; the required check is `ci` (see below).

To confirm in Phase 4 on the preview: `_redirects` rules run before `html_handling`, so `/privacidade.html` gives a single `301` (see `docs/url-map.md`).

## Local commands

```sh
nvm use            # Node from .nvmrc
npm ci
npx playwright install chromium   # once, for test:a11y and test:lighthouse
npm run check      # lint, typecheck, build, HTML validation, links, axe
npm run test:lighthouse
npm run preview    # serve dist/ on http://localhost:4321
```

`npx wrangler dev` serves `dist/` with the Workers asset rules (redirects, headers, 404) if a local check of the platform behaviour is needed. Never run `wrangler deploy` by hand; deployments go through Workers Builds.

## Known dev-only audit findings

`npm audit` reports vulnerabilities only in development tooling; `npm audit --omit=dev` reports none, and nothing from them reaches `dist/` or the Worker.

- `@lhci/cli` 0.15.1 (last published 2025-06-25) pulls in old `tmp`, `extract-zip`, `proxy-agent`, `uuid`, `inquirer` and `zod`. It only audits `localhost`.
- `wrangler` pulls in `undici` through `miniflare`, used only by `wrangler dev`.
- Do not run `npm audit fix --force`: it downgrades both packages to very old majors.
- Phase 5 (supply chain) re-checks these and replaces `@lhci/cli` if it is still unmaintained.

## CI

`.github/workflows/ci.yml`, job `ci` (the required status check on `main`, job timeout: 20 minutes):

1. `npm ci`
2. `npx playwright install --with-deps chromium` (step timeout: 10 minutes)
3. `npm run check`
4. `npm run test:lighthouse` (budgets: performance ≥ 0.95, accessibility, best practices and SEO = 1; the `is-crawlable` audit is skipped while the preview is `noindex`, re-enable it in Phase 8)
5. Upload the Lighthouse report as the artifact `lighthouse-report` (and the Playwright report on failure).

Only GitHub-owned actions are used (`actions/checkout`, `actions/setup-node`, `actions/upload-artifact`), pinned by commit SHA. The token is read-only (`contents: read`).
