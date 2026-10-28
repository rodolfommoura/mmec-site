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
- `workers_dev: true` and `preview_urls: true`: the Worker and its previews are reachable on `*.workers.dev`. No route or custom domain is declared here: `mmec.adv.br` was moved to this Worker through the API at the cutover (2026-10-28), and `wrangler deploy` leaves a custom domain it does not declare in place.
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

- **Bot Fight Mode and JavaScript detections: off.** They are two settings of `bot_management`: `fight_mode` (Bot Fight Mode) and `enable_js` (JavaScript detections, which inject `/cdn-cgi/challenge-platform/scripts/jsd/main.js`). Turning off `fight_mode` alone left the script in place; it went away only with `enable_js: false`, a few minutes after the call. With a CSP the detections work only through nonces, which a static site cannot issue. The site has no forms, logins or API to protect, and the challenges can also catch link-preview bots. The managed WAF rules, DDoS protection and the other `bot_management` settings (`ai_bots_protection: block`, `ai_training: disallow`, managed `robots.txt`) stay as they are. A `PUT` with only the changed fields keeps the others; its response may show other fields with default values, so read the settings again with `GET` to confirm.
- **Web Analytics automatic setup: off**, after the owner exports the history since 2026-06-23. The site prints its own beacon (decision `0003-analytics`).

### Steps

Each step waits for its own "go".

1. Legacy backup: tag `legacy-final` on `3402fce` in `rodolfommoura/mmec-site-legacy` and push the tag (the only change ever made to that repository), then `git bundle create mmec-site-legacy-final.bundle --all`. The owner stores the bundle and the tag's source zip in the firm's Drive.
2. The owner merges the Phase 8 pull request. Workers Builds deploys `main` to `mmec-site`. Check on `https://mmec-site.rodolfo-e70.workers.dev/`: no robots meta tag, `X-Robots-Tag: noindex, nofollow` present.
3. The owner exports the Web Analytics history. Then turn off Bot Fight Mode, its JavaScript detections and the Web Analytics automatic setup (API: `PUT /zones/{zone}/bot_management` with `{ "fight_mode": false, "enable_js": false }`; `PUT /accounts/{account}/rum/site_info/{site_tag}` with `{ "auto_install": false, "zone_tag": "{zone}", "lite": false }`). Check the live HTML for `/cdn-cgi/challenge-platform/` again a few minutes later.
4. Switch: move `mmec.adv.br` from `mmec` to `mmec-site`. Save the domain record first (`GET /accounts/{account}/workers/domains`) for the rollback. The `PUT` without a flag is refused with `409`, error `100116` ("Hostname 'mmec.adv.br' already in use by other custom domain"), because the hostname belongs to another Worker; `override_existing_origin: true` moves it in place (same domain id and certificate, no gap). Never add `override_existing_dns_record`, which would replace a DNS record:

   ```text
   PUT /accounts/{account}/workers/domains
   { "zone_id": "06abd900aaa376b5fb22bce8186041f1", "hostname": "mmec.adv.br", "service": "mmec-site", "environment": "production", "override_existing_origin": true }
   ```

   List the domains again right after it: `service` must be `mmec-site`, `enabled` `true`, `cert_id` unchanged.

5. Verify (next section).

### Verification after the switch

```sh
npm ci && npm run build          # dist/ of the deployed commit (hashed asset name)
npm run test:production          # every docs/url-map.md row, the headers and no robots meta tag on the home page
curl -sI https://mmec.adv.br/    # CSP, HSTS, no X-Robots-Tag
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://www.mmec.adv.br/publicacoes
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://mmec.adv.br/
```

Then by hand: the certificate on the apex and `www`, the three PDFs against the repository files, the favicon and `apple-touch-icon`, `/og/mmec-og-default.png`, a link preview of the home page and one publication, the Web Analytics beacon in the browser console on both hosts, and `npm run test:lighthouse` (`is-crawlable` now enabled). Owner: Search Console (submit the sitemap, request indexing of the home page).

`check-headers.mjs` with a base URL expects no `X-Robots-Tag`, so it fits `https://mmec.adv.br` only. Against a `*.workers.dev` URL every request reports `x-robots-tag: noindex, nofollow` as a failure, which is the expected header there: read the other problems listed, if any, and check the `workers.dev` host rule with the local run (`npm run test:headers`). `check-redirects.mjs` works against either host.

### Result (2026-10-28)

All times UTC. Each production step ran after the owner's "go".

| Step | Result |
|---|---|
| 1. Legacy backup | Annotated tag `legacy-final` (object `b1fca948…`) on `3402fce`, on GitHub (`git ls-remote --tags origin "legacy-final^{}"`). Bundle `mmec-site-legacy-final.bundle` created and verified by the owner, to be stored in the firm's Drive with the tag's source zip. |
| 2. Deploy | PR #12 merged as `74dfe71`; Workers Builds deployed `mmec-site` deployment `11a58848-c602-4fdf-94a0-2512a35d4f7f`, version `c4f0bb15-049d-40cb-9efc-168d8c72589b` (01:57). On `workers.dev`: no robots meta tag, `X-Robots-Tag: noindex, nofollow`, every other header and 41/41 URL-map rows as specified, no `Set-Cookie`. |
| 3. Zone settings | Web Analytics history exported by the owner. `fight_mode: false`, then `enable_js: false` (02:09); the injected script was gone from `https://mmec.adv.br/` at 02:13. `auto_install: false`; the Web Analytics site stays enabled for the zone (ruleset `3819bb72-1115-4d75-be11-c9c26b65731d`). |
| 4. Switch | First `PUT` refused with `409` (no change). With `override_existing_origin: true` (02:16): domain `c08c07d70245115b11f8f93dca887d0d7ca769b7` now `service: mmec-site`, `enabled: true`, same certificate `111661e2-9ad4-474e-8792-fc3b7c5fbcc4`, previews off. |
| 5. Verification | `npm run test:production`: 41/41 URLs and 7/7 header samples. No `X-Robots-Tag`, no robots meta tag, no `Set-Cookie`, no injected or legacy third-party script. `/nao-existe`, `/404` and `/404.html` answer `404`. `https://www` → apex and `http://` → `https://`: one `301` each, path kept; `http://www` two hops, as before. The three PDFs match the repository files byte for byte. `/favicon.ico`, `/favicon.svg`, the `apple-touch-icon` and `/og/mmec-og-default.png` answer `200`. Certificate (Google Trust Services WE1, `mmec.adv.br` and `*.mmec.adv.br`, valid until 2027-01-17) served on the apex and `www`. `robots.txt` and the sitemap (seven `https://mmec.adv.br` URLs) as built. |

The switch happened on 27 October 2026 in Brasília time (23:16), the date of the privacy policy and terms.

Open after the switch: the beacon in the browser console on both hosts, link previews, `npm run test:lighthouse`, Search Console (owner) and the HSTS ramp (`docs/security.md`), tracked in `docs/launch-checklist.md`.

### Rollback

The legacy Worker `mmec` stays deployed and unchanged. To go back, move the domain to it again (seconds; no DNS change). Without the flag the call would be refused with the same `409` as the switch (not tried in this direction):

```text
PUT /accounts/{account}/workers/domains
{ "zone_id": "06abd900aaa376b5fb22bce8186041f1", "hostname": "mmec.adv.br", "service": "mmec", "environment": "production", "override_existing_origin": true }
```

The record before the switch, to compare after a rollback: domain id `c08c07d70245115b11f8f93dca887d0d7ca769b7`, `service: mmec`, `environment: production`, `cert_id: 111661e2-9ad4-474e-8792-fc3b7c5fbcc4`, `previews_enabled: false`, `enabled: true`.

The same in the dashboard: **Workers & Pages**, `mmec`, **Settings**, **Domains & Routes**, **Add**, **Custom domain**, `mmec.adv.br` (confirm moving it from `mmec-site`). Bot Fight Mode, its JavaScript detections (`enable_js`) and the Web Analytics automatic setup should not need to be restored for the legacy site to work (not tested). Keep `mmec` and the legacy repository (not archived) for at least 30 days after the cutover.

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
