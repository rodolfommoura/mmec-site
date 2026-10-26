// Crawls the built site through `astro preview`, so links resolve the same way as on Workers.
import { preview } from "astro";
import { LinkChecker } from "linkinator";

const port = 4322;
const server = await preview({ server: { port }, logLevel: "warn" });

try {
  const result = await new LinkChecker().check({
    path: `http://localhost:${port}/`,
    recurse: true,
  });
  const broken = result.links.filter((link) => link.state === "BROKEN");
  for (const link of broken) {
    console.error(`BROKEN ${link.status ?? "-"} ${link.url} (from ${link.parent ?? "-"})`);
  }
  console.log(`Checked ${result.links.length} links, ${broken.length} broken.`);
  process.exitCode = result.passed ? 0 : 1;
} finally {
  await server.stop();
}
