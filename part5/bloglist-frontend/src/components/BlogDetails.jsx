const BlogDetails = ({ blog }) => {
  const handleClickLike = () => {
    console.log("like clicked...");
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
