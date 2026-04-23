import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function History() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/blogs/user/${user._id}`
    );

    setBlogs(res.data);
  };

  const deleteBlog = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/blogs/${id}`
    );

    fetchBlogs();
  };

  return (
    <div>
      <h1>My Blog History</h1>

      {blogs.map((blog) => (
        <div key={blog._id} style={{ border: "1px solid black", margin: "10px", padding: "10px", gap:"20px"}}>
          <h2>{blog.title}</h2>

          <Link to={`/edit/${blog._id}`}>Edit</Link>

          <button onClick={() => deleteBlog(blog._id)}>
              Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default History;