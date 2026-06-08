import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Toggleable from "./components/Toggleable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./index.css";

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

  const blogFormRef = useRef();

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
    blogFormRef.current.toggleVisibility();
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

  const blogsOrdered = blogs.toSorted((a, b) => b.likes - a.likes);

  return (
    <div>
      {user ? <h2>blogs</h2> : <h2>log in to application</h2>}
      <Notification notification={notification} />
      {!user && (
        <>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        </>
      )}
      {user && (
        <>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Toggleable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm createBlog={createBlog} />
          </Toggleable>
          {blogsOrdered.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              updateBlog={updateBlog}
              deleteBlog={deleteBlog}
              currentUsername={user.username}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
