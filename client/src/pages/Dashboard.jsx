import { useState } from "react";
import axios from "axios";

function Dashboard() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-white flex items-center justify-center px-6">

      <div className="max-w-xl w-full bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-10 text-center">

        <img
          src={
            user.profilePic ||
            "https://via.placeholder.com/120"
          }
          className="w-28 h-28 rounded-full object-cover mx-auto border-4 border-white shadow-md"
        />

        <h1 className="text-4xl font-semibold text-slate-900 mt-5">
          {user.name}
        </h1>

        <p className="text-slate-500 mt-2">
          {user.email}
        </p>

        <label className="inline-block mt-6 px-5 py-3 text-sm bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-indigo-700 transition">
          {loading ? "Uploading..." : "Upload Photo"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImage}
          />
        </label>

        <div className="grid grid-cols-2 gap-4 mt-10">

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-2xl font-semibold">12</h2>
            <p className="text-sm text-slate-500">Blogs Created</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-2xl font-semibold">98</h2>
            <p className="text-sm text-slate-500">SEO Avg Score</p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;