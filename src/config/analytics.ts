// Cloudflare Web Analytics (docs/decisions/0003-analytics.md). Manual setup: the beacon is
// loaded by BaseLayout only when a site token is set, and the Content-Security-Policy allows
// its two hosts only then (src/integrations/csp-headers.mjs).

interface WebAnalytics {
  /** Site token from the Cloudflare dashboard (public, printed in the HTML). Empty: no beacon. */
  token: string;
  scriptUrl: string;
  /** Host of the beacon script (CSP script-src). */
  scriptOrigin: string;
  /** Endpoint the beacon posts to in a manual setup (CSP connect-src). */
  reportOrigin: string;
}

export const webAnalytics: WebAnalytics = {
  // Existing Web Analytics site for mmec.adv.br, provided by the owner (Q-29).
  token: "29be01cd60f149a9be4d8ea0b7236dc4",
  scriptUrl: "https://static.cloudflareinsights.com/beacon.min.js",
  scriptOrigin: "https://static.cloudflareinsights.com",
  reportOrigin: "https://cloudflareinsights.com",
};
