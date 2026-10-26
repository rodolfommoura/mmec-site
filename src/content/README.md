# content

Content collections, defined in `src/content.config.ts`.

## publications

One Markdown file per publication. The file name is the URL slug: `cartilha-eleicoes-2026.md` is served at `/publicacoes/cartilha-eleicoes-2026`. Pages, the index at `/publicacoes` and the home page cards are generated from these files.

To add an edition (for example the 2027 calendar), with no code change:

1. Copy the PDF, unchanged, to `public/assets/docs/<slug>.pdf`.
2. Optionally copy its cover to `src/assets/publications/<slug>-cover.png`.
3. Copy an existing Markdown file to `src/content/publications/<slug>.md` and fill in every field. All copy must trace to `docs/content-sources.md`. Set `pages` to the PDF's page count; the size is read from the file at build time.
4. Add a row to `docs/content-sources.md` for the new document and its copy.
5. Run `npm run check`. The build fails if a field is missing or the PDF is not found; the tests fail if `pages` does not match the PDF.

Ordering: newest `year` first, then `order` within the same year. Older editions stay online at their URLs.
