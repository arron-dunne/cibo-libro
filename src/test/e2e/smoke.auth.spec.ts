// test/e2e/smoke.auth.spec.ts
import { test, expect } from "@playwright/test";

test("@smoke signed-in home then sign out", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Signed in as").first()).toBeVisible();

  // The navbar has a real "Sign out" button inside a form-action
  await page.getByRole("button", { name: "Sign out" }).click();

  // You send users back to /signin after signOut
  await expect(page).toHaveURL(/\/signin/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
});
