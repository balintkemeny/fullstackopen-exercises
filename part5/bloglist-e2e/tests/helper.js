const loginWith = async (page, username, password) => {
  await page.getByText("login").click();
  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const logout = async (page) => {
  await page.getByRole("button", { name: "logout" }).click();
};

const createBlog = async (page, blog) => {
  await page.getByText("new blog").click();
  await page.getByLabel("title:").fill(blog.title);
  await page.getByLabel("author:").fill(blog.author);
  await page.getByLabel("url:").fill(blog.url);
  await page.getByRole("button", { name: "create" }).click();
  await page
    .getByRole("link", { name: `${blog.title} by ${blog.author}` })
    .waitFor();
};

export { loginWith, logout, createBlog };
