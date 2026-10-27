# Deploy

The site is static HTML built by Astro into `dist/` and served by Cloudflare Workers static assets. There is no server code.

| Worker | Source repository | Role | Touched by |
|---|---|---|---|
| `mmec-site` | `rodolfommoura/mmec-site` (this one) | the rebuild; production at `mmec.adv.br` from the Phase 8 cutover | Phases 1 to 8 |
| `mmec` | `rodolfommoura/mmec-site-legacy` | legacy site; production until the cutover, then the rollback target | **only Phase 8** |

The Worker `mmec-site` was created on 2026-10-26 with the steps under "One-time setup". The cutover, the recorded state before it and the rollback are under "Production cutover (Phase 8)".

## Configuration in the repository

`wrangler.jsonc`:

- `name: "mmec-site"`: must match the Worker name in the dashboard, or Workers Builds fails.
- `assets.directory: "./dist"`: the Astro build output.
- `assets.html_handling: "auto-trailing-slash"`: same as the legacy Worker. With Astro's `build.format: "file"`, `/privacidade` serves `privacidade.html`, and `/privacidade.html` or `/privacidade/` redirect to `/privacidade`.
- `assets.not_found_handling: "404-page"`: unknown paths answer `404` with `dist/404.html`.
- `workers_dev: true` and `preview_urls: true`: the Worker and its previews are reachable on `*.workers.dev`. No route or custom domain is declared here: `mmec.adv.br` is attached through the API at the cutover, and `wrangler deploy` leaves a custom domain it does not declare in place.
- `previews: {}`: an empty Worker Previews block. Workers Builds runs `wrangler preview` on non-production branches, and that command fails when the block is missing.

Search engine indexing (since Phase 8):

- `public/_headers` sends `X-Robots-Tag: noindex, nofollow` on every `*.workers.dev` host (rule `https://:worker.:account.workers.dev/*`): the production Worker URL, previews and deployment URLs. `mmec.adv.br` gets no `X-Robots-Tag`.
- The robots meta tag follows the build (`src/config/indexing.ts`): Workers Builds builds of a branch other than `main` (`WORKERS_CI_BRANCH`) print `<meta name="robots" content="noindex, nofollow">` on every page; builds of `main`, local builds and GitHub CI builds print none. The design specimen is always `noindex`.
- `npm run test:headers` checks both kinds of host; `scripts/check-production-build.mjs` checks the built pages and the branch rule.

## Design specimen (`/_design`)

The internal specimen page is injected by `src/integrations/design-specimen.mjs` only when:

- running `npm run dev`;
- `DESIGN_SPECIMEN=true` (`npm run build:specimen`, used by `npm run check`);
- Workers Builds builds a branch other than `main` (the default build variable `WORKERS_CI_BRANCH`), so pull request previews show it.

A plain `npm run build`, and every Workers Builds build of `main`, has no `/_design`. No Cloudflare setting is needed. The page is always `noindex` and is never listed in the sitemap (`src/pages/sitemap.xml.ts`).

## One-time setup: connect the repository (owner)

Needs the owner's Cloudflare login and a GitHub app approval, so it is not automated.

1. Open the Cloudflare dashboard, **Workers & Pages**, **Create**, **Import a repository** (Workers Builds).
2. If asked, install or extend the **Cloudflare Workers and Pages** GitHub app. Grant access to **only** `rodolfommoura/mmec-site` (add it to the existing selection that already contains `mmec-site-legacy`; do not remove that one).
3. Select `rodolfommoura/mmec-site`.
4. Project settings:
   - Project (Worker) name: `mmec-site`
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Non-production branch deploy command: `npx wrangler preview`
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

`_redirects` rules run before `html_handling`, so `/privacidade.html` gives a single `301` (see `docs/url-map.md`). Confirmed in Phase 4 with Wrangler's local runtime (`npm run test:links`); check once on the preview URL with `curl -sI https://<preview-url>/privacidade.html`, which must print `301` and `location: /privacidade`.

## Production cutover (Phase 8)

Every step that changes production runs only after the owner's explicit "go" in the Phase 8 session (`docs/phases/08-cutover.md`).

### State before the cutover (read-only, 2026-10-27)

Read through the Cloudflare API and `curl`; nothing was changed.

| Item | State |
|---|---|
| Zone `mmec.adv.br` | id `06abd900aaa376b5fb22bce8186041f1`, Free plan, active. SSL mode Full, Always Use HTTPS on, minimum TLS 1.2, zone HSTS setting off (the site sends its own header). |
| Certificates | Advanced certificate pack (Google Trust Services) for `mmec.adv.br` and `*.mmec.adv.br`, active, expires 2027-01-17 and renews automatically; the universal pack is active as well. |
| Custom domain | `mmec.adv.br` → Worker `mmec`, environment `production`, domain id `c08c07d70245115b11f8f93dca887d0d7ca769b7`, cert id `111661e2-9ad4-474e-8792-fc3b7c5fbcc4`, previews off. The only Worker domain in the account. |
| Routes and page rules | None. |
| `www` | Proxied `CNAME www → mmec.adv.br` plus the zone redirect rule "Redirect from WWW to root" (ruleset `33bf4341648b4f9ab08215ee63bbe8c3`, rule `62864ba839384822a4f207631f31bed1`): `https://www.mmec.adv.br/*` → `https://mmec.adv.br/${1}`, `301`, query string kept. It runs before any Worker, so the cutover does not touch it. `http://www` first gets the Always Use HTTPS redirect (two hops, as today). |
| Worker `mmec` | Active deployment `a14ead00-80ab-489b-bcad-4cf988215ab2` (2026-10-26 03:51 UTC, `wrangler`), version `4f83c91f-ec66-4ffc-adda-45dcca63f3f2` (number 49), compatibility date 2026-06-23, assets from `public/`, `not_found_handling: 404-page`. |
| Legacy commit | `3402fce` (2026-10-26 00:51 −03, one minute before that upload). The served files match it: CSS, JS, `robots.txt` and `sitemap.xml` byte for byte; the HTML pages and the 404 differ only by the script Cloudflare injects at the edge (next row). |
| Bot Fight Mode | On, with JavaScript detections: Cloudflare injects an inline `<script>` before `</body>` of every HTML page. The new site's CSP (no `'unsafe-inline'`, no nonce) blocks it, which gives a console error on every page in production. See "Zone settings changed at the cutover". |
| Web Analytics | Site tag `266011a149574f99a2183c877e4f69e2` for `mmec.adv.br`, automatic setup (`auto_install`) **on**. |
| Worker `mmec-site` | Active deployment `fa7e5cc7-3e28-4bbb-9493-9ef8ef4a6724`, version `41482da3-4ea0-485c-a729-cef2593269c7` (2026-10-27 17:18 UTC, build of `main` after PR #10). `workers.dev` and previews on. |
| E-mail DNS | `MX .` (null MX), `TXT v=spf1 -all`, `_dmarc TXT v=DMARC1; p=reject;`: the domain declares that it sends and receives no mail. Not part of the cutover (`CLAUDE.md` rule 9). There is also a `google-site-verification` TXT record on the apex (Search Console, Q-30). |

### Zone settings changed at the cutover

- **Bot Fight Mode: off.** On the Free plan its JavaScript detections cannot be turned off separately, and with a CSP they work only through nonces, which a static site cannot issue. The site has no forms, logins or API to protect, and the challenges can also catch link-preview bots. The managed WAF rules, DDoS protection and the "block AI bots" setting stay as they are.
- **Web Analytics automatic setup: off**, after the owner exports the history since 2026-06-23. The site prints its own beacon (decision `0003-analytics`).

### Steps

Each step waits for its own "go".

1. Legacy backup: tag `legacy-final` on `3402fce` in `rodolfommoura/mmec-site-legacy` and push the tag (the only change ever made to that repository), then `git bundle create mmec-site-legacy-final.bundle --all`. The owner stores the bundle and the tag's source zip in the firm's Drive.
2. The owner merges the Phase 8 pull request. Workers Builds deploys `main` to `mmec-site`. Check on `https://mmec-site.rodolfo-e70.workers.dev/`: no robots meta tag, `X-Robots-Tag: noindex, nofollow` present.
3. The owner exports the Web Analytics history. Then turn off Bot Fight Mode and the Web Analytics automatic setup (API: `PUT /zones/{zone}/bot_management` with `fight_mode: false`; `PUT /accounts/{account}/rum/site_info/{site}` with `auto_install: false`).
4. Switch: attach `mmec.adv.br` to `mmec-site`. One call, which replaces the service of the existing domain in place:

   ```text
   PUT /accounts/{account}/workers/domains
   { "zone_id": "06abd900aaa376b5fb22bce8186041f1", "hostname": "mmec.adv.br", "service": "mmec-site" }
   ```

5. Verify (next section).

### Verification after the switch

```sh
npm ci && npm run build          # dist/ of the deployed commit (hashed asset name)
npm run test:production          # every docs/url-map.md row and the headers, against https://mmec.adv.br
curl -sI https://mmec.adv.br/    # CSP, HSTS, no X-Robots-Tag
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://www.mmec.adv.br/publicacoes
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://mmec.adv.br/
```

Then by hand: the certificate on the apex and `www`, the three PDFs against the repository files, the favicon and `apple-touch-icon`, `/og/mmec-og-default.png`, a link preview of the home page and one publication, the Web Analytics beacon in the browser console on both hosts, and `npm run test:lighthouse` (`is-crawlable` now enabled). Owner: Search Console (submit the sitemap, request indexing of the home page).

### Rollback

The legacy Worker `mmec` stays deployed and unchanged. To go back, attach the domain to it again (seconds; no DNS change):

```text
PUT /accounts/{account}/workers/domains
{ "zone_id": "06abd900aaa376b5fb22bce8186041f1", "hostname": "mmec.adv.br", "service": "mmec" }
```

The same in the dashboard: **Workers & Pages**, `mmec`, **Settings**, **Domains & Routes**, **Add**, **Custom domain**, `mmec.adv.br` (confirm moving it from `mmec-site`). Bot Fight Mode and the Web Analytics automatic setup do not need to be restored for the legacy site to work. Keep `mmec` and the legacy repository (not archived) for at least 30 days after the cutover.

## Local commands

```sh
nvm use            # Node from .nvmrc
npm ci
npx playwright install chromium   # once, for test:a11y and test:lighthouse
npm run check      # lint, typecheck, build, HTML validation, links, headers, axe
npm run test:lighthouse
npm run preview    # serve dist/ on http://localhost:4321
npm run test:production   # redirects and headers of https://mmec.adv.br (needs a build of the deployed commit)
```

`npx wrangler dev` serves `dist/` with the Workers asset rules (redirects, headers, 404) if a local check of the platform behaviour is needed. Never run `wrangler deploy` by hand; deployments go through Workers Builds.

## Known dev-only audit findings

`npm audit` reports vulnerabilities only in development tooling; `npm audit --omit=dev` reports none, and nothing from them reaches `dist/` or the Worker.

- `@lhci/cli` 0.15.1 (last published 2025-06-25) pulls in old `tmp`, `extract-zip`, `proxy-agent`, `uuid`, `inquirer` and `zod`. It only audits `localhost`.
- `wrangler` pulls in `undici` through `miniflare`, used only by `wrangler dev`.
- Do not run `npm audit fix --force`: it downgrades both packages to very old majors.
- Phase 5 re-checked these (`docs/security.md`, "Supply chain"): `wrangler` 4.153.0 fixes its finding; replacing `@lhci/cli` moved to Phase 6 (Q-31).

## CI

`.github/workflows/ci.yml`, job `ci` (the required status check on `main`, job timeout: 20 minutes):

1. `npm ci`
2. `npx playwright install chromium` (step timeout: 10 minutes), with `~/.cache/ms-playwright` cached by `actions/cache`, keyed on the runner OS and the `package-lock.json` hash. `--with-deps` is not used: its apt step downloads font packages from a slow mirror and exceeded 10 minutes.
3. `npm run check`
4. `npm run test:lighthouse` (every built page except the 404, mobile then desktop preset; budgets: performance ≥ 0.95, accessibility, best practices and SEO = 1, including the `is-crawlable` audit since Phase 8)
5. Upload the Lighthouse report as the artifact `lighthouse-report` (and the Playwright report on failure).

Only GitHub-owned actions are used (`actions/checkout`, `actions/setup-node`, `actions/cache`, `actions/upload-artifact`), pinned by commit SHA. The token is read-only (`contents: read`).
