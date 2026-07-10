import { beforeEach, test, describe, expect } from "@playwright/test";
import { loginWith, createBlog } from "./helper";

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

  describe("When a user is logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, user.username, user.password);
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, {
        title: "Test Title",
        author: "Test Author",
        url: "www.test.com",
      });

      const notificationDiv = page.locator(".notification");
      await expect(notificationDiv).toContainText(
        "a new blog Test Title by Test Author added",
      );
      await expect(notificationDiv).toHaveCSS("border-style", "solid");
      await expect(notificationDiv).toHaveCSS("color", "rgb(0, 128, 0)");

      await expect(page.getByText("Test Title Test Author")).toBeVisible();
    });

    describe("and a blog has been created", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: "Test Title",
          author: "Test Author",
          url: "www.test.com",
        });
      });

      test("the blog can be liked", async ({ page }) => {
        const blogDiv = page.getByText("Test Title Test Author");
        await blogDiv.getByRole("button", { name: "show" }).click();
        await blogDiv.getByRole("button", { name: "like" }).click();

        await expect(blogDiv.getByText("likes: 1")).toBeVisible();
      });
    });
  });
});
