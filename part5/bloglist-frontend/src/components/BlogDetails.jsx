const BlogDetails = ({ blog, updateBlog, deleteBlog, currentUsername }) => {
  if (!blog) {
    return null;
  }

  const handleClickLike = () => {
    updateBlog({
      ...blog,
      likes: blog.likes + 1,
    });
  };

  const handleClickRemove = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      deleteBlog(blog.id);
    }
  };

  return (
    <div>
      <div>
        <h2>
          {blog.author}: {blog.title}
        </h2>
      </div>
      <div>{blog.url}</div>
      <div>
        likes: {blog.likes}{" "}
        {currentUsername && <button onClick={handleClickLike}>like</button>}
      </div>
      <div>Added by {blog.user.name}</div>
      {blog.user.username === currentUsername && (
        <button onClick={handleClickRemove}>remove</button>
      )}
    </div>
  );
};

export default BlogDetails;
