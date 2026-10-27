# Security, privacy and SEO checklist

Checklist from Phase 5 (`docs/phases/05-security-privacy-seo.md`) and the results recorded on 2026-10-26. Re-run the checks marked "repeat" before the cutover (Phase 8).

## Response headers

Source: `public/_headers`. The build writes the Content-Security-Policy into `dist/_headers` (`src/integrations/csp-headers.mjs`). `npm run test:headers` (`scripts/check-headers.mjs`) serves `dist/` with Wrangler's local runtime, which applies `_headers` as the Worker does, and checks an HTML page, a publication page, a PDF, a hashed asset, `security.txt`, the sitemap and the 404 page.

| Header | Value | Why |
|---|---|---|
| `Content-Security-Policy` | see below | Only same-origin resources; blocks injected scripts, framing and form hijacking. |
| `Strict-Transport-Security` | `max-age=86400` | HTTPS only. Starts at one day; no `includeSubDomains` (other subdomains of `mmec.adv.br` are not ours to judge) and no `preload`. |
| `X-Content-Type-Options` | `nosniff` | No MIME sniffing. |
| `X-Frame-Options` | `DENY` | Older browsers that ignore `frame-ancestors`. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | External sites see only the origin. |
| `Permissions-Policy` | every listed feature `=()` | The site uses no camera, location, payment, fullscreen or similar API. |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isolates the browsing context from pages it opens. |
| `X-Robots-Tag` | `noindex, nofollow` | Preview only; removed at the cutover. |
| `Cache-Control` on `/_astro/*` | `public, max-age=31536000, immutable` | File names carry a content hash. |
| `Cache-Control` elsewhere | platform default `public, max-age=0, must-revalidate` | HTML, PDFs, brand files and favicons keep their URL when the content changes (a new PDF edition replaces the file at the same path, Q-12), so browsers revalidate with the ETag. |

HSTS ramp-up after the cutover, one step at a time once the previous one ran without problems: `max-age=86400` (Phase 5) → `max-age=2592000` (30 days, after the cutover is stable) → `max-age=31536000` (one year). `preload` stays out unless a decision record says otherwise.

### Content-Security-Policy

```text
default-src 'self'; script-src 'self'; style-src 'self' 'sha256-…' (×3);
img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none';
base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
```

- No `'unsafe-inline'` and no `'unsafe-eval'`. Astro is configured to emit every stylesheet and script as an external file (`build.inlineStylesheets: "never"`, `vite.build.assetsInlineLimit: 0`).
- The only inline blocks left are the three `@font-face` `<style>` elements of the Astro Fonts API. The build hashes every inline `<script>` and `<style>` in the output and adds the hashes, so a new inline block is allowed by hash, never by `'unsafe-inline'`, and never blocked by surprise.
- JSON-LD (`<script type="application/ld+json">`) is not executed, so `script-src` does not apply to it.
- With a Cloudflare Web Analytics token (decision `0003-analytics`), the build adds `https://static.cloudflareinsights.com` to `script-src` and `https://cloudflareinsights.com` to `connect-src`. Without a token, no third-party host is allowed.
- Verified in the browser: `tests/console.spec.ts` serves every page and the 404 with the real policy and fails on any console error (a CSP violation is one), and checks that an injected inline script is refused.

## Analytics and privacy

- Decision: `docs/decisions/0003-analytics.md` (Cloudflare Web Analytics, manual setup, plus Google Search Console; no GA4, no Clarity). It lists what the dashboard shows and what it does not measure (PDF opens and downloads, events, sessions).
- The token of the existing Web Analytics site for `mmec.adv.br` is set in `src/config/analytics.ts` (Q-29), and the CSP allows its two hosts. The beacon loads only when the page is served from `mmec.adv.br` or `www.mmec.adv.br` (`src/components/WebAnalytics.astro`): Cloudflare rejects its report from any other origin, so the preview Worker and local servers load no beacon. It can therefore only be validated in production (Phase 8, `docs/launch-checklist.md`). With an empty token nothing is loaded and no third-party host is allowed. Turning off the site's automatic setup and exporting its history are Phase 8 steps (`docs/launch-checklist.md`).
- `/privacidade` section 2 matches the Cloudflare documentation read on 2026-10-26 (no cookies or storage, IP discarded, processing possibly outside Brazil); its text and "Última atualização" stay unchanged. The lawyer review is still open (Q-26).
- No third-party request: `tests/home.spec.ts` fails on any request to a host not approved in decision 0003.

## Search engines

- Unique `<title>` and description on every page, canonical URL, Open Graph and Twitter card tags (`src/layouts/BaseLayout.astro`); checked by `tests/seo.spec.ts`.
- `/sitemap.xml` (`src/pages/sitemap.xml.ts`): every public page, extensionless, with `lastmod` from `src/config/page-dates.ts`. The design specimen and the 404 page are never listed. Update the date in that file when a page's text changes.
- `/robots.txt` (`src/pages/robots.txt.ts`): `Allow: /` and the sitemap URL, on the preview too. A `Disallow` would stop crawlers from fetching pages and seeing their `noindex`.
- JSON-LD `LegalService` on the home page with name, URL, telephone and postal address only (`src/config/structured-data.ts`).
- No `hreflang`: the site has one language.

Production rules at the cutover (Phase 8):

1. Remove `X-Robots-Tag` from `public/_headers` and from the required headers in `scripts/check-headers.mjs`, and set `indexable: true` in `src/config/site.ts` (this removes the robots meta tag).
2. Keep `robots.txt` as it is; it already points to `https://mmec.adv.br/sitemap.xml`.
3. Re-enable the Lighthouse `is-crawlable` audit (`lighthouserc.cjs`).
4. In Search Console, submit `https://mmec.adv.br/sitemap.xml` and watch the coverage report for the legacy `.html` URLs, which answer `301` (`docs/url-map.md`).

Search Console verification (owner): prefer a **Domain property** verified by a DNS TXT record on `mmec.adv.br`. It covers every subdomain and protocol, survives the rebuild, and needs no code. The legacy repository has no verification file and no `google-site-verification` meta tag, so an existing property was verified either by DNS or through the GA4 tag; in the second case, verification is lost when GA4 goes away at the cutover. A URL-prefix property verified by an HTML file or meta tag is the fallback; it needs a small pull request with the file or tag.

## security.txt

`/.well-known/security.txt` (`src/pages/.well-known/security.txt.ts`, RFC 9116): `Contact` is the site contact address from `src/config/site.ts` (owner decision for Phase 5, Q-03), `Expires` one year after the build (every deploy renews it; if the site is not redeployed for a year, the file lapses, so redeploy at least yearly), `Preferred-Languages: pt` and `Canonical`. When the mailbox on `@mmec.adv.br` is confirmed, changing `contact.email` updates this file too. `tests/seo.spec.ts` checks the contact and that `Expires` is in the future.

## Supply chain

| Check | Result (2026-10-26) |
|---|---|
| Lockfile committed and installed with `npm ci` in CI | Yes. |
| Dependencies pinned to exact versions | Yes, in `package.json`; transitive versions pinned by `package-lock.json`. |
| `npm audit --omit=dev` (what reaches the site) | 0 vulnerabilities. |
| `npm audit` (including dev tooling) | 19 (2 low, 3 moderate, 14 high), all in development tools; see below. |
| Packages with install scripts | `esbuild` (downloads its platform binary; used by Astro and Vite), `fsevents` (macOS only, optional), `workerd` (Cloudflare's runtime, used by Wrangler). All are well-known and expected; no unknown package runs a `postinstall`. |
| Dependabot | Version updates weekly for npm and GitHub Actions (`.github/dependabot.yml`); alerts and security updates enabled (see below). |
| GitHub Actions pinned by commit SHA | Yes: `actions/checkout`, `actions/setup-node`, `actions/cache`, `actions/upload-artifact`, all GitHub-owned, with the version as a comment. Workflow token is `contents: read`. |
| Secrets in the repository | None; secret scanning with push protection is enabled. The Cloudflare Web Analytics token is public by design (it is printed in every page). |
| Third-party scripts | Cloudflare Web Analytics only (decision 0003), loaded because a token is set. |

Dev-only audit findings (nothing from them reaches `dist/` or the Worker):

- `wrangler` 4.152.0 → `miniflare` → `undici` (moderate and high). Fixed in `wrangler` 4.153.0 (registry, 2026-10-26), a minor update that Dependabot proposes in the weekly `dev-tooling` group. Not updated in this phase.
- `@lhci/cli` 0.15.1, still the latest release and unpublished since 2025-06-25, pulls in an old `lighthouse` with `puppeteer-core`, `tmp`, `extract-zip`, `proxy-agent`, `uuid`, `inquirer` and `zod`. It only audits `localhost` in CI. `npm audit fix --force` would downgrade it to 0.1.0: do not run it. Replacing it means changing the performance tooling, which belongs to Phase 6 (open question Q-31).

### Repository settings (owner, in GitHub)

Settings cannot be stored in Git; `docs/repository-settings.md` lists the intended state. State read with `gh api` on 2026-10-26 (read-only): the repository is public; secret scanning, push protection, Dependabot alerts, Dependabot security updates and private vulnerability reporting are **enabled**. To check or re-enable them:

1. Repository → **Settings** → **Advanced Security** (called "Code security" on some plans).
2. Turn on **Secret Protection** (secret scanning) and **Push protection**. On a private repository of a free personal account these may be unavailable; they are free on public repositories.
3. In the same page, turn on **Dependabot alerts** and **Dependabot security updates**, and **Private vulnerability reporting**.
4. Check with `gh api repos/{owner}/mmec-site --jq '.security_and_analysis'`: `secret_scanning` and `secret_scanning_push_protection` should read `enabled`.

## Verification on the preview URL (repeat)

After the pull request preview is built, from any terminal:

```sh
curl -sI https://<preview-url>/ | grep -iE 'content-security|strict-transport|x-content|x-frame|referrer|permissions|cross-origin|x-robots|cache-control'
curl -sI https://<preview-url>/_astro/<any-file>.css | grep -i cache-control
curl -s https://<preview-url>/.well-known/security.txt
```

Then open every page with the browser console open (no CSP error), or run an external scanner such as <https://securityheaders.com> or <https://developer.mozilla.org/en-US/observatory> on the preview URL. Record the result in the pull request.
