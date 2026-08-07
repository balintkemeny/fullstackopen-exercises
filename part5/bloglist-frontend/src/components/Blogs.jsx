import Blog from "./Blog";

const Blogs = ({ blogs, updateBlog, deleteBlog, user }) => {
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
          currentUsername={user.username}
        />
      ))}
    </div>
  );
};

export default Blogs;
