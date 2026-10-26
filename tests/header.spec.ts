import { expect, test } from "@playwright/test";

const phone = { width: 375, height: 740 };

test.describe("mobile menu", () => {
  test.use({ viewport: phone });

  test("collapses behind a Menu button and closes with Escape", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menu" });
    const firstLink = page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "O escritório" });

    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(firstLink).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(firstLink).toBeVisible();

    await firstLink.focus();
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
    await expect(firstLink).toBeHidden();
  });
});

// Q-23: the 300 px minimum applies to the visible artwork, which spans 3020 of the 3600 units.
for (const width of [360, 375, 390]) {
  test(`keeps the logo artwork at its 300 px minimum at ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 740 });
    await page.goto("/");
    const box = await page.locator(".site-header img").first().boundingBox();
    // Layout units round to 1/64 px, so allow half a pixel.
    expect(((box?.width ?? 0) * 3020) / 3600).toBeGreaterThan(299.5);
  });
}

test.describe("mobile menu without JavaScript", () => {
  test.use({ viewport: phone, javaScriptEnabled: false });

  test("shows every navigation link and no button", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Navegação principal" });
    await expect(nav.getByRole("button", { name: "Menu" })).toBeHidden();
    for (const name of ["O escritório", "Atuação", "Publicações", "Contato"]) {
      await expect(nav.getByRole("link", { name })).toBeVisible();
    }
  });
});

test("desktop navigation has no Menu button", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
  await expect(page.getByRole("link", { name: "Publicações" }).first()).toBeVisible();
});

test("skip link is the first focusable element and moves focus to the main content", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Ir para o conteúdo" });
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});
