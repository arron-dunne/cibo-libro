import { test, expect } from "@playwright/test";

test("@smoke signed-in home then sign out", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Signed in as").first()).toBeVisible();

  // The navbar has a real "Logout" button inside a form-action
  await page.getByRole("button", { name: "Logout" }).click();

  // You send users back to /signin after signOut
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});
