import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear field error when user starts typing
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    if (!formData.username) {
      setFieldErrors({ ...fieldErrors, username: "Username is required" });
      return;
    }
    if (!formData.email) {
      setFieldErrors({ ...fieldErrors, email: "Email is required" });
      return;
    }
    if (formData.password.length < 6) {
      setFieldErrors({
        ...fieldErrors,
        password: "Password must be at least 6 characters",
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors({
        ...fieldErrors,
        confirmPassword: "Passwords don't match",
      });
      return;
    }

    setLoading(true);
    try {
      //here add supabase auth logic to register the user
      console.log("Register data:", formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[95vh] flex items-center justify-center">
      <div className="w-full max-w-md flex justify-center font-inter flex-col items-center border border-gray-300 bg-white py-6 rounded-lg shadow-lg px-8">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-8 mb-6" />
        </Link>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-xl p-2 mb-4 text-sm text-center w-full">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full">
          <label
            htmlFor="username"
            className="block mb-2 font-medium text-gray-700"
          >
            Username:
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            placeholder="Username"
            onChange={handleChange}
            className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-[var(--cp)]"
          />
          <div
            className={`text-red-500 text-sm mt-1 ${fieldErrors.username ? "visible" : "invisible"}`}
          >
            {fieldErrors.username || "placeholder"}
          </div>

          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2 mt-2"
          >
            Email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-[var(--cp)]"
          />
          <div
            className={`text-red-500 text-sm mt-1 ${fieldErrors.email ? "visible" : "invisible"}`}
          >
            {fieldErrors.email || "placeholder"}
          </div>

          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2 mt-2"
          >
            Password:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-[var(--cp)]"
          />
          <div
            className={`text-red-500 text-sm mt-1 ${fieldErrors.password ? "visible" : "invisible"}`}
          >
            {fieldErrors.password || "placeholder"}
          </div>

          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-medium mb-2 mt-2"
          >
            Confirm Password:
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm Password"
            required
            onChange={handleChange}
            className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-[var(--cp)]"
          />
          <div
            className={`text-red-500 text-sm mt-1 ${fieldErrors.confirmPassword ? "visible" : "invisible"}`}
          >
            {fieldErrors.confirmPassword || "placeholder"}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--cp)] text-black font-semibold py-3 mt-4 rounded-lg hover:bg-[#4bc864] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-[var(--cp)] hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
