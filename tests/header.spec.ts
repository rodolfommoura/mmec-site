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

  test("keeps the logo at its 300 px minimum", async ({ page }) => {
    await page.goto("/");
    const logo = page.locator(".site-header img").first();
    const box = await logo.boundingBox();
    expect(box?.width).toBe(300);
  });
});

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
