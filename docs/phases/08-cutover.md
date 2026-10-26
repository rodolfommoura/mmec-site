# Phase 8: Cutover to mmec.adv.br

**Goal:** serve the new site on the real domain, with an immediate rollback path. This is the only phase that touches production, and only with the owner present.

## Prompt

```
Read CLAUDE.md and docs/launch-checklist.md. Execute Phase 8 from docs/phases/08-cutover.md.
Prepare everything, then stop and wait for my explicit "go" before each production-changing step. Work with read-only Cloudflare API calls until I say go.
```

## Tasks

1. Before changing anything: tag the old repository state (`rodolfommoura/mmec-site-legacy`, tag `legacy-final`) and note the current Worker version of `mmec` and the current custom-domain configuration.
2. Confirm that email DNS records (MX, SPF, DKIM, DMARC) are **not** part of this change and stay as they are.
3. Remove `noindex` from the production build only (environment flag), confirm `robots.txt` and the sitemap point to `https://mmec.adv.br`.
4. Plan the switch (default, safest): deploy the production build to the Worker `mmec-site`, then move the custom domain `mmec.adv.br` from the Worker `mmec` to `mmec-site`. Rollback is moving the custom domain back to `mmec` (the old site remains deployed and untouched).
5. `www`: ensure `www.mmec.adv.br` redirects (301) to `https://mmec.adv.br` (custom domain or redirect rule). Verify after the switch.
6. After the switch: run the redirect tests against production, check headers, HTTPS, certificate, sitemap, 404, the three PDFs, social previews, and Google Search Console (owner action: verify property, submit sitemap, ask for reindexing of the home page).
7. Record the result and the rollback instructions in `docs/deploy.md`. Keep the old Worker `mmec` for at least 30 days before deleting anything.

## Definition of done

- Production serves the new site; redirects and headers verified.
- Rollback tested on paper and the old Worker is intact.
- Post-launch notes recorded in `docs/CHANGELOG.md`.

## Human gate

Explicit go before each production step. Explicit approval at the end. Keep an eye on traffic and errors for the first week.
