# Security policy

## Reporting a vulnerability

Please do not open a public issue. Use GitHub's **private vulnerability reporting** ("Security" tab, "Report a vulnerability") on this repository. A dedicated security contact address will be published at `/.well-known/security.txt` once the site is live.

## Scope

The static website served at `mmec.adv.br` and the build pipeline in this repository. The site has no login, database or forms; the main concerns are supply-chain integrity, headers, and the Cloudflare configuration.

## Practices

- Dependencies are locked and reviewed; Dependabot is enabled for npm and GitHub Actions.
- GitHub Actions are pinned by commit SHA and run with least-privilege permissions.
- No secrets are stored in the repository.
