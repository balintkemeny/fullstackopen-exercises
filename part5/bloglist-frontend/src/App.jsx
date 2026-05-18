import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import LoginForm from "./components/LoginForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(() => {
    const loggedInUserJSON = window.localStorage.getItem("blogUser");
    return loggedInUserJSON ? JSON.parse(loggedInUserJSON) : null;
  });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    if (user?.token) {
      console.log(`Setting token for ${user.username}: ${user.token}`);
      blogService.setToken(user.token);
    }
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("logging in with:", username, password);

    try {
      const user = await loginService.login({ username, password });
      console.log("user:", user);

      window.localStorage.setItem("blogUser", JSON.stringify(user));

      setUser(user);
      setUsername("");
      setPassword("");
    } catch (error) {
      console.log("login error:", error);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };

  return (
    <div>
      {!user && (
        <>
          <h2>log in to application</h2>
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
          <h2>blogs</h2>
          <p>
            {user.name} logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
