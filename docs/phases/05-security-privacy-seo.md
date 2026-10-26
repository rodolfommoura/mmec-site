# Phase 5: Security, privacy and SEO

**Goal:** headers, CSP, a lawful analytics setup, and search metadata.

## Prompt

```
Read CLAUDE.md and docs/phases/05-security-privacy-seo.md. Execute Phase 5 on branch feat/security-privacy-seo.
Present the analytics options to me and wait for my decision before implementing that part. Stop when the pull request is open.
```

## Tasks

1. `public/_headers`: `Content-Security-Policy` (default-src 'self'; no inline scripts or styles unless hashed; frame-ancestors 'none'; base-uri 'self'; form-action 'self'), `Strict-Transport-Security` (start with a short max-age; do not add `preload`), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` (everything denied), `Cross-Origin-Opener-Policy`, long immutable cache for hashed assets and short cache for HTML. Verify the real output (Astro may inline small scripts: use hashes or external files).
2. Analytics decision (owner decides). Present options with pros and cons in `docs/decisions/0003-analytics.md`:
   - A) No analytics.
   - B) Cookieless first-party-friendly analytics (for example Cloudflare Web Analytics; verify current behaviour, cookies and CSP needs in the official docs).
   - C) Keep Google Analytics and Microsoft Clarity behind a consent banner (more code, more privacy text, session recording of visitors).
   Default recommendation: B. Do not load anything before the decision.
3. SEO: unique titles and descriptions, canonical URLs, `sitemap.xml` with `lastmod`, `robots.txt` (keep `noindex` on preview; production rules documented), JSON-LD `LegalService` with only verified facts (name, address, phone, URL), Open Graph and Twitter cards, `hreflang` not needed (single language).
4. `security.txt` at `/.well-known/security.txt` with a contact address (ask the owner which).
5. Supply chain: lockfile reviewed, `npm audit`, Dependabot active, GitHub Actions pinned by SHA, no postinstall scripts from unknown packages, secret scanning enabled on the repository (document how).
6. Document the checklist and the results in `docs/security.md`.

## Definition of done

- Security headers verified on the preview URL with an external scanner or `curl -I`; CSP produces zero violations in the browser console on every page.
- No third-party request except those explicitly approved in decision 0003.
- Reviewer verdict recorded.

## Human gate

Choose A, B or C for analytics. Provide the security contact address. Approve the privacy policy changes that follow from the decision.
