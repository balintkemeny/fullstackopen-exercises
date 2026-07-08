const { beforeEach, test, describe, expect } = require("@playwright/test");
const { loginWith } = require("./helper");

describe("Bloglist app", () => {
  const user = {
    name: "Test User",
    username: "test_user",
    password: "test_pwd",
  };

  beforeEach(async ({ request, page }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: user,
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByLabel("username")).toBeVisible();
    await expect(page.getByLabel("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  test("Login succeeds when correct credentials are provided", async ({
    page,
  }) => {
    await loginWith(page, user.username, user.password);
    await expect(page.getByText("Test User logged in")).toBeVisible();
  });

  test("Login fails when wrong credentials are provided", async ({ page }) => {
    await loginWith(page, user.username, "wrong_pwd");

    const errorDiv = page.locator(".error");
    await expect(errorDiv).toContainText("wrong username or password");
    await expect(errorDiv).toHaveCSS("border-style", "solid");
    await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

    await expect(page.getByText("Test User logged in")).not.toBeVisible();
  });
});
