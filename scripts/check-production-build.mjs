// Fails if a plain `npm run build` (what production serves) contains the design specimen or a
// robots meta tag, or if pull request previews would lose their noindex.
import { existsSync, readFileSync } from "node:fs";
import { isIndexable } from "../src/config/indexing.ts";

const problems = [];

for (const file of ["dist/_design.html", "dist/_design/index.html"].filter(existsSync)) {
  problems.push(`Design specimen found in the production build: ${file}`);
}

for (const file of ["dist/index.html", "dist/privacidade.html"]) {
  if (/<meta name="robots"/.test(readFileSync(file, "utf8"))) {
    problems.push(`Robots meta tag found in the production build: ${file}`);
  }
}

// Workers Builds branches: main is production, any other branch is a preview.
const indexing = [
  [{}, true],
  [{ WORKERS_CI_BRANCH: "main" }, true],
  [{ WORKERS_CI_BRANCH: "feat/cutover" }, false],
];
for (const [env, expected] of indexing) {
  if (isIndexable(env) !== expected) {
    problems.push(`isIndexable(${JSON.stringify(env)}) should be ${expected}`);
  }
}

for (const problem of problems) console.error(problem);
console.log(
  problems.length === 0 ? "Production build is indexable and has no design specimen." : "",
);
process.exitCode = problems.length === 0 ? 0 : 1;
