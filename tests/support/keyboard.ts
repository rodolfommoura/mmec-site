import type { Page } from "@playwright/test";

/**
 * WebKit follows Safari, where Tab skips links unless the user turns on "Press Tab to highlight
 * each item"; Option+Tab (Alt in Playwright) always includes them, but only the macOS build maps
 * it. The Windows and Linux WebKit builds cannot reach a link from the keyboard at all, so a Tab
 * walk there says nothing about the site.
 */
export const tabWalkUnsupported = (browserName: string): boolean =>
  browserName === "webkit" && process.platform !== "darwin";

export const tabWalkSkipReason = "this WebKit build cannot Tab to links (Safari: Option+Tab)";

/** Moves focus to the next link or control, as a keyboard user of each engine would. */
export async function pressFocusNext(page: Page): Promise<void> {
  const isWebKit = page.context().browser()?.browserType().name() === "webkit";
  await page.keyboard.press(isWebKit ? "Alt+Tab" : "Tab");
}
