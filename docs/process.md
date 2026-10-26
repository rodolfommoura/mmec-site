# Working process (kickoff pack)

This folder is a starter kit. It contains the rules, the reviewer agent and one prompt file per phase for rebuilding `mmec.adv.br` with Claude Code. The old repository `rodolfommoura/mmec-site-legacy` stays untouched.

## One-time setup (about 15 minutes)

1. On GitHub, rename the old repository `site_mmec` to `mmec-site-legacy` (Settings, General, Repository name). Deployments are not affected: Cloudflare Workers Builds binds to the repository ID. Afterwards check that the Worker `mmec` still shows its builds in the Cloudflare dashboard.
2. Create a new GitHub repository `mmec-site`: empty (no README, no licence, no .gitignore), default branch `main`. See `docs/repository-settings.md` for the visibility choice (it affects branch protection).
3. On your computer, create a work folder with two sibling folders:
   - `mmec-site-legacy` : a fresh clone of the OLD repository. Read-only reference. Never edit it.
   - `mmec-site` : a clone of the NEW empty repository.
4. Copy everything from this seed into `mmec-site` (including the hidden `.claude` and `.github` folders), then make the initial commit:
   ```
   git add .
   git commit -m "chore: initial project scaffolding"
   git push -u origin main
   ```
   This is the only direct push to `main`.
5. Configure the repository exactly as described in `docs/repository-settings.md` (squash-only merges, ruleset on `main`, security features).
6. Brand files are copied in Phase 1 (from the Drive folder `Marca/standardized`, folders `svg` and `png`).
7. Open a terminal in `mmec-site` and start Claude Code with `claude`. It reads `CLAUDE.md` automatically.

## How to run each phase

1. Open `docs/phases/NN-name.md` and paste its **Prompt** section into Claude Code. Nothing else.
2. Claude Code works on a branch, runs the checks, calls the `reviewer` agent, fixes what the reviewer blocks, opens a pull request and stops.
3. You do the **Human gate** listed in the phase file (look at the preview, read the copy, approve or comment on the PR).
4. Merge the PR yourself on GitHub (squash). Then start a fresh Claude Code session (`/clear`) and paste the next phase.

Rules of thumb:

- One phase per session. Never ask for two phases at once.
- If Claude Code asks a question, answer it in the session, or write it in `docs/open-questions.md`.
- If a result looks generic, say exactly what is wrong and point to `docs/brand.md`. Do not ask for "more modern".
- Nothing is deployed to the real domain until Phase 8.

## Phases

| # | File | Result | Human gate |
|---|---|---|---|
| 0 | `00-discovery.md` | Content inventory, sitemap, risk list. No code. | Approve sitemap and copy sources |
| 1 | `01-foundation.md` | Repo, tooling, CI, empty site on preview Worker | Approve the setup |
| 2 | `02-design-foundations.md` | Tokens, fonts, logo, base components | Approve the look |
| 3 | `03-home.md` | Home page | Approve layout and copy |
| 4 | `04-publications-legal.md` | Publications, privacy, terms, 404 | Approve copy and legal text |
| 5 | `05-security-privacy-seo.md` | Headers, CSP, analytics decision, SEO | Decide analytics |
| 6 | `06-accessibility-performance.md` | Audit and fixes | Approve results |
| 7 | `07-staging-review.md` | Full independent review on the preview URL | Final content sign-off |
| 8 | `08-cutover.md` | Switch the domain, with rollback plan | Go / no-go |
| 9 | `09-team-pages.md` | Backlog: team pages | Later |

## Honest limits of the "AI reviews the AI" setup

The reviewer agent catches many mechanical problems (contrast, headings, invented text patterns, git hygiene). It shares blind spots with the builder. Three things always need a human: legal wording of the copy, visual taste, and the final domain switch.

## Running phases 2 to 7 with the phase runner

Instead of pasting each prompt by hand, the owner can run `scripts/run-phases.ps1` from the repository root in PowerShell. It needs `git`, `gh` (run `gh auth login` first) and `claude` in `PATH`, and a clean working tree.

```powershell
.\scripts\run-phases.ps1 -From 2 -To 7
```

- `-From` and `-To` choose the first and last phase (2 to 7). Phases 0, 1 and 8 are never run by the script.
- For each phase it updates `main`, runs Claude Code headless with the phase prompt plus unattended-run rules, finds the pull request, checks that the reviewer verdict is APPROVE, waits for CI and squash-merges it.
- **Three human gates:** after phases 3, 4 and 7 the script leaves the pull request open and stops. Review it as described in the phase file's Human gate section. To approve and continue, run the command it prints, for example `.\scripts\run-phases.ps1 -From 4 -To 7 -ApproveFirst`; `-ApproveFirst` merges the pull request of the previous phase before starting. Phase 7 is merged by hand after your written go; Phase 8 is always started by hand in an interactive session.
- It also stops when Claude Code reports `BLOCKED:`, when a step needs the owner (`NEEDS_OWNER:` lines, such as tokens or verification codes), when a check fails or when the verdict is missing.
- Each run writes a log to `../mmec-phase-logs/phase-NN-<timestamp>.log`, a folder next to the repository, outside Git.
