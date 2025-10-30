import { test, expect } from "@playwright/test";
import { uniqueTitle } from "./helpers";

test.describe("@smoke create and view recipe", () => {
  test("@smoke create recipe via manual form, then find it in grid and open detail", async ({ page }) => {
    // Start logged-in (storageState from setup)
    await page.goto("/new");

    const title = uniqueTitle();

    // Fill minimal required fields
    await page.getByLabel("Title").fill(title);
    await page.getByLabel("Description").fill("A quick test recipe");

    // Optional fields (ingredients/steps no longer required)
    // If inputs exist, fill the first ones for visual confirmation
    // const ingredient = page.locator("input.ingredient-input").first();
    // if (await ingredient.count()) {
    //   await ingredient.fill("1 tbsp olive oil");
    // }

    // const step = page.locator("input.step-input").first();
    // if (await step.count()) {
    //   await step.fill("Mix all ingredients together");
    // }

    // Save recipe
    const saveBtn = page.getByRole("button", { name: "Save" });
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();

    // Expect redirect to view page
    await expect(page).toHaveURL(/\/view\//);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();

    // Navigate to recipe library and open card
    await page.goto("/all");

    // Card should exist with heading and accessible link
    const cardHeading = page.getByRole("heading", { level: 3, name: title });
    await expect(cardHeading).toBeVisible();

    const openLink = page.getByRole("link", { name: `Open ${title}` });
    await openLink.click();

    // Back on detail page
    await expect(page).toHaveURL(/\/view\//);
    await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  });
});
