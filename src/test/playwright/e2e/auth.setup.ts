// test/e2e/auth.setup.ts
import { test, expect } from "@playwright/test";
import { uniqueEmail } from "./helpers";

test("bootstrap auth and save storage", async ({ page, context, baseURL }) => {
  const email = uniqueEmail();
  const password = "Password1234";

  // Create account
  await page.goto("/signup");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign up" }).click();

  // Redirected to /signin?created=1 with banner
  await expect(page).toHaveURL(/\/signin/);
  await expect(page.getByText("Account created. You can sign in now.")).toBeVisible();

  // Sign in
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  // Land on home, "Signed in as ..." text visible
  await expect(page).toHaveURL(new RegExp(`${baseURL?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") ?? ""}/?$`));
  await expect(page.getByText("Signed in as").first()).toBeVisible();

  // Persist auth state for dependent projects
  await context.storageState({ path: ".auth/storage.json" });
});
