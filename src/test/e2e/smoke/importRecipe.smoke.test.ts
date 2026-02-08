import { test, expect } from "@playwright/test";


test.only("import recipe from URL, view it, then find it in the grid", async ({ page }) => {
  
  const testUrl = "https://www.recipetineats.com/chilli-lime-fish/";
  
  // Go to import page
  await page.goto("/import");
  await expect(page.getByRole("heading", { name: "Import a recipe" })).toBeVisible();

  // Fill in URL and submit
  await page.getByLabel("Recipe URL").fill(testUrl);
  await page.getByRole("button", { name: "Import" }).click();

  // Redirected to view page after import completes
  await expect(page).toHaveURL(/\/view\//, { timeout: 15_000 });

  // Recipe title is visible
  const title = await page.getByRole("heading", { level: 1 }).textContent();
  expect(title).toBeTruthy();

  // Navigate to all recipes and verify the card appears
  await page.goto("/all");
  await expect(page.getByRole("heading", { level: 3, name: title! })).toBeVisible();
});
