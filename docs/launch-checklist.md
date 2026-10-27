# Launch checklist

Items to do at the cutover to `mmec.adv.br` (Phase 8, `docs/phases/08-cutover.md`), collected while the earlier phases are built. Tick them in the Phase 8 pull request.

## Phase 8

### Cloudflare Web Analytics

The site uses the existing Web Analytics site for `mmec.adv.br` (token in `src/config/analytics.ts`, decision `0003-analytics`, Q-29).

- [ ] Export the Web Analytics history since 2026-06-23 from the dashboard before changing the site settings, so the data collected for the legacy site is kept.
- [ ] Exclude the preview hosts from the numbers: the preview Worker (`mmec-site`, `workers.dev`) sends beacons with the same token, so from 2026-10-26 the dashboard mixes preview and review visits with real ones. Filter by host `mmec.adv.br` when reading or exporting, and mention it in the history export.
- [ ] Turn off "automatic setup" (`auto_install`) of that Web Analytics site at the cutover. This site prints the manual snippet itself; a copy injected at the edge would be a second beacon on every page, and the Content-Security-Policy blocks it anyway.

### Response headers

- [ ] Raise `Strict-Transport-Security` `max-age` from `86400` (one day, `public/_headers`) once HTTPS is confirmed working on `mmec.adv.br`. Keep it without `preload` (and without `includeSubDomains`, see `docs/security.md`). Update the header table in `docs/security.md` in the same change.
