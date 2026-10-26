# Phase 0: Discovery and content inventory (no code)

**Goal:** know exactly what the new site may say, which pages it needs, and which risks exist, before writing any code.

## Prompt

```
Read CLAUDE.md, docs/brand.md and README.md. Then execute Phase 0 from docs/phases/00-discovery.md.
Work on branch docs/discovery. Do not write application code and do not install anything.
Stop when the pull request is open.
```

## Tasks

1. Read the old site from the sibling clone `../mmec-site-legacy/public` (read-only). Extract all visible copy, metadata, URLs, PDFs and images into `docs/content-sources.md`: one row per statement or block, with its source file and line, and a status (`keep`, `rewrite`, `drop`, `needs-owner`).
2. Extract text from the three PDFs in `../mmec-site-legacy/public/assets/docs/` and record title, page count and one-line description. Do not copy the full text.
3. Propose a sitemap using **only existing content**. Starting point: Home (office, practice areas, publications teaser, contact), Publications index plus the three existing publications, Privacy, Terms, 404. Mark `/equipe` as reserved for later (Phase 9) and do not build it. Justify any page you add.
4. List every public URL of the old site and its fate in the new one (kept, redirected, removed) in `docs/url-map.md`.
5. Flag content problems in `docs/open-questions.md`, at minimum:
   - "MMC" vs "MMEC" naming.
   - Claims that are unverifiable or decorative (for example "360°", "01 focus") and the "22+ years" figure, which must be computed from 2004 or removed.
   - Email still on the old domain `@mouraeribeiro.adv.br`; Google Maps listing still under "Moura e Ribeiro".
   - Privacy policy mentions WhatsApp, which the site does not offer; analytics claims to verify.
   - Anything that may conflict with OAB advertising rules (verify Provimento 205/2021 on the OAB website and cite the exact articles you rely on).
6. Write `docs/decisions/0001-stack.md` confirming the stack in CLAUDE.md, with the reasons in 5 lines each (Astro static, plain CSS, no React, no motion library).
7. Write `docs/decisions/0002-site-structure.md` with the sitemap and rationale.

## Definition of done

- Every sentence from the old site appears in `content-sources.md` with a status.
- `url-map.md` covers every old URL.
- `open-questions.md` lists each question with a proposed default.
- The reviewer agent verdict is recorded in the PR description.

## Human gate

Read `content-sources.md` statuses and `open-questions.md`. Answer the questions in the PR comments or in the file. Approve the sitemap.
