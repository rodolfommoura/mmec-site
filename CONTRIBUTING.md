# Contributing

The detailed rules live in [`CLAUDE.md`](CLAUDE.md). Summary for humans and agents:

## Workflow

1. Branch from an up-to-date `main`: `feat/…`, `fix/…`, `chore/…` or `docs/…`, short and lowercase with hyphens.
2. Make small, focused commits using [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): subject`. Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`. Subject in imperative mood, at most 72 characters, no trailing period.
3. Run `npm run check` locally (available from Phase 1).
4. Open a pull request using the template. One logical change per PR.
5. CI must pass and every conversation must be resolved. The author does not merge their own agent-generated work without reading it.
6. Merge with **squash**; the squash title must itself be a valid Conventional Commit.

## Rules that are never bent

- Never push directly to `main`; never force-push shared branches.
- No secrets, tokens or personal data in commits. If one slips in, rotate it first, then clean the history.
- No content on the site without a source in `docs/content-sources.md`.
- Brand rules in `docs/brand.md` apply to every visual change.

## Releases

Semantic Versioning for the site. Tag releases `vMAJOR.MINOR.PATCH` on `main` and record them in `docs/CHANGELOG.md` (Keep a Changelog format). The first public release is `v2.0.0`, because `v1.x` is the legacy site.
