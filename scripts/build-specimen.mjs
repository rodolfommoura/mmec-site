// Builds the site with the internal design specimen at /_design, as on pull request previews.
// Used by `npm run check` so the specimen is linted, link-checked and tested with axe.
import { build } from "astro";

process.env.DESIGN_SPECIMEN = "true";
await build({});
