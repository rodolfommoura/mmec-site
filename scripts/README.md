# scripts

Node scripts used by the npm scripts in `package.json`.

- `check-links.mjs`: `npm run test:links`. Starts `astro preview` on the built `dist/` and crawls every internal link with linkinator.
- `check-redirects.mjs`: second half of `npm run test:links`. Serves `dist/` with Wrangler's local runtime (same `_redirects`, `html_handling` and `not_found_handling` as the Worker) and checks every legacy URL listed in `docs/url-map.md`: kept paths answer `200`, redirects answer a single `301` to the right target, removed paths and the not-found page answer `404`. With a base URL (`node scripts/check-redirects.mjs https://mmec.adv.br`, part of `npm run test:production`) it checks the live site instead.
- `check-headers.mjs`: `npm run test:headers`. Serves `dist/` with Wrangler's local runtime (same `_headers` as the Worker) and checks the security headers, cache headers and content types on a sample of paths (`docs/security.md`), and that `X-Robots-Tag` is sent on `*.workers.dev` hosts only. With a base URL it checks the live site (part of `npm run test:production`; build `dist/` from the deployed commit first).
- `serve-site.mjs`: shared by the two scripts above: `dist/` through Wrangler's local runtime, or the live site for a base URL.
- `pages.mjs`: lists the URL paths of the built pages, shared by the accessibility tests.
- `build-specimen.mjs`: `npm run build:specimen`. Builds with the internal design specimen at `/_design` (`DESIGN_SPECIMEN=true`).
- `check-production-build.mjs`: run by `npm run check` after `npm run build`; fails if the specimen or a robots meta tag is in a production build, or if the branch rule of `src/config/indexing.ts` would make previews indexable.
- `check-design-literals.mjs`: `npm run lint:design`, part of `npm run lint`. Fails when CSS outside `src/styles/tokens.css` hard-codes a colour, font, length or duration, or a breakpoint that is not a `--breakpoint-*` token.
- `strip-brand-metadata.mjs`: run by hand after copying files from the brand folder. Removes C2PA content-credential metadata from `public/brand/` and `public/favicon.svg` and compacts SVG path data without changing coordinates.
- `verify-brand-artwork.mjs`: run by hand after the previous script, `node scripts/verify-brand-artwork.mjs [git-ref]`. Compares every brand file with a Git ref (default `main`): SVG path numbers, Chromium renders and PNG pixels must be identical.
- `audit-content-text.mjs`: run by hand after `npm run build`, `node scripts/audit-content-text.mjs`. Extracts every visible text segment and text attribute (alt, aria-label, title, meta descriptions) from `dist/` and lists the segments not quoted verbatim in `docs/content-sources.md`, for the content audit in `docs/staging-review.md`.

## Phase runner (`run-phases.ps1`)

PowerShell script (Windows PowerShell 5.1 or later) that runs phases 2 to 7 unattended with Claude Code in headless mode, one fresh session per phase. It is run by the owner, not by npm. See `docs/process.md` for when to use it.

```powershell
.\scripts\run-phases.ps1 -From 2 -To 7
.\scripts\run-phases.ps1 -From 4 -To 7 -ApproveFirst
```

- `-From`, `-To`: first and last phase to run (2 to 7).
- `-ApproveFirst`: merge the open pull request of phase `From - 1` before starting (after you reviewed a gated phase).
- `-PermissionMode` (default `auto`) and `-Model` are passed to `claude`.

It needs `git`, `gh` (logged in) and `claude` in `PATH`, and a clean working tree. Logs go to `../mmec-phase-logs/` (a sibling of the repository folder, outside Git).
