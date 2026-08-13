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

  test("when the login link in the navbar is clicked the login form is shown", async ({
    page,
  }) => {
    await page.getByText("login").click();
    await expect(page.getByLabel("username")).toBeVisible();
    await expect(page.getByLabel("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  test("login succeeds when correct credentials are provided", async ({
    page,
  }) => {
    await loginWith(page, user.username, user.password);
    await expect(page.getByText("new blog")).toBeVisible();
    await expect(page.getByRole("button", { name: "logout" })).toBeVisible();
  });

  test("Login fails when wrong credentials are provided", async ({ page }) => {
    await loginWith(page, user.username, "wrong_pwd");

    const errorDiv = page.locator(".error");
    await expect(errorDiv).toContainText("wrong username or password");
    await expect(errorDiv).toHaveCSS("border-style", "solid");
    await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

    await expect(page.getByText("new blog")).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: "logout" }),
    ).not.toBeVisible();
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

      await expect(page.getByRole("heading", { name: "blogs" })).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Test Title by Test Author" }),
      ).toBeVisible();
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
        await page
          .getByRole("link", { name: "Test Title by Test Author" })
          .click();
        await page.getByRole("button", { name: "like" }).click();

        await expect(page.getByText("likes: 1")).toBeVisible();
      });

      test("the blog can be deleted", async ({ page }) => {
        page.on("dialog", (dialog) => dialog.accept());

        await page
          .getByRole("link", { name: "Test Title by Test Author" })
          .click();
        await page.getByRole("button", { name: "remove" }).click();

        await expect(
          page.getByRole("heading", { name: "blogs" }),
        ).toBeVisible();
        await expect(
          page.getByRole("link", { name: "Test Title by Test Author" }),
        ).not.toBeVisible();
      });
    });
  });
});
