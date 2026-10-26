# 0002. Site structure

- Status: proposed
- Date: 2026-10-26
- Deciders: Rodolfo Moura

## Context

The rebuild may only use content that exists today (`CLAUDE.md`, "Do not invent"). The Phase 0 inventory ([`content-sources.md`](../content-sources.md)) found that content: one home page with six sections worth keeping in some form, three publication pages with PDFs, a privacy policy, terms of use and a 404 page. The phase file proposes Home, a publications index plus the three publications, Privacy, Terms and 404, with `/equipe` reserved for Phase 9.

## Options considered

- **Single page plus legal pages, as today.** The publications have no index; adding a fourth publication means changing the home page layout.
- **One page per home section (`/escritorio`, `/atuacao`, `/contato`).** Each page would be thin. Filling them would need new copy that does not exist yet.
- **Home with sections, plus a publications index and one page per publication.** It uses only existing content and gives the publications a stable home as more are added.

## Decision

Adopt the third option. Sitemap:

```text
/                                               Home
  #escritorio                                   The office
  #atuacao                                      Practice areas (6, from H-39 to H-62)
  #inteligencia                                 Publications teaser, titled "Publicações"
  #contato                                      Contact
/publicacoes                                    Publications index
  /publicacoes/cartilha-eleicoes-2026           Publication (P1)
  /publicacoes/cartilha-propaganda-partidaria-2026   Publication (P2)
  /publicacoes/calendario-voz-do-brasil-2026    Publication (P3)
/privacidade                                    Privacy policy
/termos                                         Terms of use
404                                             Not-found page (any unknown path)
/equipe                                         RESERVED for Phase 9, not built, not linked
```

Navigation: O escritório, Atuação, Publicações, Contato. Footer: the same links plus Política de privacidade and Termos de uso.

### What each page holds, and its source

| Page | Content | Sources |
|---|---|---|
| Home, top | Eyebrow, plain `h1`, lead paragraph, two links (contact, practice areas), "Desde 2004" | H-04 to H-08, H-16 (Q-02) |
| Home, office | Two paragraphs on the firm | H-20 to H-24, PDF-01 (Q-06) |
| Home, practice areas | Six areas, each with label, short heading, text and list, all visible (no tabs) | H-36 to H-62 |
| Home, publications | Three cards with cover, category, title, one line, link; link to `/publicacoes` | H-72 to H-84 |
| Home, contact | Email, phone, address, map link | H-89 to H-98 (Q-03, Q-05, Q-10) |
| Publications index | Short intro, list of the three publications | Card copy H-72 to H-84. The intro needs one or two new sentences (see below) |
| Publication pages | Title, lead, PDF buttons, cover, summary, key facts as text, topics, legal notice | E-01 to E-27, PP-01 to PP-23, VB-01 to VB-21 |
| Privacy | Rewritten policy | PR-01 to PR-23 (Q-09) |
| Terms | Revised terms | T-01 to T-19 (Q-11) |
| 404 | Message and link home | NF-01 to NF-08 |

Sections of the legacy home that are **not** carried over: ticker, metrics, "Nosso posicionamento" and the brand band (reasons in `content-sources.md`, rows H-18 to H-32, H-63 to H-68, H-85 to H-88).

### Justification for the page that is added

`/publicacoes` is the only page with no legacy equivalent. Reasons:

1. The phase file lists it in the starting sitemap.
2. The three publication pages need a parent: breadcrumbs (a Phase 2 component), the publications nav item, and an index URL for the sitemap.
3. Publications are the one part of the site expected to grow (new editions, Q-19). With an index, a new publication does not mean redesigning the home page.
4. It keeps the publication URLs grouped under one path (`/publicacoes/...`), as in `docs/naming.md`.

Its only new copy is a one- or two-sentence intro. It must restate facts already in the inventory (the publications are informative material on broadcasting law, see T-07 and T-08) and is approved by the owner in Phase 4. If the owner prefers, the index can go without any intro.

### Why not more pages

- No separate office, practice-area or contact pages: the content is a few paragraphs each and fits the home page. Splitting it would mean writing new copy.
- No team page now: there is no team content in the sources. `/equipe` is reserved for Phase 9 and gets no link, no placeholder and no "em breve" text.
- No news or blog section: no such content exists.

## Consequences

- Old publication URLs move under `/publicacoes/` and get `301` redirects. Old home anchors keep their `id` values. PDFs keep their exact paths ([`url-map.md`](../url-map.md)).
- Phases 3 and 4 build exactly these pages. Any new page needs a change to this record and source content first.
- The publication page template is shared by the three publications, so adding a fourth is a content change, not a design change.
