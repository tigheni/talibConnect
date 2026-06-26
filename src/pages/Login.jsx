import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import img from "../assets/7618724.jpg";
import { supabase } from "../lib/supabase";

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
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      navigate("/exams");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat sm:bg-none"
      style={!isMobile ? { backgroundImage: `url('${img}')` } : {}}
    >
      {/* Made the card smaller: reduced padding, max-width, and rounded corners */}
      <div className="w-full max-w-sm md:max-w-md flex justify-center font-inter flex-col items-center border border-gray-200 bg-white py-5 rounded-2xl shadow-md px-6">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-7 mb-4" />
        </Link>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-2 mb-3 text-sm text-center w-full">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1 text-sm"
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
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
          <div
            className={`text-red-500 text-xs mt-1 ${fieldErrors.email ? "visible" : "invisible"}`}
          >
            {fieldErrors.email || "placeholder"}
          </div>

          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1 mt-3 text-sm"
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
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
          <div
            className={`text-red-500 text-xs mt-1 ${fieldErrors.password ? "visible" : "invisible"}`}
          >
            {fieldErrors.password || "placeholder"}
          </div>

          <div className="text-right mt-1">
            <Link
              to="/forgot-password"
              className="text-xs text-[#5ae4a8] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5ae4a8] text-black font-semibold py-2.5 mt-4 rounded-lg hover:bg-[#4bcc94]/90 transition-all duration-300 disabled:opacity-50 text-sm"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#5ae4a8] hover:text-[#3aa855] hover:underline transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
