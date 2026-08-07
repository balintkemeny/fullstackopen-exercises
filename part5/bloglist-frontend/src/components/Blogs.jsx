import Blog from "./Blog";

const Blogs = ({ blogs, updateBlog, deleteBlog, user }) => {
  const currentUsername = user ? user.username : null;

  const blogsOrdered = blogs.toSorted((a, b) => b.likes - a.likes);

  return (
    <div>
      <h2>blogs</h2>
      {blogsOrdered.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          currentUsername={currentUsername}
        />
      ))}
    </div>
  );
};

export default Blogs;
