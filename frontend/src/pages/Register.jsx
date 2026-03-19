import { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify"; // ✅ added
// import { Phone } from "lucide-react";  

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const validatePassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{4,}$/;

  if (!password) return "Password is required";

  if (!regex.test(password)) {
    return "Password must be at least 4 characters and include uppercase, lowercase, number & special character";
  }

  return null;
};
 const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (!formData.name || !formData.email || !formData.password || !formData.phone) {
    const msg = "All fields are required";
    setError(msg);
    toast.error(msg);
    return;
  }

  // 🔥 Password validation
  const passwordError = validatePassword(formData.password);
  if (passwordError) {
    setError(passwordError);
    toast.error(passwordError);
    return;
  }

  try {
    setLoading(true);

    const res = await registerUser(formData);

    const msg = "Registration successful! Please login.";
    setSuccess(msg);
    toast.success(msg);

    setTimeout(() => {
      navigate({ to: "/login" });
    }, 1500);

  } catch (err) {
    const message =
      err?.message ||
      err?.response?.data?.message ||
      "Registration failed";

    setError(message);
    toast.error(message);

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-600 p-2 mb-4 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-3 mb-3 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 mb-3 rounded"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
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
          {formData.password && validatePassword(formData.password) && (
  <p className="text-red-500 text-sm mb-2">
    {validatePassword(formData.password)}
  </p>
)}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate({ to: "/login" })}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;