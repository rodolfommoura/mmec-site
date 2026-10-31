# Launch checklist

Steps for the cutover to `mmec.adv.br` (Phase 8, `docs/phases/08-cutover.md`), collected during the earlier phases and completed in the Phase 7 staging review (`docs/staging-review.md`). Tick them in the Phase 8 pull request. **Owner** marks a step only the owner can do (logins, dashboards, DNS, documents).

Order: section 1 before the Phase 8 session starts; sections 2 to 4 in the Phase 8 session, each production step only after the owner's explicit "go"; section 5 in the first week.

## 1. Before the cutover (sign-off)

- [x] **Owner:** written go decision for Phase 8 in the comments of the Phase 7 pull request, after the content sign-off.
- [x] **Owner:** lawyer review of `/privacidade` and `/termos` done and its changes merged (Q-26, Q-28). The compliance table in `docs/staging-review.md`, section 3, lists the rows marked "lawyer". Done 2026-10-27, approved with no text change (comment on PR #10).
- [x] Privacy text date: after the lawyer's changes, set "Última atualização" on `/privacidade` and `/termos` to the date the approved text is published, and the matching entries in `src/config/page-dates.ts` (sitemap `lastmod`). Update the date of any other page whose text changes after the review. Done in the Phase 8 pull request: 27 October 2026, the planned publication date; change it again if the switch moves to another day.
- [x] **Owner:** compare "OAB/DF 0100104RS" in the footer with the registration certificate (Q-17). Done 2026-10-27 (comment on PR #10).
- [x] **Owner:** screen-reader smoke test and Safari (iPhone) and Firefox check on the preview, results in `docs/audit-06.md`, section 9 (Q-32, Q-33). Owner decision 2026-10-27: not done before launch, accepted as known gaps; moved to "Post-launch".
- [x] Contact details still correct: e-mail `contato@mouraeribeiro.adv.br` (single source `src/config/site.ts`; it changes only when the owner confirms a mailbox on `@mmec.adv.br`, Q-03; owner decision 2026-10-27: launch with this provisional address, switch after launch), phones `(61) 3703-5558` and `(61) 3879-5003` (WhatsApp), address `SHIS QI 05, Bloco F, Sala 332, Lago Sul, Brasília/DF, CEP 71.615-560`. The same e-mail is the `Contact` of `/.well-known/security.txt` (expires 2027-10-27).
- [x] Re-check Provimento 205/2021 on the OAB site (Q-20; last checked 2026-10-27).
- [ ] **Owner:** confirm that no e-mail signature or external page hotlinks the removed legacy files `/assets/images/brand/*.png` or `/assets/icons/*.png` (`docs/url-map.md`). If one does, keep that file at its path.

## 2. Backups of the legacy site

- [x] Confirm that `3402fce` is the commit the Worker `mmec` serves (its current version and build in the Cloudflare dashboard, noted in the next step's record) before tagging it. Done 2026-10-27: version `4f83c91f…` uploaded one minute after `3402fce`, served files identical (`docs/deploy.md`).
- [x] Tag the deployed legacy commit: `legacy-final` on `3402fce` in `rodolfommoura/mmec-site-legacy` (the repository is otherwise never modified). Commands, run from the legacy clone: `git tag -a legacy-final 3402fce -m "Legacy site as deployed before the cutover"` and `git push origin legacy-final`. Done by the owner, confirmed on GitHub 2026-10-28: annotated tag object `b1fca948…`, peeled to `3402fce` on GitHub.
- [x] Archive copy: `git bundle create mmec-site-legacy-final.bundle --all` in the legacy clone. Bundle created and verified by the owner (confirmed 2026-10-28).
- [ ] **Owner:** store the bundle and the GitHub source zip of the tag `legacy-final` in the firm's Drive.
- [x] Note the current Worker version of `mmec` and the custom-domain configuration (read-only), in `docs/deploy.md`.
- [x] **Owner:** export the Google Analytics 4 and Search Console history (Q-09) and the Cloudflare Web Analytics history since 2026-06-23. Done 2026-10-27 by the owner's assistant: Search Console (Excel, 16 months), GA4 pages and traffic acquisition (CSV), Clarity (CSV and PDF), Web Analytics (CSV from the API). The files are in the owner's Downloads folder, to be moved to the Drive.
- [ ] Do not archive the legacy GitHub repository or delete the Worker `mmec` for at least 30 days after the cutover (rollback path).

## 3. Production build

### Indexing (`noindex` removal plan)

Today the preview is kept out of search engines twice: `X-Robots-Tag: noindex, nofollow` in `public/_headers` (every response) and `<meta name="robots" content="noindex, nofollow">` from `site.indexable = false` in `src/config/site.ts`. `robots.txt` allows crawling on purpose, so crawlers can see the `noindex`.

- [x] Highest-risk step: a production build that keeps `noindex` would remove the site from search results, and a preview without it would be indexed. Verify both outcomes before the switch, on a production build and on a branch preview. Done locally: `WORKERS_CI_BRANCH=main` and no branch give no robots meta tag, any other branch gives `noindex, nofollow`; the `workers.dev` header is checked by `npm run test:headers`.
- [x] Replace the constant with an environment flag so production is indexable and branch previews stay `noindex`: for example `indexable` true only when the build runs for `main` (Workers Builds sets `WORKERS_CI_BRANCH`). Decide in Phase 8 how the header follows the same flag (the `_headers` file has no host or branch condition: either generate it at build time, as the CSP already is, or drop the header and rely on the meta tag plus the canonical URL). Decided: the header follows the host (`https://:worker.:account.workers.dev/*` in `public/_headers`), the meta tag follows the build (`src/config/indexing.ts`).
- [x] Update the tests that expect `noindex` (`scripts/check-headers.mjs`, `tests/seo.spec.ts`) and re-enable the Lighthouse `is-crawlable` audit (`docs/security.md`).
- [x] Confirm on the production build: no `noindex` in the HTML or headers, `robots.txt` points to `https://mmec.adv.br/sitemap.xml`, the sitemap lists the seven pages with `https://mmec.adv.br` URLs.

### Zone settings

- [x] Turn off Bot Fight Mode and its JavaScript detections at the cutover. The detections inject an inline script into every HTML page, which the CSP blocks (console error on every page) and which sets a `cf_clearance` cookie the privacy policy does not mention. They are a separate setting (`enable_js`): `fight_mode: false` alone left the script in place (`docs/deploy.md`). Done 2026-10-28: both `false`, script gone from the live HTML.

### Cloudflare Web Analytics

The site uses the existing Web Analytics site for `mmec.adv.br` (token in `src/config/analytics.ts`, decision `0003-analytics`, Q-29).

- [x] Export the Web Analytics history since 2026-06-23 from the dashboard before changing the site settings, so the data collected for the legacy site is kept. Done by the owner 2026-10-27.
- [x] Turn off "automatic setup" (`auto_install`) of that Web Analytics site at the cutover. This site prints the manual snippet itself; a copy injected at the edge would be a second beacon on every page, and the Content-Security-Policy blocks it anyway. Done 2026-10-28.
- [x] Validate the beacon in production. It runs only on `mmec.adv.br` and `www.mmec.adv.br` (`src/components/WebAnalytics.astro`), so the preview cannot show it. After the cutover, open the home page on both hosts with the browser console open: `beacon.min.js` loads, the report to `https://cloudflareinsights.com/cdn-cgi/rum` succeeds with no CORS or CSP error, and the visit appears in the dashboard. Done after the switch by the owner's assistant in a real browser on `mmec.adv.br`: console clean, beacon reporting. The check on `www` is moot: `www` answers `301` to the apex before any page loads.

### Response headers

- [x] Raise `Strict-Transport-Security` `max-age` from `86400` (one day, `public/_headers`) to `2592000` (30 days, 2026-10-31); the one-year step remains. Condition: once HTTPS is confirmed working on `mmec.adv.br`. Keep it without `preload` (and without `includeSubDomains`, see `docs/security.md`). Update the header table in `docs/security.md` in the same change.
- [x] After the switch, `curl -sI https://mmec.adv.br/` shows the CSP (with the two Cloudflare Insights hosts), HSTS, `nosniff`, `X-Frame-Options: DENY`, referrer, permissions and COOP policies, and no `X-Robots-Tag`. Done 2026-10-28.

## 4. Switch and verification (Phase 8)

- [x] Email DNS records (MX, SPF, DKIM, DMARC) are not part of the change and stay as they are (`CLAUDE.md` rule 9). Read on 2026-10-27: null MX, `v=spf1 -all`, DMARC `p=reject`, no DKIM record; the cutover changes no DNS record.
- [x] Deploy the production build to the Worker `mmec-site`, then move the custom domain `mmec.adv.br` from `mmec` to `mmec-site`. Rollback: move the domain back to `mmec`. Done 2026-10-28: version `c4f0bb15…`, domain moved with `override_existing_origin: true` (`docs/deploy.md`, "Result").
- [x] `www` behaviour: today (legacy, checked 2026-10-27) `https://www.mmec.adv.br/` answers `301` to `https://mmec.adv.br/`, and `http://www.mmec.adv.br/` takes two hops (`http://www` to `https://www`, then to the apex). Find where the `www` rule lives (zone redirect rule or the `mmec` Worker) before moving the domain, and confirm after the switch that `www` still answers one `301` to the apex, keeping the path. Done: zone redirect rule, untouched; after the switch `https://www` answers one `301` to the apex with the path.
- [x] `http://mmec.adv.br/` answers one `301` to `https://mmec.adv.br/` (it does today on the legacy site). Done 2026-10-28.
- [x] Redirect tests against production: every row of `docs/url-map.md` answers as specified. One-line check per URL: `curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://mmec.adv.br/<path>`. Done 2026-10-28: `npm run test:production`, 41/41.
- [x] HTTPS and certificate valid on the apex and `www`. Done 2026-10-28: Google Trust Services, valid until 2027-01-17.
- [x] 404: `https://mmec.adv.br/nao-existe`, `/404` and `/404.html` answer `404` with the not-found page. Done 2026-10-28.
- [x] The three PDFs answer `200` at `/assets/docs/…` and match the files in the repository. Done 2026-10-28: byte-identical.
- [x] Favicon: `/favicon.ico`, `/favicon.svg` and the `apple-touch-icon` load (variant F, `docs/brand.md`). Done 2026-10-28.
- [ ] Social previews: `https://mmec.adv.br/og/mmec-og-default.png` answers `200` (it does not exist on the legacy site, so the preview pages cannot show it today); check the home page and one publication with a link-preview tool (for example the LinkedIn Post Inspector or a WhatsApp message to oneself). Image `200` on 2026-10-28; the link-preview check is still open.
- [ ] **Owner:** Google Search Console: verify the Domain property by DNS TXT (Q-30), submit `https://mmec.adv.br/sitemap.xml`, request indexing of the home page. The Domain property exists and is verified (owner, 2026-10-28); sitemap and indexing request still open.
- [ ] Repeat `npm run test:lighthouse` with `is-crawlable` re-enabled against the production build.
- [x] Record the result and the rollback instructions in `docs/deploy.md`, and post-launch notes in `docs/CHANGELOG.md`. Done: `docs/deploy.md`, "Result (2026-10-28)".

## 5. First week

- [ ] Watch Web Analytics visits, Worker errors and Search Console coverage for the old `.html` URLs (they should move to the new URLs through the `301`s).
- [ ] Keep the Worker `mmec` intact for at least 30 days.

## Post-launch

Owner decisions of 2026-10-27: these items do not block the cutover and are done after launch.

- [ ] C-17: the PDFs keep the wording "atuação especializada" for the launch (p. 28 of P1, p. 7 of P2; `docs/staging-review.md`, section 3). Revisit after launch; new PDF exports would fix it (Q-06).
- [ ] Q-03: the site launches with the provisional contact e-mail `contato@mouraeribeiro.adv.br`. **Owner:** confirm a mailbox on `@mmec.adv.br`, then change the single source `src/config/site.ts` (also the `Contact` of `/.well-known/security.txt`). No DNS or e-mail record change in this project (`CLAUDE.md` rule 9).
- [ ] Known gap, Q-32: screen-reader smoke test (NVDA or VoiceOver), steps in `docs/staging-review.md`, section 5; results in `docs/audit-06.md`, section 9.
- [ ] Known gap, Q-33: every page in real Firefox on the owner's computer; results in `docs/audit-06.md`, section 9.
- [ ] Known gap, Q-33: every page in real Safari on an iPhone; results in `docs/audit-06.md`, section 9.

Automated coverage before launch: the Playwright suite (axe, keyboard, display modes, console and CSP) on Chromium, Firefox and WebKit (`docs/audit-06.md`, section 8).
