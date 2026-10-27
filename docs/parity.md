# Content parity with the legacy site

Page-by-page comparison of the legacy site (`rodolfommoura/mmec-site-legacy`, commit `3402fce`, the commit deployed on `mmec.adv.br`) with the preview of the rebuild (`https://mmec-site.rodolfo-e70.workers.dev`, built from `main` at `f3a3733`), done in Phase 7 on 2026-10-27. Goal: no content is lost unintentionally.

## Method

1. Every legacy text, link, image and document is a row of [`content-sources.md`](content-sources.md) with a status (`keep`, `rewrite`, `drop`). A `drop` must name its reason or an owner decision.
2. Every `keep` row was checked mechanically against the text and text attributes of every built page in `dist/` (a throwaway script, same normalisation as `scripts/audit-content-text.mjs`). Misses are listed below with their explanation.
3. Every `rewrite` row was checked by hand against the rewrite logs of Phases 3 and 4 in `content-sources.md` and the built pages.
4. Every legacy URL of [`url-map.md`](url-map.md) was requested on the preview with `curl` (status and `location`), and every legacy file in `public/assets/` was downloaded from the preview and compared byte for byte with the legacy clone.

## Summary

| Legacy page | New page | Rows `keep` / `rewrite` / `drop` | Content lost unintentionally |
|---|---|---|---|
| Global elements (header, footer, menu) | Every page | 18 / 2 / 8 | None |
| `index.html` | `/` | 48 / 22 / 28 | H-04, see [Findings](#findings) |
| `cartilha-eleicoes-2026.html` | `/publicacoes/cartilha-eleicoes-2026` | 22 / 5 / 0 | E-03, see [Findings](#findings) |
| `cartilha-propaganda-partidaria-2026.html` | `/publicacoes/cartilha-propaganda-partidaria-2026` | 18 / 5 / 0 | None |
| `calendario-voz-do-brasil-2026.html` | `/publicacoes/calendario-voz-do-brasil-2026` | 18 / 3 / 0 | None |
| `privacidade.html` | `/privacidade` | 14 / 5 / 4 | None |
| `termos.html` | `/termos` | 14 / 5 / 0 | None |
| `404.html` | not-found page | 8 / 0 / 0 | None |
| (none) | `/publicacoes` | new page | not applicable |

Counts include the `<title>` rows.

## Page by page

### Global elements

- Kept: full firm name as logo text, descriptor "Direito da radiodifusão", skip link (now on every page, including the legal pages), navigation labels, location line, e-mail (old domain, Q-03), footer columns, legal links, copyright (year rendered at build time).
- Rewritten: "Inteligência setorial" becomes "Publicações" (Q-14); home link name worded per component (G-02).
- Dropped, each with its reason in `content-sources.md`: high-contrast toggle (G-10, rule 5), decorative menu numbers (G-13), developer credit (G-21, Q-15), "Voltar ao topo" (G-22), duplicate PDF footer column (G-24), "MMC" pseudo-element text (G-25, Q-01), placeholder toast (G-26), legacy `theme-color` (G-27).
- Added: the firm's OAB registration in the footer (OWN-01, CED art. 44).

### Home (`/`)

- Kept: hero lead, both buttons, "Desde 2004" (now inside the opening statement), office paragraph, all six practice areas with their labels, headings, texts and lists, the three publication cards with their real covers and alt texts, contact paragraph, e-mail, both phone numbers, address and the map link, all legacy anchors (`#inicio`, `#topo`, `#escritorio`, `#atuacao`, `#inteligencia`, `#contato`, `#conteudo-principal`, `#area-1` to `#area-6`).
- Rewritten (Phase 3 log): `h1`, office heading and lead, four practice-area phrases, section headings, contact heading.
- Dropped by decision: ticker (rule 5), metrics and counter (Q-02, Q-04), positioning section (Q-07), "Principais atributos" (Q-06), brand band slogan (OAB art. 3, IV), filters, Google Maps iframe (Q-10), scroll cue, radar animation.
- Added: postcode and the WhatsApp number (Q-05).

### Publication pages

- All three pages keep their title, description, eyebrow, lead, summary, metrics (now as text), section lists and legal notice; the PDFs open and download from the same paths. Metadata (type, edition, file size and page count) is new and read from the files.
- The two booklets add a neutral period note (OWN-02); the disclaimers use neutral wording (Q-08).
- Legacy URLs redirect with one `301` each to `/publicacoes/...`.

### Privacy policy and terms

- The privacy policy keeps its opening, the "do not sell" statement, the rights section and contact; it is rewritten for the site as it now works (no cookies, Cloudflare Web Analytics, Search Console) and lists all LGPD art. 18 rights. The GA4 and Clarity paragraphs are dropped because those tools are gone (Q-09).
- The terms keep every clause; the reuse clause follows the PDFs (Q-11), the official act reproduced in the calendar is excluded from the firm's property, and a new item covers the edition date of publications (OWN-02).

### Not-found page

All legacy text kept; links to Home and Publications and the contact address added. Answers `404` for unknown paths, `/404` and `/404.html`.

## Documents and files

| Legacy file | Preview | Result |
|---|---|---|
| `/assets/docs/cartilha-eleicoes-2026.pdf` | `200` | Byte-identical |
| `/assets/docs/cartilha-propaganda-partidaria-2026.pdf` | `200` | Byte-identical |
| `/assets/docs/calendario-voz-do-brasil-2026.pdf` | `200` | Byte-identical (outdated letterhead, known issue, Q-12) |
| `/assets/images/publicacoes/capa-*.png` (3 files) | `200` | Byte-identical |
| `/assets/images/brand/*.png` (3 files), `/assets/icons/*.png` (3 files), `/assets/css/site.css`, `/assets/js/site.js` | `404` | Removed as planned in `url-map.md`; hotlink check is a Phase 8 item (`launch-checklist.md`) |
| `/robots.txt`, `/sitemap.xml` | `200` | Regenerated; the sitemap now lists all seven indexable pages with extensionless URLs |

Every page and redirect row of `url-map.md` answered as specified on the preview (single `301` to the final URL, `200` for kept paths, `404` for the not-found page and unknown paths).

## Findings

Two `keep` rows of the inventory are not on the new site and no decision records why. Neither loses a fact.

| Row | Legacy text | On the new site | Proposed default |
|---|---|---|---|
| H-04 | Hero eyebrow "Advocacia setorial · Brasília/DF" | Not shown. The `h1` states field and place: "Atuação em direito da radiodifusão, em Brasília, desde 2004." | Leave out; the facts are in the `h1`. Q-34. |
| E-03 | "Voltar ao início" link on the election booklet page | Replaced by the breadcrumb "Início" and the header navigation, as on the other publication pages. | Leave as is. Q-34. |

The other misses of the mechanical check are explained by the inventory itself: punctuation normalised (H-82, PR-05), area labels replaced by "type · year" (H-72, H-78, Q-19), copyright year (G-20), and legal-page rows superseded by the logged rewrites (PR-07, PR-09, PR-19, PR-20, PR-22, T-10, T-11, T-14, T-17).
