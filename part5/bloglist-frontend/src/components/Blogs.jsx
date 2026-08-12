import { Link } from "react-router-dom";

const Blogs = ({ blogs }) => {
  const blogsOrdered = blogs.toSorted((a, b) => b.likes - a.likes);

  return (
    <div>
      <h2>blogs</h2>
      <ul>
        {blogsOrdered.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title} by {blog.author}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blogs;
