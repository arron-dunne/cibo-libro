import { test, expect } from "@playwright/test";
import { uniqueEmail } from "./helpers";

test("bootstrap auth and save storage", async ({ page, context, baseURL }) => {
  const email = uniqueEmail();
  const password = "Password1234";

  // Create account
  await page.goto("/register");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password (at least 8 characters)").fill(password);
  await page.getByLabel("Confirm Password").fill(password);
  await page.getByRole("button", { name: "Sign up" }).click();

  // Redirected to /login with success banner
  await expect(page).toHaveURL(/\/login/);
  await expect(
    page.getByText("Account created. You can login now."),
  ).toBeVisible();

  // Login
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  // Land on home, email visible
  await expect(page).toHaveURL(
    new RegExp(`${baseURL?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") ?? ""}/?$`),
  );
  await expect(page.getByText(email)).toBeVisible();

  // Persist auth state for dependent projects
  await context.storageState({ path: ".auth/storage.json" });
});
