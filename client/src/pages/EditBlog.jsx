import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: ""
  });

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/blogs/single/${id}`
    );

    setForm(res.data);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(
      `http://localhost:5000/api/blogs/${id}`,
      form
    );

    alert("Updated");
    navigate("/history");
  };

  return (
    <div>
      <h1>Edit Blog</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
        /><br /><br />

        <textarea
          name="content"
          rows="8"
          cols="40"
          value={form.content}
          onChange={handleChange}
        ></textarea><br /><br />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditBlog;