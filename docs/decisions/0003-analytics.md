# 0003. Analytics

- Status: accepted (by the owner, Phase 5 instructions, 2026-10-26)
- Date: 2026-10-26
- Deciders: Rodolfo Moura

## Context

The legacy site loads Google Analytics 4 and Microsoft Clarity on almost every page before any consent (TF-01, PR-23), and its privacy policy makes unverified claims about them (Q-09). `CLAUDE.md` rule 6 requires no tracking before consent or a cookieless option, and no third-party script without a decision record. The owner wants a tool to look at site data and delegated the choice (Q-09); the site has no forms, no login and no advertising.

## Options considered

- **A) No analytics.** Nothing to load, nothing to disclose, simplest CSP. The firm gets no visit numbers at all, and the edge request counts in the Cloudflare dashboard are not a substitute (they include bots and assets).
- **B) Cookieless analytics: Cloudflare Web Analytics, plus Google Search Console.** One small script (`beacon.min.js`) from Cloudflare, which already hosts the site. No cookies and no browser storage, no fingerprinting, IP address discarded at the edge, so no consent banner (sources below). Search Console adds search queries and indexing status and puts nothing on the site. Limits: no events, no funnels, short unsampled retention (see Consequences).
- **C) Keep GA4 and Clarity behind a consent banner.** Richest data (events, sessions, heatmaps, session recordings). Needs a consent banner and its code, a longer privacy policy, two more processors and CSP exceptions for several Google and Microsoft hosts; data is missing for every visitor who declines; session recording of visitors to a law firm site is hard to justify with no forms to improve.

## Decision

**Option B: Cloudflare Web Analytics (cookieless, no banner) plus Google Search Console.** No GA4 and no Clarity. Decided by the owner for Phase 5; the default recommendation of the phase file was also B.

Implementation:

- **Manual setup** (the JS snippet with a site token), not the automatic injection. It works the same on the preview (`workers.dev`) and on `mmec.adv.br`, is visible in the repository, and keeps the CSP exact. The automatic injection must stay **off** in the dashboard: only one snippet may run per page, and an injected copy would be blocked by the CSP.
- The token lives in `src/config/analytics.ts`. While it is empty, no script is printed and the CSP allows no third-party host, so nothing loads before the owner creates the site in the dashboard.
- With a token, `BaseLayout` prints `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "…"}'>` and the build adds exactly two CSP sources: `script-src https://static.cloudflareinsights.com` and `connect-src https://cloudflareinsights.com`.
- Search Console is set up by the owner in Google (verification) and needs no code (see `docs/security.md`, "Search engines").

## What the Cloudflare dashboard shows

From the official documentation, read on 2026-10-26 (links below):

- **Metrics:** visits (a page view whose referrer is another site or empty), page views (a successful response with an HTML content type on which the beacon ran), page load time and Core Web Vitals (LCP, INP, CLS).
- **Dimensions** (filter and group): country, host, path, referrer (host in the dashboard), device type, browser, operating system, site, "exclude bots" and navigation type.
- **Retention:** unsampled data for 7 days, then aggregated to about 10%; about six months of history. Dashboard queries may be sampled.
- **Privacy:** the beacon reads only the browser's performance APIs; it does not read or write cookies, `localStorage`, `sessionStorage` or IndexedDB. Cloudflare discards the IP address at the nearest data centre and does not store it in its core databases or logs, and does not track individual visitors across sites. Data may be processed in another country. This matches section 2 of `/privacidade` as written in Phase 4, so the policy text and its date stay unchanged.

## What it does not measure

- **PDF opens and downloads.** A PDF is not an HTML page, so the beacon never runs on it, and the beacon has no custom events, so clicks on "Abrir" or "Baixar" are not recorded either. The dashboard shows only visits to the publication pages (`/publicacoes/...`), not how many people opened or downloaded each PDF. Request counts for the PDF paths may be visible in the zone's HTTP traffic analytics once `mmec.adv.br` is served by this Worker (Phase 8); not verified here, and those counts include bots and repeated range requests.
- **Visitors with JavaScript off or a blocker** that blocks `static.cloudflareinsights.com`.
- **Events, conversions, funnels, scroll depth, time on page, returning visitors, sessions or heatmaps.** Clicks on the telephone, WhatsApp, e-mail and map links are not counted.
- **Search queries.** These come from Search Console only (Google searches, not other search engines).
- **History.** GA4 and the existing Search Console data are not imported; the owner exports them before the cutover (Q-09).

## Consequences

- No consent banner, no cookie notice, and the privacy policy stays short.
- The CSP stays strict: no third-party host at all until a token is set, and then only the two Cloudflare hosts.
- The beacon cannot use Subresource Integrity in a manual setup (Cloudflare does not version the script), so the site trusts Cloudflare, which already serves every byte of it.
- Questions such as "how many people downloaded the election booklet" cannot be answered. If the firm needs that, a later decision can add a first-party download counter or move to option C, with a new record superseding this one.
- Tests stub the two approved hosts (`tests/support/site-headers.ts`) and fail on any other third-party request.

## Sources

- Cloudflare Web Analytics FAQ (CSP entries, retention, sampling, automatic vs manual setup, SRI): <https://developers.cloudflare.com/web-analytics/faq/>
- High-level metrics: <https://developers.cloudflare.com/web-analytics/data-metrics/high-level-metrics/>
- Dimensions: <https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/>
- Data origin and collection: <https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/>
- RUM beacon, privacy and data processing: <https://developers.cloudflare.com/speed/observatory/rum-beacon/>
