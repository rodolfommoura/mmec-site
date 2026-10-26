# Naming conventions

Mirrors the office guideline "Diretrizes e Regras do Drive MMEC" (section 8, Outras plataformas). Two lanes: what office staff read is Portuguese; what is technical is English.

| Where | Rule | Examples |
|---|---|---|
| Project base name | One base name per project, reused everywhere | `mmec-site` |
| Local folder (Windows) | `C:\Users\User\projects\<name>`, lowercase, hyphens, never inside a Google Drive synced folder | `mmec-site`, `mmec-site-legacy` |
| GitHub repository | `mmec-` + purpose | `mmec-site`, `mmec-site-legacy` |
| Git branch | `type/short-description`, lowercase, hyphens. Types as in Conventional Commits | `feat/home`, `chore/foundation` |
| Git tag | `vMAJOR.MINOR.PATCH` (rebuild starts at `v2.0.0`) | `v2.0.0` |
| Commits and PRs | English, Conventional Commits | `feat(home): add hero section` |
| Cloudflare Worker | Same name as the repository | `mmec-site` |
| Domains | Lowercase | `mmec.adv.br` |
| URLs (site pages) | Portuguese, lowercase, hyphens, no accents | `/publicacoes/cartilha-eleicoes-2026` |
| Code, CSS classes, assets, fonts | English, lowercase, hyphens, no accents or spaces | `mmec-logo-horizontal-ink.svg` |
| Visible page copy | Portuguese (pt-BR), with accents | |
| Analytics events and parameters | English, lowercase, snake_case | `download_pdf` |
| Campaign values (UTM) | Lowercase with hyphens | `eleicoes-2026` |
| Brand files | `mmec-<element>-<variant>`; variants `ink`, `cream`, `on-cream`, `reverse`; see `docs/brand.md` | `mmec-symbol-cream.png` |

Rules:

- Do not rename anything connected to another system (the repository bound to Cloudflare, the Worker, the domain) before checking the connection.
- Create nothing in advance: no empty folders, projects or properties "for later".
- Technical folders carry a `README.md`.
