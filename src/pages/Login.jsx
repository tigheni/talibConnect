import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import loginIllustration from "../assets/login_weas1.svg";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
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
      email: "",
      password: "",
    });

    if (!formData.email) {
      setFieldErrors({ ...fieldErrors, email: "Email is required" });
      return;
    }
    if (!formData.password) {
      setFieldErrors({ ...fieldErrors, password: "Password is required" });
      return;
    }
    if (formData.password.length < 6) {
      setFieldErrors({
        ...fieldErrors,
        password: "Password must be at least 6 characters",
      });
      return;
    }

    setLoading(true);
    try {
      //here add supabase auth logic to login the user
      console.log("Login data:", formData);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="hidden md:block md:w-1/2">
        <img
          src={loginIllustration}
          alt="Login Illustration"
          className="h-[70vh] md:max-w-lg sm:max-w-md object-contain"
        />
      </div>
      <div className="w-full md:max-w-lg sm:max-w-md flex justify-center font-inter flex-col items-center border border-gray-300 bg-white py-6 rounded-lg shadow-lg px-8">
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
            required
            onChange={(e) => handleChange(e)}
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
            onChange={(e) => handleChange(e)}
            className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-[var(--cp)]"
          />
          <div
            className={`text-red-500 text-sm mt-1 ${fieldErrors.password ? "visible" : "invisible"}`}
          >
            {fieldErrors.password || "placeholder"}
          </div>
          <div className="text-right ">
            <Link
              to="/forgot-password"
              className="text-sm text-[var(--cp)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--cp)] text-black font-semibold py-3 mt-4 rounded-lg hover:bg-[#4bc864] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/register"
              className="text-[var(--cp)] hover:text-[#3aa855] hover:underline transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
