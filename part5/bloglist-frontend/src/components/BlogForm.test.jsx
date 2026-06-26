import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

const testBlog = {
  title: "test title",
  author: "test author",
  url: "test url",
};

test("blog form calls event handler with correct arguments on submit", async () => {
  const mockCreateBlog = vi.fn();
  render(<BlogForm createBlog={mockCreateBlog} />);
  const user = userEvent.setup();

  const titleInput = screen.getByLabelText("title:");
  await user.type(titleInput, testBlog.title);

  const authorInput = screen.getByLabelText("author:");
  await user.type(authorInput, testBlog.author);

  const urlInput = screen.getByLabelText("url:");
  await user.type(urlInput, testBlog.url);

  const submitButton = screen.getByText("create");
  await user.click(submitButton);

  expect(mockCreateBlog.mock.calls[0][0]).toMatchObject(testBlog);
});
