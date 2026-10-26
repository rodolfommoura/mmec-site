# URL map

Every public URL of the legacy site and what happens to it in the rebuild. `CLAUDE.md` rule 8: old public URLs keep working, either served at the same path or redirected with `301` (`public/_redirects`).

## How the legacy site answers today

Checked against `https://mmec.adv.br` on 2026-10-26 with `curl` (no redirect following):

- The Worker serves `public/` with Cloudflare's default `html_handling`. Pages are canonical **without** the extension: `/privacidade` answers `200`, while `/privacidade.html` answers `307` to `/privacidade`. A trailing slash (`/cartilha-eleicoes-2026/`) also answers `307` to the extensionless form.
- `/index.html` and `/index` answer `307` to `/`.
- The only explicit rule is `/cartilha-eleicoes-2024.html` → `/cartilha-eleicoes-2026.html` (`301`), which then answers `307` again: a two-hop chain. `/cartilha-eleicoes-2024` (no extension) answers `404`.
- Unknown paths answer `404` with `404.html`; `/404.html` itself answers `307` to `/404`.
- `_headers` and `_redirects` are configuration files and are not served (`404`).
- `sitemap.xml` lists the `.html` forms, so search engines know both forms.

Both the `.html` and the extensionless forms are therefore public and are covered below.

## New URL scheme

- Lowercase, Portuguese, hyphens, no accents, **no extension and no trailing slash** (same convention the legacy site already uses), as set out in `docs/naming.md`.
- Publications move under `/publicacoes/`. See [`decisions/0002-site-structure.md`](decisions/0002-site-structure.md).
- Every redirect is a single hop straight to the final URL (no chains).

## Pages

| Old URL | Fate | New URL | Status code | Note |
|---|---|---|---|---|
| `/` | kept | `/` | 200 | |
| `/index.html`, `/index` | redirected | `/` | 301 | Today `307`; the new rule makes it permanent. |
| `/cartilha-eleicoes-2026` | redirected | `/publicacoes/cartilha-eleicoes-2026` | 301 | Canonical legacy form. |
| `/cartilha-eleicoes-2026.html` | redirected | `/publicacoes/cartilha-eleicoes-2026` | 301 | Linked from the legacy sitemap and home. |
| `/cartilha-eleicoes-2024.html` | redirected | `/publicacoes/cartilha-eleicoes-2026` | 301 | Keeps the legacy rule, without the second hop. |
| `/cartilha-eleicoes-2024` | redirected | `/publicacoes/cartilha-eleicoes-2026` | 301 | `404` today; added for consistency with the `.html` rule. |
| `/cartilha-propaganda-partidaria-2026` | redirected | `/publicacoes/cartilha-propaganda-partidaria-2026` | 301 | |
| `/cartilha-propaganda-partidaria-2026.html` | redirected | `/publicacoes/cartilha-propaganda-partidaria-2026` | 301 | |
| `/calendario-voz-do-brasil-2026` | redirected | `/publicacoes/calendario-voz-do-brasil-2026` | 301 | |
| `/calendario-voz-do-brasil-2026.html` | redirected | `/publicacoes/calendario-voz-do-brasil-2026` | 301 | |
| `/privacidade` | kept | `/privacidade` | 200 | |
| `/privacidade.html` | redirected | `/privacidade` | 301 | Today `307`. |
| `/termos` | kept | `/termos` | 200 | |
| `/termos.html` | redirected | `/termos` | 301 | Today `307`. |
| `/404`, `/404.html` | kept as the not-found page | none | 404 | Served for any unknown path. Direct requests answer `404`, not `200`. |
| any path with a trailing slash | redirected | same path without the slash | 301 | Platform behaviour; Phase 1 confirms the `html_handling` setting. |

## Home page anchors

Fragments are never sent to the server, so they cannot be redirected. The new home keeps the same `id` values so that old links still land on the right section.

| Old anchor | Fate | Note |
|---|---|---|
| `/#inicio` | kept | `id` on the top of `main` (or the first section). |
| `/#topo` | kept | `id` on the header. |
| `/#escritorio` | kept | Office section. |
| `/#atuacao` | kept | Practice areas. |
| `/#inteligencia` | kept | `id` on the publications teaser, now titled "Publicações" (Q-14). |
| `/#contato` | kept | Contact section. |
| `/#conteudo-principal` | kept | Skip-link target on `main`. |
| `/#area-1` to `/#area-6` | kept | `id` on each practice area, in the same order (the tabs go; the ids stay). |

## Documents

PDF links are the most likely to be shared outside the site (email, messaging, other sites), so they keep their exact paths.

| Old URL | Fate | New URL | Note |
|---|---|---|---|
| `/assets/docs/cartilha-eleicoes-2026.pdf` | kept | same | Served unchanged, byte for byte. |
| `/assets/docs/cartilha-propaganda-partidaria-2026.pdf` | kept | same | Served unchanged. |
| `/assets/docs/calendario-voz-do-brasil-2026.pdf` | kept | same | Served unchanged; may be replaced at the same path (Q-12). |

## Images, icons, styles and scripts

| Old URL | Fate | Target | Note |
|---|---|---|---|
| `/assets/images/publicacoes/capa-cartilha-eleicoes-2026.png` | kept or redirected | new cover file | Phase 4 decides the optimised file; the old path must still answer (`200` or `301`). |
| `/assets/images/publicacoes/capa-propaganda-partidaria-2026.png` | kept or redirected | new cover file | Same rule. |
| `/assets/images/publicacoes/capa-calendario-voz-do-brasil-2026.png` | kept or redirected | new cover file | Same rule. |
| `/assets/images/brand/logo-horizontal.png` | removed | none | Replaced by the brand-folder files. Before cutover, check that no email signature or external page hotlinks it (Phase 8 checklist). |
| `/assets/images/brand/logo-vertical.png` | removed | none | Same check. |
| `/assets/images/brand/simbolo.png` | removed | none | Same check. |
| `/assets/icons/favicon-32x32.png` | removed | none | New icons are linked from each page. |
| `/assets/icons/favicon-192x192.png` | removed | none | |
| `/assets/icons/apple-touch-icon.png` | removed | none | New `apple-touch-icon` is linked from each page. |
| `/assets/css/site.css` | removed | none | Build output gets hashed names. |
| `/assets/js/site.js` | removed | none | |

## Crawling files

| Old URL | Fate | Note |
|---|---|---|
| `/robots.txt` | kept | Regenerated; still points to the sitemap. |
| `/sitemap.xml` | kept | Regenerated with the new URLs only, including privacy, terms and the publications index (TF-04). |

## New URLs (no legacy equivalent)

| New URL | Reason |
|---|---|
| `/publicacoes` | Publications index. See [`decisions/0002-site-structure.md`](decisions/0002-site-structure.md). |
| `/equipe` | **Reserved for Phase 9. Not built.** Until then it answers `404` like any unknown path; nothing links to it. |

## Draft `_redirects` (implemented in Phase 1 or 4, not in this phase)

```text
/index.html                                 /                                                 301
/index                                      /                                                 301
/cartilha-eleicoes-2024.html                /publicacoes/cartilha-eleicoes-2026               301
/cartilha-eleicoes-2024                     /publicacoes/cartilha-eleicoes-2026               301
/cartilha-eleicoes-2026.html                /publicacoes/cartilha-eleicoes-2026               301
/cartilha-eleicoes-2026                     /publicacoes/cartilha-eleicoes-2026               301
/cartilha-propaganda-partidaria-2026.html   /publicacoes/cartilha-propaganda-partidaria-2026  301
/cartilha-propaganda-partidaria-2026        /publicacoes/cartilha-propaganda-partidaria-2026  301
/calendario-voz-do-brasil-2026.html         /publicacoes/calendario-voz-do-brasil-2026        301
/calendario-voz-do-brasil-2026              /publicacoes/calendario-voz-do-brasil-2026        301
/privacidade.html                           /privacidade                                      301
/termos.html                                /termos                                           301
```

Phase 1 must confirm on the preview Worker that `_redirects` rules run before `html_handling`, so that `.html` paths give one `301` and not a `307` followed by a `301`. The link test (`npm run test:links`) checks every row of this file.
