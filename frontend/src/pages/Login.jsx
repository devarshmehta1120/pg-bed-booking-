import { useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify"; // ✅ added

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ✅ Validation
    if (!formData.email || !formData.password) {
      const msg = "Email and password are required";
      setError(msg);
      toast.error(msg); // 🔥 toast added
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser(formData);

      // ✅ Success toast
      toast.success("Login successful ✅");

      const user = res.user;

      // redirect based on role
      if (user.role === "admin") {
        navigate({ to: "/admin/dashboard" });
      } else {
        navigate({ to: "/" });
      }

    } catch (err) {

      const message =
        err?.message ||
        err?.response?.data?.message ||
        "Login failed";

      setError(message);
      toast.error(message); // 🔥 toast added

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-lg w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 mb-3 rounded"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-3 mb-4 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate({ to: "/register" })}
          >
            Register
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;