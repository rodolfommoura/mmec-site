// Fails if a plain `npm run build` (what production serves) contains the design specimen.
import { existsSync } from "node:fs";

const leaked = ["dist/_design.html", "dist/_design/index.html"].filter((file) => existsSync(file));
for (const file of leaked) console.error(`Design specimen found in the production build: ${file}`);
console.log(leaked.length === 0 ? "Production build has no design specimen." : "");
process.exitCode = leaked.length === 0 ? 0 : 1;
