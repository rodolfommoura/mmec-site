# Phase 3: Home page

**Goal:** the home page, built only from approved content and the Phase 2 components.

## Prompt

```
Read CLAUDE.md, docs/brand.md, docs/content-sources.md and docs/open-questions.md. Execute Phase 3 from docs/phases/03-home.md on branch feat/home.
Use only content marked keep or rewrite in content-sources.md. Stop when the pull request is open.
```

## Tasks

1. Structure (adjust only if the approved sitemap says otherwise): opening statement with the firm name and one factual line (broadcasting law, Brasília, since 2004); the office; the six practice areas as a plain, readable list (no tabs, no hidden panels); publications teaser with the real covers of the three PDFs; contact block with address, phone and email from the config file.
2. Copy: rewrite the old text only where it is vague or promotional; keep meaning. Every rewritten sentence gets a row in `content-sources.md` (source and what changed). Years of activity computed from 2004 at build time or omitted. No invented figures.
3. Imagery: the symbol as a single quiet watermark at most; publication covers; no stock photos. Provide `alt` text for every image.
4. Map: link to the Google Maps listing instead of an embedded iframe (no third-party request on load), unless the owner decides otherwise in `open-questions.md`.
5. Metadata: unique title and description, canonical, Open Graph image built from the brand banner assets.
6. Responsive from 320 px to 1920 px; test at 320, 390, 768, 1024, 1440.

## Definition of done

- No third-party requests on load (verify in the network log).
- Lighthouse budgets met on the built page.
- Zero axe violations; headings and landmarks correct.
- Reviewer verdict recorded.

## Human gate

Read the page aloud as a client would. Check every sentence: true, sober, compliant with OAB advertising rules. Check phone, address and email. Approve or comment.
