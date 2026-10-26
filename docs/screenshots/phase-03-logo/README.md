# Logo sharpness, Phase 3 gate

Header and footer logo of the home page before and after the fix for the "grainy logo" report
(PR #6). Taken with Playwright in Chromium from the production build.

- File names: `<state>-<area>-<viewport>-dpr<ratio>.png`.
- States: `before` (commit `10302c7`) and `after` (this branch).
- Areas: `header` (the whole header) and `footer` (the footer brand column).
- Viewports: `desktop` (1440 px), `mobile390` (390 px) and `mobile360` (360 px).
- Device pixel ratios: 1, 2 and 3.

Cause: the SVG was already vector, with no raster, `srcset`, `image-rendering` rule or embedded
bitmap. The 3600-unit artboard was drawn at 300 px, so the two wordmark lines rendered at about
7 and 6 px. After: 300 px minimum of visible artwork (Q-23) and 400 px of artwork from 64rem.
