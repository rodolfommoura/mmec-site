// @ts-check
/**
 * Adds the internal design specimen at `/_design` to every build except production.
 *
 * Included when:
 * - running `astro dev`;
 * - `DESIGN_SPECIMEN=true` is set (used by `npm run check` so CI tests the page);
 * - Workers Builds builds a branch other than `main` (`WORKERS_CI_BRANCH`), so pull request
 *   previews show it.
 *
 * Excluded from a plain `npm run build` and from builds of `main`, which is what production
 * will serve. Files under `src/pages/` that start with `_` are never routed by Astro, so the
 * page lives in `src/design-specimen/` and is injected here.
 */

/** @param {Record<string, string | undefined>} env */
export function isSpecimenEnabled(env, command = "build") {
  if (command === "dev") return true;
  if (env.DESIGN_SPECIMEN === "true") return true;
  const branch = env.WORKERS_CI_BRANCH;
  return Boolean(branch) && branch !== "main";
}

/** @returns {import("astro").AstroIntegration} */
export function designSpecimen() {
  return {
    name: "mmec-design-specimen",
    hooks: {
      "astro:config:setup": ({ command, injectRoute, logger }) => {
        if (!isSpecimenEnabled(process.env, command)) return;
        injectRoute({
          pattern: "/_design",
          entrypoint: "./src/design-specimen/specimen.astro",
          prerender: true,
        });
        logger.info("Design specimen included at /_design");
      },
    },
  };
}
