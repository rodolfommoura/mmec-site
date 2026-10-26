// Crawls the built site through `astro preview`, so links resolve the same way as on Workers.
import { existsSync } from "node:fs";
import { preview } from "astro";
import { LinkChecker } from "linkinator";

const port = 4322;
const origin = `http://localhost:${port}`;

// Pages linked from the header, footer and cards but built in a later phase
// (docs/decisions/0002-site-structure.md). Remove each entry when its page lands.
const plannedPaths = [
  "/publicacoes", // Phase 4
  "/publicacoes/cartilha-eleicoes-2026", // Phase 4
  "/publicacoes/cartilha-propaganda-partidaria-2026", // Phase 4
  "/publicacoes/calendario-voz-do-brasil-2026", // Phase 4
  "/privacidade", // Phase 4
  "/termos", // Phase 4
];

// The design specimen is not linked from any page, so it is crawled as a second start page.
const startPaths = existsSync("dist/_design.html") ? ["/", "/_design"] : ["/"];

const server = await preview({ server: { port }, logLevel: "warn" });

try {
  const result = await new LinkChecker().check({
    path: startPaths.map((path) => `${origin}${path}`),
    recurse: true,
    linksToSkip: async (url) => {
      // External links (maps, WhatsApp) are not fetched: third-party responses make CI flaky.
      if (!url.startsWith(origin)) return true;
      return plannedPaths.includes(new URL(url).pathname);
    },
  });
  const broken = result.links.filter((link) => link.state === "BROKEN");
  for (const link of broken) {
    console.error(`BROKEN ${link.status ?? "-"} ${link.url} (from ${link.parent ?? "-"})`);
  }
  const skipped = result.links.filter((link) => link.state === "SKIPPED").length;
  console.log(`Checked ${result.links.length} links, ${broken.length} broken, ${skipped} skipped.`);
  process.exitCode = result.passed ? 0 : 1;
} finally {
  await server.stop();
}
