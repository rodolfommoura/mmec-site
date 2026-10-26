# GitHub repository settings (intended state)

Settings cannot be stored in Git, so this file documents what the repository must look like. Check it after creating the repository and after any plan change.

## General

- Name: `mmec-site`. Default branch: `main`. Visibility: see "Plan note" below.
- Pull requests: allow **squash merging only**; default commit message = "Pull request title and description"; disable merge commits and rebase merging.
- Automatically delete head branches after merge: on.
- Auto-merge: off. Issues and Wiki: off (use `docs/open-questions.md`).

## Ruleset (or classic branch protection) on `main`

- Require a pull request before merging; required approvals: 0 while the owner is the only maintainer (GitHub does not let an author approve their own PR); raise to 1 when a second maintainer, for example the developer, joins.
- Require conversation resolution before merging.
- Require status checks to pass (the CI job from Phase 1) and require branches to be up to date.
- Require linear history.
- Block force pushes and branch deletion. Do not allow bypass, including for administrators.

## Security

- Dependabot alerts and Dependabot security updates: on.
- Secret scanning and push protection: on where the plan allows.
- Private vulnerability reporting: on.
- Actions: restrict to GitHub-owned and explicitly allowed actions; default workflow permissions "read repository contents".

## Plan note

On a free personal account, branch protection and rulesets are not available for **private** repositories (they are for public ones), and some security features need a paid plan. Choose one:

1. Keep the repository private and upgrade the account to a plan that supports protected branches.
2. Make the repository public. The site content, brand and publications are public anyway; keep anything internal (for example private business notes) out of the repository.
3. Stay private on the free plan and rely on discipline plus the local agent rules in `.claude/settings.json`. Not recommended: nothing server-side stops a direct push to `main`.

## Cloudflare

- Workers Builds connects this repository to the Worker `mmec-site` (production branch `main`, non-production branches build previews). The production Worker `mmec` stays connected to `mmec-site-legacy` until the cutover (Phase 8).
