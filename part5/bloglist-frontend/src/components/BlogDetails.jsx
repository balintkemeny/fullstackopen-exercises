import { useNavigate } from "react-router-dom";
import { Card, CardContent, Button, Typography, Link } from "@mui/material";

const BlogDetails = ({ blog, updateBlog, deleteBlog, currentUsername }) => {
  const navigate = useNavigate();

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
      navigate("/");
    }
  };

  return (
    <Card sx={{ marginTop: 2 }}>
      <CardContent>
        <Typography variant="h4" component="div">
          {blog.title}
        </Typography>
        <Typography
          variant="h5"
          component="div"
          sx={{ color: "text.secondary" }}
        >
          by {blog.author}
        </Typography>
        <Link
          variant="body1"
          href={blog.url}
          component="div"
          sx={{ marginTop: 1 }}
        >
          {blog.url}
        </Link>
        <Typography
          variant="body1"
          component="div"
          sx={{ color: "text.secondary", marginTop: 1, marginBottom: 1 }}
        >
          Added by {blog.user.name}
        </Typography>
        <div>
          likes: {blog.likes}{" "}
          {currentUsername && <button onClick={handleClickLike}>like</button>}
        </div>
        {blog.user.username === currentUsername && (
          <button onClick={handleClickRemove}>remove</button>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogDetails;
