import { expect, test } from "@playwright/test";
import { listPagePaths } from "../scripts/pages.mjs";

for (const path of [...listPagePaths(), "/404"]) {
  test(`no console errors on ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}
