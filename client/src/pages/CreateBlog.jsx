import { useState } from "react";
import axios from "axios";
import { Sparkles, SearchCheck, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function CreateBlog() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [seo, setSeo] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const generateBlog = async () => {
    if (!form.title.trim()) {
      alert("Please enter a topic/title first.");
      return;
    }

    try {
      setLoadingAI(true);

      const res = await axios.post(
        "http://localhost:5000/api/blogs/generate",
        {
          topic: form.title,
        }
      );

      setForm({
        ...form,
        content: res.data.content,
      });
    } catch (error) {
      alert("AI generation failed");
    } finally {
      setLoadingAI(false);
    }
  };

  const checkSeo = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/blogs/seo",
        form
      );

      setSeo(res.data.message);
    } catch (error) {
      alert("SEO check failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    try {
      setPublishing(true);

      await axios.post(
        "http://localhost:5000/api/blogs/create",
        {
          ...form,
          authorId: user._id,
          authorName: user.name,
        }
      );

      alert("Blog Published Successfully");
      navigate("/");
    } catch (error) {
      alert("Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl p-10"
      >
        <h1 className="text-5xl font-semibold text-slate-900 mb-3">
          Create Blog
        </h1>

        <p className="text-slate-500 mb-8">
          Write manually or generate premium AI content instantly.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Enter blog title..."
            value={form.title}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl border border-slate-200 bg-white mb-5 outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* Content */}
          <textarea
            name="content"
            rows="14"
            placeholder="Write your content here..."
            value={form.content}
            onChange={handleChange}
            className="w-full p-5 rounded-2xl border border-slate-200 bg-white mb-6 outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          ></textarea>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              type="button"
              onClick={generateBlog}
              disabled={loadingAI}
              className="px-5 py-3 text-sm bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <Sparkles size={16} />
              {loadingAI ? "Generating..." : "Generate AI"}
            </button>

            <button
              type="button"
              onClick={checkSeo}
              className="px-5 py-3 text-sm border border-slate-300 rounded-full hover:bg-slate-50 transition flex items-center gap-2"
            >
              <SearchCheck size={16} />
              SEO Score
            </button>

            <button
              type="submit"
              disabled={publishing}
              className="px-5 py-3 text-sm bg-slate-900 text-white rounded-full hover:bg-black transition flex items-center gap-2"
            >
              <Send size={16} />
              {publishing ? "Publishing..." : "Publish"}
            </button>
          </div>

          {/* SEO Result */}
          {seo && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 text-emerald-700 font-medium">
              {seo}
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
}

export default CreateBlog;