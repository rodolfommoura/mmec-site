# scripts

Node scripts used by the npm scripts in `package.json`.

- `check-links.mjs`: `npm run test:links`. Starts `astro preview` on the built `dist/` and crawls every internal link with linkinator.
- `pages.mjs`: lists the URL paths of the built pages, shared by the accessibility tests.

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
