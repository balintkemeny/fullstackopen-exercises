import { useState } from "react";
import BlogDetails from "./BlogDetails";

const Blog = ({ blog, updateBlog, deleteBlog, currentUsername }) => {
  const [showDetails, setShowDetails] = useState(false);

  const detailsButtonLabel = showDetails ? "hide" : "show";

  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleClickRemove = () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      deleteBlog(blog.id);
    }
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div className="blog" style={blogStyle}>
      {blog.title} {blog.author}{" "}
      <button onClick={toggleShowDetails}>{detailsButtonLabel}</button>
      {showDetails && (
        <BlogDetails
          blog={blog}
          updateBlog={updateBlog}
          deleteBlog={deleteBlog}
          currentUsername={currentUsername}
        />
      )}
      {!showDetails && blog.user.username === currentUsername && (
        <button onClick={handleClickRemove}>remove</button>
      )}
    </div>
  );
};

export default Blog;
