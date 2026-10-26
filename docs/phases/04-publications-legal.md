# Phase 4: Publications, legal pages and 404

**Goal:** the three publication pages, the privacy policy, the terms of use and a useful 404.

## Prompt

```
Read CLAUDE.md, docs/brand.md, docs/content-sources.md and docs/url-map.md. Execute Phase 4 from docs/phases/04-publications-legal.md on branch feat/publications-legal.
Stop when the pull request is open.
```

## Tasks

1. Publications index and the three publication pages (Eleições 2026 cartilha, Propaganda Partidária 2026 cartilha, calendário A Voz do Brasil 2026): title, short factual summary, cover, PDF download with size and page count, date of the edition, and the existing legal notice that the guidance is general and does not replace case analysis. Use a content collection with typed frontmatter so a new publication is one file plus one PDF.
2. Keep the PDFs and covers from the old repository as they are (copy, do not alter). Name files predictably.
3. URL continuity: implement every redirect and every kept path from `docs/url-map.md` in `public/_redirects`; include the old `.html` paths. Test them in CI.
4. Privacy policy and terms: rewrite from the existing text to match what the site really does after Phase 5 (analytics, cookies, forms, email). Remove claims that are not true (for example WhatsApp). Mark the page "last updated" with the real date. Flag in `open-questions.md` that the final legal text must be reviewed by the firm's lawyer before launch.
5. 404 page: sober, links back to Home and Publications, contact address.
6. Print styles for publication pages.

## Definition of done

- All old public URLs resolve or redirect (tested).
- PDFs open and download; sizes shown match the files.
- Reviewer verdict recorded.

## Human gate

Read the privacy policy and terms line by line. Confirm the publication summaries. Confirm the legal notice wording.
