# 0001. Stack

- Status: proposed
- Date: 2026-10-26
- Deciders: Rodolfo Moura

## Context

The site is small: a home page, a publications index, three publication pages, privacy, terms and a 404. Content changes a few times a year. It is hosted on Cloudflare Workers static assets. The legacy site is hand-written HTML with about 65 lines of JavaScript, but it also carries a counter, a marquee, a radar animation, tabs and filters that the brand now bans (`docs/brand.md`). `CLAUDE.md` fixes the stack; this record confirms it and states why, against the inventory made in Phase 0.

## Options considered

- **Plain HTML, as today.** No build step, but header, footer and metadata get copied across eight pages, with no type checks or link checks. This is how the legacy pages drifted apart (the legal pages have no skip link, and analytics differ between pages).
- **Astro, static output.** Components and layouts without shipping a runtime; output is plain HTML and CSS.
- **A React-based framework (Next.js, Gatsby).** Strong ecosystem, but built around client-side hydration that this site does not need.
- **Other static generators (Eleventy, Hugo).** Viable; Astro is preferred for TypeScript strict mode, built-in image handling and per-component scoped CSS.

## Decision

Astro with static output and TypeScript in strict mode; plain CSS with custom properties; no React; no motion library.

### Why Astro, static output

1. Every page is content that is known at build time; there is nothing to render per request.
2. Static HTML is served directly by Workers static assets: no server code, nothing to patch at runtime, a small attack surface.
3. Layouts and components remove the copy-pasted header, footer and metadata of the eight legacy pages.
4. Astro ships zero JavaScript by default, which matches "readable without JavaScript" (`CLAUDE.md`).
5. Built-in image optimisation and TypeScript strict mode support the performance and quality checks in Phases 1 and 6.

### Why plain CSS with custom properties

1. The design is a short list of tokens (six colours, three families, a 4 px scale) in `docs/brand.md`; custom properties map onto it one to one.
2. Astro scopes component styles already, so a utility framework adds little.
3. No Tailwind or UI kit means no generic look by default and no dependency to keep updated.
4. Reviewers can check tokens directly: a hard-coded colour or font stack is easy to find with a search.
5. Modern CSS (`clamp()`, grid, `:focus-visible`, `prefers-reduced-motion`) covers every layout and state the brand allows.

### Why no React

1. The only interactive piece is the mobile menu, which needs a few lines of progressive JavaScript.
2. The legacy interactive parts (tabs, filters, counters, theme toggle) are dropped, so nothing left needs a component runtime.
3. A React island adds a runtime download to every page that uses it, for no user benefit here.
4. Fewer dependencies mean fewer Dependabot updates and a smaller supply-chain risk.
5. If a future need appears (for example in Phase 9), it requires a new decision record, as `CLAUDE.md` says.

### Why no motion library

1. The brand allows only a fade with an 8 px rise (≤ 200 ms) and colour transitions (≤ 150 ms).
2. CSS transitions and one `IntersectionObserver` cover both, in a few lines.
3. Everything must turn off under `prefers-reduced-motion`, which one CSS media query does.
4. A motion library would encourage the effects the brand bans (parallax, counters, looping animation).
5. No extra dependency or JavaScript weight for an effect that is optional by design.

## Consequences

- Phase 1 adds Astro, TypeScript and the check tooling, with versions checked on the npm registry and pinned by the lockfile. Nothing is installed in Phase 0.
- Every new runtime dependency, third-party script or font source needs its own decision record.
- The mobile menu must work without JavaScript (for example a link to the footer navigation) and be enhanced when JavaScript is available.
- Supersede this record if the site ever needs server-side behaviour (for example a contact form with a backend).
