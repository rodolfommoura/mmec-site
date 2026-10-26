# scripts

Node scripts used by the npm scripts in `package.json`.

- `check-links.mjs`: `npm run test:links`. Starts `astro preview` on the built `dist/` and crawls every internal link with linkinator.
- `pages.mjs`: lists the URL paths of the built pages, shared by the accessibility tests.
