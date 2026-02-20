import { test, expect } from "@playwright/test";
import { uniqueTitle } from "../helpers";

test("create recipe manually, then verify it on the view page", async ({
  page,
}) => {
  const title = uniqueTitle();
  const description = "A simple test recipe";
  const ingredient = "250g dried pasta";
  const step = "Boil pasta until al dente";

  // Go to new recipe form
  await page.goto("/add");
  await expect(page.getByRole("heading", { name: "Details" })).toBeVisible();

  // Fill in details
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Description").fill(description);

  // Add an ingredient
  await page.getByLabel("Ingredient 1").fill(ingredient);

  // Add a step
  await page.getByLabel("Step 1").fill(step);

  // Save
  await page.getByRole("button", { name: "Save" }).click();

  // Redirected to view page
  await expect(page).toHaveURL(/\/view\//);
  await expect(
    page.getByRole("heading", { level: 1, name: title }),
  ).toBeVisible();

  // All entered content is visible on the view page
  await expect(page.getByText(description)).toBeVisible();
  await expect(page.getByText(ingredient)).toBeVisible();
  await expect(page.getByText(step)).toBeVisible();
});
