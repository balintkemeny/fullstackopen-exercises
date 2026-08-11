const BlogDetails = ({ blog, updateBlog, deleteBlog, currentUsername }) => {
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
      <div>{blog.url}</div>
      <div>
        likes: {blog.likes} <button onClick={handleClickLike}>like</button>
      </div>
      <div>Added by {blog.user.name}</div>
      {blog.user.username === currentUsername && (
        <button onClick={handleClickRemove}>remove</button>
      )}
    </div>
  );
};

export default BlogDetails;
