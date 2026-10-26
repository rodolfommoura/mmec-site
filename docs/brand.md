# Brand and design rules

Source of truth: the firm's "Manual de Marca MMEC" (Google Doc, 25/10/2026) and the Drive folder `Marca/standardized`. If this file and the manual disagree, the manual wins and this file gets fixed.

## Identity

- Name: Machado Moura e Cardoso Advogados Associados. Short form: MMEC. Never use "MMC" (it appeared on the old site by mistake).
- Symbol: an abstract drawing of Brasília's modernist architecture (the twin towers and the two bowls of the National Congress, with a rising line below). It is **not** a radio-wave motif. The old site's radar, signal and pulse animations are retired.
- Logo type: Cormorant Garamond, upper case.
- Positioning to express: Brasília, institutional, broadcasting law since 2004, rigour. Not a startup, not a tech product.

## Colours

| Token | Hex | Use | Contrast on cream |
|---|---|---|---|
| `--color-ink` | `#1C1C1C` | text, logo, headings | 15.2 |
| `--color-cream` | `#F5F2EA` | backgrounds, text on green | n/a |
| `--color-green` | `#2E4A3F` | section bands, buttons, section titles | 8.7 |
| `--color-bronze` | `#7A5A2E` | hairlines, icons, links | 5.6 |
| `--color-stone` | `#6B675F` | secondary text, captions | 5.0 |
| `--color-line` | `#D9D4C5` | dividers and borders only, **never text** | 1.3 |

- Proportion per page: about 80% cream and ink, 15% green, 5% bronze.
- Text on green or ink backgrounds is cream. Bronze is **not** used for text on dark backgrounds (contrast is below 3:1); on dark use it only for decorative hairlines.
- Light theme only. No dark mode in v1.
- Re-verify every text and background pair with a contrast checker in CI or in review. Interactive states (hover, focus) must keep ≥ 3:1 against neighbours and ≥ 4.5:1 for text.

## Typography

| Role | Family | Notes |
|---|---|---|
| Brand name, display titles | Cormorant Garamond | upper case with slight letter-spacing; SemiBold below 18 pt (about 24 px) |
| Body text, subtitles | Newsreader | 17 to 18 px on the site |
| UI, navigation, tables, captions, footer | Public Sans | 14 to 15 px |

- Self-host WOFF2 files (OFL licence). Prefer the variable fonts from the `@fontsource` / `@fontsource-variable` npm packages after verifying the exact package names. Subset to Latin; `font-display: swap`; preload only the one or two files used above the fold; define metric-compatible fallbacks (Georgia, Garamond, Arial) to avoid layout shift.
- Open question for the owner (decide in Phase 2 with a visual preview): the manual sets titles in upper case. Long headings in upper case read poorly. Proposal: upper case with letter-spacing for short titles (about 8 words or fewer, eyebrows, the brand name) and sentence case Cormorant for longer headings. Do not apply until the owner approves.
- Line length 60 to 75 characters for body text. Fluid type scale with `clamp()`. Base line-height about 1.6 for body.

## Logo files

Copy from the firm's brand folder `Marca/standardized` into `public/brand/`, keeping the names `mmec-<asset>-<variant>`:

- `svg/mmec-logo-horizontal-ink.svg`, `-cream.svg` (header, footer)
- `svg/mmec-logo-stacked-ink.svg`, `-cream.svg`
- `svg/mmec-symbol-ink.svg`, `-cream.svg`
- `png/mmec-symbol-avatar-512-on-cream.png` (touch icon, social avatar)

Rules:

- Clear space around any logo: a quarter of the symbol height on all sides.
- Minimum on screen: horizontal logo 300 px wide measured on the visible artwork, not the artboard (Q-23), stacked 200 px, symbol 64 px. Below a 360 px viewport the horizontal logo shrinks to fit instead of causing horizontal scrolling. The mobile header must respect the 300 px minimum or use symbol plus text set in HTML only if the owner approves.
- Use the `cream` variant on green or ink. Never place the logo over photos.
- The SVGs were traced from PNG masters (the original vector is still pending). Optimise them but do not redraw.
- Known gap: the symbol has thin strokes and fails below 64 px. The 32 px favicon therefore needs a simplified, thicker symbol. Resolved: the brand folder `Marca/standardized/favicon` holds the simplified symbol "variant F", approved 2026-10-26 (its `README.md`), for use below 64 px. `favicon.ico` and `favicon.svg` are copied to `public/`.

## Visual vocabulary (allowed)

- Large areas of cream, generous white space, a 12-column grid, strong left alignment.
- Hairline rules in `--color-line` or bronze; numbered sections in Public Sans small caps; long-form text set like a printed publication.
- The symbol used once, large and cropped, as a quiet watermark on one or two pages at most, in `--color-line` or low-opacity ink.
- Solid green bands for emphasis, with cream text.
- Real documents as imagery: the covers of the firm's PDF publications.

## Motion

- Default: none. Allowed: a subtle fade and 8 px rise on first reveal (≤ 200 ms), link and button colour transitions (≤ 150 ms).
- Everything disabled under `prefers-reduced-motion: reduce`.
- No scroll-jacking, parallax, counters, marquees or looping animations. A motion library is not needed; adding one requires a decision record.

## Components (Phase 2 delivers these, nothing more)

Header and navigation (with accessible mobile menu), footer, button, text link, section wrapper with eyebrow and title, prose container, publication card, contact block, skip link, breadcrumb (for publication pages).

## Spacing and shape

- 4 px base spacing scale. Corners square or 2 px radius at most. No shadows except a focus ring. Borders are hairlines.
