# Phase 9 (backlog): Team pages

**Not part of the first launch.** Start only after Phase 8, when the owner provides real content.

## Needed from the owner before any work

- For each lawyer: full name, OAB number and section, role, a short factual biography, education, publications or institutional roles, a professional photograph (or an explicit decision to publish without photos), and written consent to be published.
- Order in which people appear and how the firm wants to be presented (partners, associates).

## Prompt (when ready)

```
Read CLAUDE.md, docs/brand.md and docs/phases/09-team-pages.md. Execute Phase 9 on branch feat/team.
Use only the data in docs/team-source.md that the owner provided. Do not invent biographies or credentials. Stop when the pull request is open.
```

## Tasks

1. Content collection `team` with typed frontmatter (name, role, OAB, biography, optional photo). Missing fields never render placeholder text.
2. Team index and one page per person, using existing components; add `Person` JSON-LD only with verified data.
3. Navigation and sitemap updates; reviewer agent pass with extra attention to OAB advertising rules and personal data (LGPD, consent on file).

## Human gate

Each person approves their own page text and photo.
