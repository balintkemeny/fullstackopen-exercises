import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleAddBlog = (event) => {
    event.preventDefault();

    createBlog({
      title,
      author,
      url,
    });

    navigate("/");
    setTitle("");
    setAuthor("");
    setUrl("");
  };

  return (
    <form onSubmit={handleAddBlog}>
      <div>
        <label>
          title:
          <input
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          author:
          <input
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          url:
          <input
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </label>
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;
