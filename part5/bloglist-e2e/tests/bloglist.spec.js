import { beforeEach, test, describe, expect } from "@playwright/test";
import { loginWith, logout, createBlog } from "./helper";

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

  test.only("login succeeds when correct credentials are provided", async ({
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

      test("the blog can be deleted", async ({ page }) => {
        page.on("dialog", (dialog) => dialog.accept());

        const blogDiv = page.getByText("Test Title Test Author");
        await blogDiv.getByRole("button", { name: "remove" }).click();

        await expect(
          page.getByText("Test Title Test Author"),
        ).not.toBeVisible();
      });
    });

    describe("and multiple blogs have been created with differing number of likes", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: "First Title",
          author: "First Author",
          url: "www.first.blog",
        });
        await createBlog(page, {
          title: "Second Title",
          author: "Second Author",
          url: "www.second.blog",
        });
        await createBlog(page, {
          title: "Third Title",
          author: "Third Author",
          url: "www.third.blog",
        });

        const firstBlogDiv = page.getByText("First Title First Author");
        await firstBlogDiv.getByRole("button", { name: "show" }).click();
        await firstBlogDiv.getByRole("button", { name: "like" }).click();

        const secondBlogDiv = page.getByText("Second Title Second Author");
        await secondBlogDiv.getByRole("button", { name: "show" }).click();

        const thirdBlogDiv = page.getByText("Third Title Third Author");
        await thirdBlogDiv.getByRole("button", { name: "show" }).click();
        await thirdBlogDiv.getByRole("button", { name: "like" }).click();
        await thirdBlogDiv.getByRole("button", { name: "like" }).click();
      });

      test("the correct amount of likes are displayed", async ({ page }) => {
        await expect(
          page.getByText("First Title First Author").getByText("likes: 1"),
        ).toBeVisible();

        await expect(
          page.getByText("Second Title Second Author").getByText("likes: 0"),
        ).toBeVisible();

        await expect(
          page.getByText("Third Title Third Author").getByText("likes: 2"),
        ).toBeVisible();
      });

      test("blogs are rendered by likes in descending order", async ({
        page,
      }) => {
        const blogDivs = await page.locator(".blog").all();

        await expect(blogDivs[0]).toContainText("Third Title Third Author");
        await expect(blogDivs[1]).toContainText("First Title First Author");
        await expect(blogDivs[2]).toContainText("Second Title Second Author");
      });
    });
  });

  describe("when there is a blog created by another user", () => {
    const secondUser = {
      name: "Second User",
      username: "second_user",
      password: "second_pwd",
    };

    beforeEach(async ({ page, request }) => {
      await request.post("/api/users", {
        data: secondUser,
      });

      await loginWith(page, secondUser.username, secondUser.password);
      await createBlog(page, {
        title: "Test Title",
        author: "Test Author",
        url: "www.test.com",
      });

      await logout(page);

      await loginWith(page, user.username, user.password);
    });

    test("the blog cannot be deleted", async ({ page }) => {
      const blogDiv = page.getByText("Test Title Test Author");
      await expect(
        blogDiv.getByRole("button", { name: "remove" }),
      ).not.toBeVisible();
    });
  });
});
