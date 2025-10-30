import { test, expect } from "@playwright/test";

test.describe("@smoke import recipe", () => {
  test("@smoke import recipe and view in grid", async ({ page }) => {
    
    // Assume user is already authenticated via storageState
    await page.goto("/import");

    // Fill in source URL
    const testUrl = "https://www.bbcgoodfood.com/recipes/one-pan-spaghetti-nduja-fennel-olives";
    await page.getByPlaceholder("https://example.com/best-lasagne-ever").fill(testUrl);

    // Submit import
    await page.getByRole("button", { name: "Import" }).click();

    // Wait for import to complete — app likely redirects or shows confirmation
    await expect(page).toHaveURL(/\/view\//, { timeout: 15_000 });

    // Check that the imported recipe page renders correctly
    const titleHeading = page.getByRole("heading", { level: 1 });
    await expect(titleHeading).toBeVisible();

    // Navigate to library and confirm the card appears
    await page.goto("/all");
    const card = page.getByRole("heading", { level: 3, name: await titleHeading.textContent() ?? "" });
    await expect(card).toBeVisible();
  });
});
