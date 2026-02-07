import { test, expect } from "@playwright/test";

test.only("@smoke signed-in home then sign out", async ({ page }) => {
  
  // Go to home page
  await page.goto("/");
  await expect(page.getByText("What's cooking?")).toBeVisible();

  // Click logout button
  await page.getByRole("button", { name: "Logout" }).click();

  // Redirected to login page
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});
