const BlogDetails = ({ blog, updateBlog }) => {
  const handleClickLike = () => {
    updateBlog({
      ...blog,
      likes: blog.likes + 1,
    });
  };

  return (
    <div>
      <div>{blog.url}</div>
      <div>
        likes: {blog.likes} <button onClick={handleClickLike}>like</button>
      </div>
      <div>{blog.user.name}</div>
    </div>
  );
};

export default BlogDetails;
