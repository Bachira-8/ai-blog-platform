import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/blogs/single/${id}`
      );

      setBlog(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-white px-6 py-10">
        <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl p-10 animate-pulse h-[500px]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-white">

      {/* NAVBAR */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-white/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-white/80 border hover:scale-105 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <h1 className="text-xl font-semibold text-slate-900">
            Blog Article
          </h1>
        </div>
      </div>

      {/* CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-6 py-12"
      >
        <div className="bg-white/75 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-xl p-10">

          {/* Title */}
          <h1 className="text-5xl font-semibold text-slate-900 leading-tight">
            {blog.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap gap-5 mt-6 text-sm text-slate-500">

            <div className="flex items-center gap-2">
              <User size={16} />
              {blog.authorName}
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={16} />
              {new Date(blog.createdAt).toLocaleDateString()}
            </div>

          </div>

          {/* Divider */}
          <div className="h-px bg-slate-200 my-8"></div>

          {/* Blog Content */}
          <div
            className="whitespace-pre-line text-slate-700 leading-9 text-lg"
          >
            {blog.content}
          </div>

          {/* Bottom Buttons */}
          <div className="mt-10 flex gap-3">

            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
            >
              Explore More Blogs
            </button>

            <button
              onClick={() => navigator.share?.({
                title: blog.title,
                text: blog.content
              })}
              className="px-5 py-2 text-sm border rounded-full hover:bg-slate-50 transition"
            >
              Share
            </button>

          </div>

        </div>
      </motion.div>
    </div>
  );
}

export default BlogDetails;