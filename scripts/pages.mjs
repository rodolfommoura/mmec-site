import { readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const distDir = "dist";

/** Public URL paths of every built HTML page, except the not-found page. */
export function listPagePaths() {
  return readdirSync(distDir, { recursive: true })
    .filter((file) => file.endsWith(".html") && file !== "404.html")
    .map((file) => relative(distDir, join(distDir, file)).split(sep).join("/"))
    .map((file) => "/" + file.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, ""))
    .map((path) => (path.length > 1 ? path.replace(/\/$/, "") : path))
    .sort();
}
