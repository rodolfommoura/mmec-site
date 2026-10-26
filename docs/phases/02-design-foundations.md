# Phase 2: Design foundations

**Goal:** the brand translated into tokens, fonts and a small set of base components, shown on one internal specimen page. No real pages yet.

## Prompt

```
Read CLAUDE.md and docs/brand.md. Execute Phase 2 from docs/phases/02-design-foundations.md on branch feat/design-foundations.
Stop when the pull request is open.
```

## Tasks

1. Design tokens as CSS custom properties: colours (only the six in `brand.md`), type scale, spacing, grid, hairlines, focus ring, breakpoints. No hard-coded values outside the tokens file.
2. Fonts: verify package names on npm, install the self-hosted variable fonts for Cormorant Garamond, Newsreader and Public Sans, subset to Latin, WOFF2 only, `font-display: swap`, fallbacks with adjusted metrics, preload at most two files.
3. Base layer: reset, typography, links, lists, tables, forms (focus, error states), `:focus-visible`, selection, print stylesheet (the firm prints documents).
4. Components from the list in `brand.md` only: header with accessible mobile menu (no JavaScript required for desktop; the mobile menu enhances), footer, buttons, links, section with eyebrow and title, prose, publication card, contact block, skip link, breadcrumb.
5. Logo handling: optimised SVGs, correct clear space and minimum sizes, `cream` variants on dark bands. Create a provisional simplified favicon (mark as provisional in `docs/open-questions.md`).
6. A specimen page at `/_design/` (excluded from the sitemap, `noindex`, **excluded from the production build** via an environment flag) that shows: colour swatches with contrast ratios, type scale, every component and state, and the two proposals for headings (upper case vs mixed case) side by side so the owner can choose.
7. Automated contrast test over all token pairs used for text.

## Definition of done

- `npm run check` passes, no console errors, specimen page is keyboard-complete.
- No colour, font or spacing literal outside tokens (verified by a lint rule or grep in CI).
- Reviewer verdict recorded.

## Human gate

Open the preview `/_design/` on desktop and phone. Decide: heading case (upper vs mixed), whether the simplified favicon is acceptable, and whether the overall feel is sober enough. Comment on the PR with exactly what to change.

Runner note: this gate moved. The owner decisions on heading case and favicon are reviewed with the Phase 3 pull request.
