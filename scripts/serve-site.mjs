// The site under test for scripts/check-headers.mjs and scripts/check-redirects.mjs: dist/
// served by Wrangler's local runtime with the Worker's asset rules (_headers, _redirects,
// html_handling, not_found_handling), or, given a base URL, the live site.

// A browser navigation, so not_found_handling serves the 404 page.
const navigation = { "Sec-Fetch-Mode": "navigate", Accept: "text/html" };

/** @param {string | undefined} baseUrl */
export async function serveSite(baseUrl) {
  if (baseUrl) {
    const base = new URL(baseUrl);
    return {
      live: true,
      base,
      fetch: (/** @type {string} */ path) =>
        fetch(new URL(path, base), { redirect: "manual", headers: navigation }),
      dispose: async () => {},
    };
  }

  // No usage telemetry from CI or local test runs; set before Wrangler loads.
  process.env.WRANGLER_SEND_METRICS ??= "false";
  const { unstable_startWorker } = await import("wrangler");
  const worker = await unstable_startWorker({
    config: "wrangler.jsonc",
    dev: { server: { hostname: "127.0.0.1", port: 0 }, inspector: false, logLevel: "warn" },
  });
  await worker.ready;
  return {
    live: false,
    base: new URL("http://localhost"),
    // `_headers` rules can match on the host, so a check may pick the request host.
    fetch: (/** @type {string} */ path, host = "localhost") =>
      worker.fetch(`http://${host}${path}`, { redirect: "manual", headers: navigation }),
    dispose: () => worker.dispose(),
  };
}
