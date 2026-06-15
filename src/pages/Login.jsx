import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      login(res.data);

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login Error:", err.response?.data);

      alert(
        err.response?.data?.message ||
          "Email ya password galat hai"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient from-blue-600 via-indigo-500 to-purple-600 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Login to continue chatting
        </p>

        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          className="w-full border border-gray-300 p-3 rounded-lg mb-4"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          className="w-full border border-gray-300 p-3 rounded-lg mb-5"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
        >
          Login
        </button>

        <p className="text-center mt-5 text-gray-600">
          Don't have an account?
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer ml-1 font-semibold"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;