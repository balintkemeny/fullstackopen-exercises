import { useState, useEffect } from "react";
import { useMatch, Link, Routes, Route } from "react-router-dom";
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Button,
  Typography,
} from "@mui/material";

import BlogDetails from "./components/BlogDetails";
import Blogs from "./components/Blogs";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(() => {
    const loggedInUserJSON = window.localStorage.getItem("blogUser");
    return loggedInUserJSON ? JSON.parse(loggedInUserJSON) : null;
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    if (user?.token) {
      blogService.setToken(user.token);
    }
  }, [user]);

  // const blogFormRef = useRef();

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with:", username, password);

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("blogUser", JSON.stringify(user));

      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.log("login error:", error);
      showNotification("wrong username or password", true);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  const createBlog = async (newBlog) => {
    const createdBlog = await blogService.create(newBlog);
    setBlogs(blogs.concat(createdBlog));

    showNotification(
      `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
      false,
    );
  };

  const updateBlog = async (blog) => {
    const updatedBlog = await blogService.update(blog);
    setBlogs(blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b)));
  };

  const deleteBlog = async (blogId) => {
    await blogService.deleteById(blogId);
    setBlogs(blogs.filter((b) => b.id !== blogId));
  };

  const padding = {
    padding: 5,
  };

  const blogIdMatch = useMatch("/blogs/:id");
  const currentBlog = blogIdMatch
    ? blogs.find((b) => b.id === blogIdMatch.params.id)
    : null;

  const buttonHoverStyle = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

  return (
    <Container>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              Blog App
            </Typography>
            <Button
              color="inherit"
              component={Link}
              to="/"
              sx={buttonHoverStyle}
            >
              blogs
            </Button>
            {user && (
              <Button
                color="inherit"
                component={Link}
                to="/create"
                sx={buttonHoverStyle}
              >
                new blog
              </Button>
            )}
            {!user && (
              <Button
                color="inherit"
                component={Link}
                to="/login"
                sx={buttonHoverStyle}
              >
                login
              </Button>
            )}
            {user && (
              <Button
                onClick={handleLogout}
                color="inherit"
                sx={buttonHoverStyle}
              >
                logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      <Notification notification={notification} />

      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <BlogDetails
              blog={currentBlog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              currentUsername={user ? user.username : null}
            />
          }
        />
        <Route path="/" element={<Blogs blogs={blogs} />} />
        <Route
          path="/login"
          element={
            <LoginForm
              handleLogin={handleLogin}
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
            />
          }
        />
        <Route path="/create" element={<BlogForm createBlog={createBlog} />} />
      </Routes>
    </Container>
  );
};

export default App;
