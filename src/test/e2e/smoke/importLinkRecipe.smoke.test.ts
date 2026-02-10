import { test, expect } from "@playwright/test";
import { uniqueTitle } from "../helpers";

test("import denylisted URL as link card, edit details and add tag, verify in grid", async ({
  page,
}) => {
  const testUrl = "https://www.allrecipes.com/recipe/12345/test-recipe/";
  const title = uniqueTitle();
  const description = "A quick smoke-test link card";
  const tag = "Smoke";

  // Go to import page
  await page.goto("/import");
  await expect(
    page.getByRole("heading", { name: "Import a recipe" }),
  ).toBeVisible();

  // Fill in URL and submit
  await page.getByLabel("Recipe URL").fill(testUrl);
  await page.getByRole("button", { name: "Import" }).click();

  // Redirected to link card page (server fetches OG data, hits denylist, redirects)
  await expect(page).toHaveURL(/\/import\/link\?/, { timeout: 15_000 });
  await expect(page.getByText("We couldn't import this recipe.")).toBeVisible();

  // Title field is pre-populated (from OG data or URL fallback)
  await expect(page.getByLabel("Title")).not.toBeEmpty();

  // Edit title and description, add a tag
  await page.getByLabel("Title").clear();
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Description").clear();
  await page.getByLabel("Description").fill(description);
  await page.getByLabel("Add tag").fill(tag);
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByText(tag)).toBeVisible();

  // Save the link card
  await page.getByRole("button", { name: "Save" }).click();

  // Redirected to all recipes page
  await expect(page).toHaveURL(/\/all/, { timeout: 15_000 });

  // Recipe card with the unique title and description appears in the grid
  await expect(
    page.getByRole("heading", { level: 2, name: title }),
  ).toBeVisible({ timeout: 10_000 });
  await expect(page.getByText(description)).toBeVisible();
});
