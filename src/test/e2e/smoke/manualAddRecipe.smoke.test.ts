import { test, expect } from "@playwright/test";
import { uniqueTitle } from "../helpers";

test("@smoke create recipe via manual form, then find it in grid and open detail", async ({ page }) => {
  // Start logged-in (storageState from setup)
  await page.goto("/new");

  const title = uniqueTitle();

  // Details section — Title (label is present, but the input also has a helpful placeholder)
  await page.getByPlaceholder("e.g. Grandma’s Best Lasagna").fill(title);

  // Ingredients — first input has class 'ingredient-input' and optional placeholder
  const ing = page.locator("input.ingredient-input").first();
  await ing.fill("250g dried pasta");

  // Steps — first input has class 'step-input'
  const step = page.locator("input.step-input").first();
  await step.fill("Boil pasta");

  // Publish (bottom sticky bar)
  const publishBtn = page.getByRole("button", { name: "Publish" });
  await expect(publishBtn).toBeEnabled();
  await publishBtn.click();

  // After publish, client navigates to /view/[slug]
  await expect(page).toHaveURL(/\/view\//);
  await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();

  // Go to the owner's grid page.
  // (Your grid server component currently lives at /all; it protects unauthenticated users.)
  await page.goto("/all");

  // Card shows title as an <h3>, and the whole card is clickable via a Link with aria-label "Open <title>"
  await expect(page.getByRole("heading", { level: 3, name: title })).toBeVisible();
  await page.getByRole("link", { name: `Open ${title}` }).click();

  // Back on the detail page
  await expect(page).toHaveURL(/\/view\//);
  await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
});
