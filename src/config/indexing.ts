/**
 * Whether a build may be indexed by search engines (robots meta tag in BaseLayout).
 *
 * Workers Builds sets `WORKERS_CI_BRANCH`: builds of `main` are production, any other branch is
 * a pull request preview and stays `noindex`. Builds outside Workers Builds (local, GitHub CI)
 * have no branch and match production, as for the design specimen
 * (src/integrations/design-specimen.mjs). The `*.workers.dev` hosts also get
 * `X-Robots-Tag: noindex` from public/_headers, whatever the build.
 */
export function isIndexable(env: Record<string, string | undefined>): boolean {
  const branch = env.WORKERS_CI_BRANCH;
  return !branch || branch === "main";
}
