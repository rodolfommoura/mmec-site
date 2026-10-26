# 0004. Self-hosted fonts

- Status: proposed
- Date: 2026-10-26
- Deciders: Rodolfo Moura

Number 0003 is reserved for `0003-analytics` (Phase 5).

## Context

`docs/brand.md` sets three families: Cormorant Garamond (display), Newsreader (body) and Public Sans (UI). `CLAUDE.md` bans Google Fonts and any third-party font CDN, and decision 0001 asks for a record for every new font source. The fonts must be WOFF2, subset to Latin, `font-display: swap`, with metric-compatible fallbacks and at most two preloads.

## Options considered

- **Google Fonts CDN.** Banned by `CLAUDE.md` (third-party request before consent, CSP exception).
- **Copy WOFF2 files into `src/assets/fonts/` by hand.** No supply chain, but updates are manual and the source of each file is not recorded.
- **`@fontsource-variable/*` npm packages, wired by hand with `@font-face`.** Versioned through the lockfile; fallback metrics must be computed and maintained by hand.
- **`@fontsource-variable/*` packages through the Astro Fonts API (`fontProviders.local()`).** Same files, versioned through the lockfile; Astro hashes and copies them to `/_astro/fonts/`, writes the `@font-face` rules and generates metric-adjusted fallback faces.

## Decision

Use `@fontsource-variable/cormorant-garamond`, `@fontsource-variable/newsreader` and `@fontsource-variable/public-sans` (5.3.0, OFL-1.1, verified on the npm registry on 2026-10-26), pinned exactly, read by the Astro Fonts API with the local provider (`astro.config.mjs`). Only the Latin `wght` files are used: Cormorant Garamond upright, Newsreader upright and italic, Public Sans upright. `BaseLayout.astro` preloads two files: Newsreader upright and Cormorant Garamond upright.

## Consequences

- No font request leaves the site's origin. The CSP in Phase 5 needs no font exception.
- Fallbacks: Astro generates size-adjusted faces on Times New Roman (serif families) and Arial (Public Sans); Garamond and Georgia follow in the stack as `docs/brand.md` lists them.
- The Fonts API writes the `@font-face` rules as inline `<style>` elements. Phase 5 must allow them in the CSP (hash or nonce), together with the inline module script of the mobile menu.
- Dependabot updates the three packages; a font update changes file hashes, not markup.
