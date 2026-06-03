import { useState } from "react";
import BlogDetails from "./BlogDetails";

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const detailsButtonLabel = showDetails ? "hide" : "show";

  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}{" "}
      <button onClick={toggleShowDetails}>{detailsButtonLabel}</button>
      {showDetails && <BlogDetails blog={blog} />}
    </div>
  );
};

export default Blog;
