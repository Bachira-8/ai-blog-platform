import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const oldUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(oldUser);
  const [loading, setLoading] = useState(false);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        setLoading(true);

        const res = await axios.put(
          `http://localhost:5000/api/auth/profile/${user._id}`,
          { profilePic: reader.result }
        );

        localStorage.setItem(
          "user",
          JSON.stringify(res.data)
        );

        setUser(res.data);

      } catch (error) {
        alert("Upload failed");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-white px-6 py-10">

      {/* Top Button */}
      <div className="max-w-xl mx-auto mb-5">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white/70 backdrop-blur-xl border border-white/40 rounded-full shadow hover:scale-105 transition"
        >
          <ArrowLeft size={16} />
          Homepage
        </button>
      </div>

      {/* Dashboard Card */}
      <div className="max-w-xl w-full mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-10 text-center">

        {/* Profile Image */}
        <img
          src={
            user.profilePic ||
            "https://via.placeholder.com/120"
          }
          alt="profile"
          className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-white shadow-md"
        />

        {/* Name */}
        <h1 className="text-4xl font-semibold text-slate-900 mt-5">
          {user.name}
        </h1>

        {/* Email */}
        <p className="text-slate-500 mt-2">
          {user.email}
        </p>

        {/* Upload Button */}
        <label className="inline-block mt-6 px-5 py-3 text-sm bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 transition">
          {loading ? "Uploading..." : "Upload Photo"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImage}
          />
        </label>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-10">

          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-semibold">12</h2>
            <p className="text-sm text-slate-500">
              Blogs Created
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-semibold">98</h2>
            <p className="text-sm text-slate-500">
              SEO Avg Score
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;