# Phase 6: Accessibility and performance hardening

**Goal:** prove the site is accessible and fast, then fix what the audit finds.

## Prompt

```
Read CLAUDE.md and docs/phases/06-accessibility-performance.md. Execute Phase 6 on branch fix/a11y-performance.
Audit first, write findings to docs/audit-06.md, then fix. Stop when the pull request is open.
```

## Tasks

1. Automated audits on every built page: axe, Lighthouse (mobile and desktop), HTML validation, link check.
2. Manual audit with a written log: keyboard-only walkthrough of every page, visible focus everywhere, skip link, mobile menu focus trap and Escape, 200% and 400% zoom, 320 px reflow, reduced motion, forced colours mode, print preview, screen-reader smoke test (NVDA on Windows if available; otherwise state that it was not done).
3. Performance: total transfer per page, number of requests, LCP, CLS, INP targets (good in Core Web Vitals), image formats and dimensions, font loading, unused CSS and JavaScript.
4. Browser matrix: current Chrome, Edge, Firefox, Safari (iOS and macOS). Record what could not be tested.
5. Fix everything blocking; list non-blocking items with owner decision needed.

## Definition of done

- `docs/audit-06.md` exists with results and remaining items.
- Lighthouse: performance ≥ 95, accessibility 100, best practices 100, SEO 100 on all pages (or a written explanation per exception).
- Reviewer verdict recorded.

## Human gate

Open the site on your own phone and computer. Report anything that feels slow, hard to read or hard to use.
