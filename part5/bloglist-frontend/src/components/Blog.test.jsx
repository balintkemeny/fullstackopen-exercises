import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

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

test("renders title", () => {
  render(<Blog blog={testBlogFull} />);

  const element = screen.getByText(testBlogFull.title, { exact: false });
  expect(element).toBeDefined();
});

test("renders author", () => {
  render(<Blog blog={testBlogFull} />);

  const element = screen.getByText(testBlogFull.author, { exact: false });
  expect(element).toBeDefined();
});

test("does not render url by default", () => {
  render(<Blog blog={testBlogFull} />);

  const element = screen.queryByText(testBlogFull.url, { exact: false });
  expect(element).toBeNull();
});

test("does not likes url by default", () => {
  render(<Blog blog={testBlogFull} />);

  const element = screen.queryByText(`likes: ${testBlogFull.likes}`, {
    exact: false,
  });
  expect(element).toBeNull();
});

test("clicking the show button displays the URL and the number of likes as well", async () => {
  render(<Blog blog={testBlogFull} />);
  const user = userEvent.setup();

  const button = screen.getByText("show");
  await user.click(button);

  const urlDiv = screen.getByText(testBlogFull.url);
  expect(urlDiv).toBeDefined();

  const likesDiv = screen.getByText(`likes: ${testBlogFull.likes}`);
  expect(likesDiv).toBeDefined();
});

test("clicking the hide button hides the URL and the number of likes as well", async () => {
  render(<Blog blog={testBlogFull} />);
  const user = userEvent.setup();

  const showButton = screen.getByText("show");
  await user.click(showButton);

  const hideButton = screen.getByText("hide");
  await user.click(hideButton);

  const urlDiv = screen.queryByText(testBlogFull.url);
  expect(urlDiv).toBeNull();

  const likesDiv = screen.queryByText(`likes: ${testBlogFull.likes}`);
  expect(likesDiv).toBeNull();
});

test("clicking the like button twice calls the event handler twice", async () => {
  const mockUpdateBlog = vi.fn();

  render(<Blog blog={testBlogFull} updateBlog={mockUpdateBlog} />);
  const user = userEvent.setup();

  const showButton = screen.getByText("show");
  await user.click(showButton);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockUpdateBlog.mock.calls).toHaveLength(2);
});
