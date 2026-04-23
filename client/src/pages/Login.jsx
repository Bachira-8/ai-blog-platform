import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");

    } catch (error) {
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-slate-100 via-indigo-50 to-white">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/70 backdrop-blur-xl p-10 rounded-3xl border border-white/40 shadow-xl"
      >
        <h1 className="text-4xl font-semibold text-center text-slate-900 mb-8">
          Welcome Back
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          className="w-full p-4 rounded-2xl bg-white border border-slate-200 mb-4 outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-4 rounded-2xl bg-white border border-slate-200 mb-6 outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          type="submit"
          className="w-full py-3 text-sm bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
        >
          Login
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium">
            Register
          </Link>
        </p>
      </form>

    </div>
  );
}

export default Login;