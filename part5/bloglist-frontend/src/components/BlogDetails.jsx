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
          <Typography
            variant="body1"
            component="span"
            sx={{ display: "inline" }}
          >
            likes: {blog.likes}{" "}
          </Typography>
          {currentUsername && (
            <Button
              variant="outlined"
              color="success"
              onClick={handleClickLike}
              sx={{ marginLeft: 0.5, marginRight: 0.5, display: "inline" }}
            >
              like
            </Button>
          )}
          {blog.user.username === currentUsername && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleClickRemove}
              sx={{ marginLeft: 0.5, display: "inline" }}
            >
              remove
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogDetails;
