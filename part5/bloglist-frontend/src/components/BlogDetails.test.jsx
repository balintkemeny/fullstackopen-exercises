import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogDetails from "./BlogDetails";

describe("BlogDetails", () => {
  const testBlogFull = {
    title: "test title",
    author: "test author",
    url: "www.example.test",
    likes: 1,
    user: {
      username: "testuser",
      name: "Test User",
    },
  };

  describe("when the user is not logged in", () => {
    beforeEach(() => {
      render(<BlogDetails blog={testBlogFull} />);
    });

    test("renders title", () => {
      const element = screen.getByText(testBlogFull.title, { exact: false });
      expect(element).toBeDefined();
    });

    test("renders author", () => {
      const element = screen.getByText(testBlogFull.author, { exact: false });
      expect(element).toBeDefined();
    });

    test("renders URL", () => {
      const element = screen.queryByText(testBlogFull.url, { exact: false });
      expect(element).toBeDefined();
    });

    test("renders likes", () => {
      const element = screen.queryByText(`likes: ${testBlogFull.likes}`, {
        exact: false,
      });
      expect(element).toBeDefined();
    });

    test("does not render like button", () => {
      const likeButton = screen.queryByText("like");
      expect(likeButton).toBeNull();
    });

    test("does not render remove button", () => {
      const removeButton = screen.queryByText("remove");
      expect(removeButton).toBeNull();
    });
  });

  describe("when a user that is not the owner of the blog is logged in", () => {
    const secondUsername = "otheruser";
    const mockUpdateBlog = vi.fn();

    beforeEach(() => {
      render(
        <BlogDetails
          blog={testBlogFull}
          currentUsername={secondUsername}
          updateBlog={mockUpdateBlog}
        />,
      );
    });

    afterEach(() => {
      mockUpdateBlog.mockClear();
    });

    test("renders like button", () => {
      const likeButton = screen.getByText("like");
      expect(likeButton).toBeDefined();
    });

    test("clicking the like button once calls the event handler once", async () => {
      const user = userEvent.setup();

      const likeButton = screen.getByText("like");
      await user.click(likeButton);

      expect(mockUpdateBlog.mock.calls).toHaveLength(1);
    });

    test("clicking the like button twice calls the event handler twice", async () => {
      const user = userEvent.setup();

      const likeButton = screen.getByText("like");
      await user.click(likeButton);
      await user.click(likeButton);

      expect(mockUpdateBlog.mock.calls).toHaveLength(2);
    });

    test("does not render remove button", () => {
      const removeButton = screen.queryByText("remove");
      expect(removeButton).toBeNull();
    });
  });

  describe("when the owner of the blog is logged in", () => {
    const mockDeleteBlog = vi.fn();
    beforeEach(() => {
      render(
        <BlogDetails
          blog={testBlogFull}
          currentUsername={testBlogFull.user.username}
          deleteBlog={mockDeleteBlog}
        />,
      );
    });

    afterEach(() => {
      mockDeleteBlog.mockClear();
    });

    test("renders the remove button", () => {
      const removeButton = screen.getByText("remove");
      expect(removeButton).toBeDefined();
    });

    test("clicking the remove button calls deleteBlog", async () => {
      const spyWindowConfirm = vi
        .spyOn(window, "confirm")
        .mockReturnValueOnce(true);
      const user = userEvent.setup();

      const removeButton = screen.getByText("remove");
      await user.click(removeButton);

      expect(spyWindowConfirm.mock.calls).toHaveLength(1);
      expect(mockDeleteBlog.mock.calls).toHaveLength(1);

      spyWindowConfirm.mockRestore();
    });
  });
});
