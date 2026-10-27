# Launch checklist

Items to do at the cutover to `mmec.adv.br` (Phase 8, `docs/phases/08-cutover.md`), collected while the earlier phases are built. Tick them in the Phase 8 pull request.

## Phase 8

### Cloudflare Web Analytics

The site uses the existing Web Analytics site for `mmec.adv.br` (token in `src/config/analytics.ts`, decision `0003-analytics`, Q-29).

- [ ] Export the Web Analytics history since 2026-06-23 from the dashboard before changing the site settings, so the data collected for the legacy site is kept.
- [ ] Turn off "automatic setup" (`auto_install`) of that Web Analytics site at the cutover. This site prints the manual snippet itself; a copy injected at the edge would be a second beacon on every page, and the Content-Security-Policy blocks it anyway.
- [ ] Validate the beacon in production. It runs only on `mmec.adv.br` and `www.mmec.adv.br` (`src/components/WebAnalytics.astro`), so the preview cannot show it. After the cutover, open the home page on both hosts with the browser console open: `beacon.min.js` loads, the report to `https://cloudflareinsights.com/cdn-cgi/rum` succeeds with no CORS or CSP error, and the visit appears in the dashboard.

### Response headers

- [ ] Raise `Strict-Transport-Security` `max-age` from `86400` (one day, `public/_headers`) once HTTPS is confirmed working on `mmec.adv.br`. Keep it without `preload` (and without `includeSubDomains`, see `docs/security.md`). Update the header table in `docs/security.md` in the same change.
