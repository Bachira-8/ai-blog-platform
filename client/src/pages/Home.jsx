import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";

function Home() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-white">

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Sparkles size={18} />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                AI Blog Studio
              </h1>
              <p className="text-xs text-slate-500">
                Premium Publishing Platform
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            <Link
              to="/create"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow"
            >
              Create Blog
            </Link>

            <Link
              to="/history"
              className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition"
            >
              History
            </Link>

            {/* Profile Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-3 px-3 py-2 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow transition"
                >
                  <img
                    src={
                      user.profilePic ||
                      "https://via.placeholder.com/40"
                    }
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover"
                  />

                  <span className="text-sm font-medium text-slate-700">
                    {user.name}
                  </span>

                  <ChevronDown size={16} className="text-slate-500" />
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2">

                    <button
                      onClick={() => navigate("/dashboard")}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-left"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </button>

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-left text-red-500"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>

                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-semibold text-slate-900 leading-tight"
        >
          Create Blogs With AI Elegance
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-slate-500 text-lg mt-5 max-w-2xl mx-auto"
        >
          Generate premium articles, optimize SEO, and publish with a world-class interface.
        </motion.p>
      </section>

      {/* Blog Grid */}
      <main className="max-w-7xl mx-auto px-6 pb-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {loading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-3xl bg-white/70 animate-pulse border border-white/40"
              ></div>
            ))
          : blogs.map((blog, index) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate(`/blog/${blog._id}`)}
                className="cursor-pointer bg-white/75 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-lg hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold text-slate-900 line-clamp-2">
                  {blog.title}
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  By {blog.authorName}
                </p>

                <p className="text-sm text-slate-600 leading-7 mt-4 whitespace-pre-line line-clamp-6">
                  {blog.content}
                </p>

                <div className="mt-5 text-sm text-indigo-600 font-medium">
                  Read Full Article →
                </div>
              </motion.div>
            ))}
      </main>
    </div>
  );
}

export default Home;