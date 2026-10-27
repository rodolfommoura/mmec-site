# Launch checklist

Steps for the cutover to `mmec.adv.br` (Phase 8, `docs/phases/08-cutover.md`), collected during the earlier phases and completed in the Phase 7 staging review (`docs/staging-review.md`). Tick them in the Phase 8 pull request. **Owner** marks a step only the owner can do (logins, dashboards, DNS, documents).

Order: section 1 before the Phase 8 session starts; sections 2 to 4 in the Phase 8 session, each production step only after the owner's explicit "go"; section 5 in the first week.

## 1. Before the cutover (sign-off)

- [ ] **Owner:** written go decision for Phase 8 in the comments of the Phase 7 pull request, after the content sign-off.
- [ ] **Owner:** lawyer review of `/privacidade` and `/termos` done and its changes merged (Q-26, Q-28). The compliance table in `docs/staging-review.md`, section 3, lists the rows marked "lawyer".
- [ ] Privacy text date: after the lawyer's changes, set "Última atualização" on `/privacidade` and `/termos` to the date the approved text is published, and the matching entries in `src/config/page-dates.ts` (sitemap `lastmod`). Update the date of any other page whose text changes after the review.
- [ ] **Owner:** compare "OAB/DF 0100104RS" in the footer with the registration certificate (Q-17).
- [ ] **Owner:** screen-reader smoke test and Safari (iPhone) and Firefox check on the preview, results in `docs/audit-06.md`, section 9 (Q-32, Q-33).
- [ ] Contact details still correct: e-mail `contato@mouraeribeiro.adv.br` (single source `src/config/site.ts`; it changes only when the owner confirms a mailbox on `@mmec.adv.br`, Q-03), phones `(61) 3703-5558` and `(61) 3879-5003` (WhatsApp), address `SHIS QI 05, Bloco F, Sala 332, Lago Sul, Brasília/DF, CEP 71.615-560`. The same e-mail is the `Contact` of `/.well-known/security.txt` (expires 2027-10-27).
- [ ] Re-check Provimento 205/2021 on the OAB site (Q-20; last checked 2026-10-27).
- [ ] **Owner:** confirm that no e-mail signature or external page hotlinks the removed legacy files `/assets/images/brand/*.png` or `/assets/icons/*.png` (`docs/url-map.md`). If one does, keep that file at its path.

## 2. Backups of the legacy site

- [ ] Confirm that `3402fce` is the commit the Worker `mmec` serves (its current version and build in the Cloudflare dashboard, noted in the next step's record) before tagging it.
- [ ] Tag the deployed legacy commit: `legacy-final` on `3402fce` in `rodolfommoura/mmec-site-legacy` (the repository is otherwise never modified). Commands, run from the legacy clone: `git tag -a legacy-final 3402fce -m "Legacy site as deployed before the cutover"` and `git push origin legacy-final`.
- [ ] Archive copy: `git bundle create mmec-site-legacy-final.bundle --all` in the legacy clone, plus the GitHub source zip of the tag; **owner** stores both in the firm's Drive.
- [ ] Note the current Worker version of `mmec` and the custom-domain configuration (read-only), in `docs/deploy.md`.
- [ ] **Owner:** export the Google Analytics 4 and Search Console history (Q-09) and the Cloudflare Web Analytics history since 2026-06-23.
- [ ] Do not archive the legacy GitHub repository or delete the Worker `mmec` for at least 30 days after the cutover (rollback path).

## 3. Production build

### Indexing (`noindex` removal plan)

Today the preview is kept out of search engines twice: `X-Robots-Tag: noindex, nofollow` in `public/_headers` (every response) and `<meta name="robots" content="noindex, nofollow">` from `site.indexable = false` in `src/config/site.ts`. `robots.txt` allows crawling on purpose, so crawlers can see the `noindex`.

- [ ] Highest-risk step: a production build that keeps `noindex` would remove the site from search results, and a preview without it would be indexed. Verify both outcomes before the switch, on a production build and on a branch preview.
- [ ] Replace the constant with an environment flag so production is indexable and branch previews stay `noindex`: for example `indexable` true only when the build runs for `main` (Workers Builds sets `WORKERS_CI_BRANCH`). Decide in Phase 8 how the header follows the same flag (the `_headers` file has no host or branch condition: either generate it at build time, as the CSP already is, or drop the header and rely on the meta tag plus the canonical URL).
- [ ] Update the tests that expect `noindex` (`scripts/check-headers.mjs`, `tests/seo.spec.ts`) and re-enable the Lighthouse `is-crawlable` audit (`docs/security.md`).
- [ ] Confirm on the production build: no `noindex` in the HTML or headers, `robots.txt` points to `https://mmec.adv.br/sitemap.xml`, the sitemap lists the seven pages with `https://mmec.adv.br` URLs.

### Cloudflare Web Analytics

The site uses the existing Web Analytics site for `mmec.adv.br` (token in `src/config/analytics.ts`, decision `0003-analytics`, Q-29).

- [ ] Export the Web Analytics history since 2026-06-23 from the dashboard before changing the site settings, so the data collected for the legacy site is kept.
- [ ] Turn off "automatic setup" (`auto_install`) of that Web Analytics site at the cutover. This site prints the manual snippet itself; a copy injected at the edge would be a second beacon on every page, and the Content-Security-Policy blocks it anyway.
- [ ] Validate the beacon in production. It runs only on `mmec.adv.br` and `www.mmec.adv.br` (`src/components/WebAnalytics.astro`), so the preview cannot show it. After the cutover, open the home page on both hosts with the browser console open: `beacon.min.js` loads, the report to `https://cloudflareinsights.com/cdn-cgi/rum` succeeds with no CORS or CSP error, and the visit appears in the dashboard.

### Response headers

- [ ] Raise `Strict-Transport-Security` `max-age` from `86400` (one day, `public/_headers`) once HTTPS is confirmed working on `mmec.adv.br`. Keep it without `preload` (and without `includeSubDomains`, see `docs/security.md`). Update the header table in `docs/security.md` in the same change.
- [ ] After the switch, `curl -sI https://mmec.adv.br/` shows the CSP (with the two Cloudflare Insights hosts), HSTS, `nosniff`, `X-Frame-Options: DENY`, referrer, permissions and COOP policies, and no `X-Robots-Tag`.

## 4. Switch and verification (Phase 8)

- [ ] Email DNS records (MX, SPF, DKIM, DMARC) are not part of the change and stay as they are (`CLAUDE.md` rule 9).
- [ ] Deploy the production build to the Worker `mmec-site`, then move the custom domain `mmec.adv.br` from `mmec` to `mmec-site`. Rollback: move the domain back to `mmec`.
- [ ] `www` behaviour: today (legacy, checked 2026-10-27) `https://www.mmec.adv.br/` answers `301` to `https://mmec.adv.br/`, and `http://www.mmec.adv.br/` takes two hops (`http://www` to `https://www`, then to the apex). Find where the `www` rule lives (zone redirect rule or the `mmec` Worker) before moving the domain, and confirm after the switch that `www` still answers one `301` to the apex, keeping the path.
- [ ] `http://mmec.adv.br/` answers one `301` to `https://mmec.adv.br/` (it does today on the legacy site).
- [ ] Redirect tests against production: every row of `docs/url-map.md` answers as specified. One-line check per URL: `curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" https://mmec.adv.br/<path>`.
- [ ] HTTPS and certificate valid on the apex and `www`.
- [ ] 404: `https://mmec.adv.br/nao-existe`, `/404` and `/404.html` answer `404` with the not-found page.
- [ ] The three PDFs answer `200` at `/assets/docs/…` and match the files in the repository.
- [ ] Favicon: `/favicon.ico`, `/favicon.svg` and the `apple-touch-icon` load (variant F, `docs/brand.md`).
- [ ] Social previews: `https://mmec.adv.br/og/mmec-og-default.png` answers `200` (it does not exist on the legacy site, so the preview pages cannot show it today); check the home page and one publication with a link-preview tool (for example the LinkedIn Post Inspector or a WhatsApp message to oneself).
- [ ] **Owner:** Google Search Console: verify the Domain property by DNS TXT (Q-30), submit `https://mmec.adv.br/sitemap.xml`, request indexing of the home page.
- [ ] Repeat `npm run test:lighthouse` with `is-crawlable` re-enabled against the production build.
- [ ] Record the result and the rollback instructions in `docs/deploy.md`, and post-launch notes in `docs/CHANGELOG.md`.

## 5. First week

- [ ] Watch Web Analytics visits, Worker errors and Search Console coverage for the old `.html` URLs (they should move to the new URLs through the `301`s).
- [ ] Keep the Worker `mmec` intact for at least 30 days.
