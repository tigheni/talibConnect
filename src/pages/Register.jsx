import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import img from "../assets/7618724.jpg";
import { supabase } from "../lib/supabase";
import usePasswordValidation from "../hooks/PasswordValidation";
import useMobile from "../hooks/useMobile";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
  });
  const isMobile = useMobile();
  const navigate = useNavigate();

  const {
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    errors: passwordErrors,
    validatePasswords,
    clearErrors,
  } = usePasswordValidation();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "username" || name === "email") {
      setFormData({
        ...formData,
        [name]: value,
      });
      if (fieldErrors[name]) {
        setFieldErrors({ ...fieldErrors, [name]: "" });
      }
    } else if (name === "password") {
      setPassword(value);
      clearErrors("password");
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
      clearErrors("confirmPassword");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({
      username: "",
      email: "",
    });

    if (!formData.username) {
      setFieldErrors((prev) => ({ ...prev, username: "Username is required" }));
      return;
    }
    if (!formData.email) {
      setFieldErrors((prev) => ({ ...prev, email: "Email is required" }));
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: password,
        options: {
          data: {
            username: formData.username,
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat sm:bg-none"
      style={
        !isMobile ? { backgroundImage: `url('${img}')` } : { margin: "20px" }
      }
    >
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
            htmlFor="username"
            className="block mb-1 font-medium text-gray-700 text-sm"
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
            required
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
          <div
            className={`text-red-500 text-xs mt-1 ${fieldErrors.username ? "visible" : "invisible"}`}
          >
            {fieldErrors.username || "placeholder"}
          </div>

          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1 mt-3 text-sm"
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
            value={password} // Use password from hook
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
          <div
            className={`text-red-500 text-xs mt-1 ${passwordErrors.password ? "visible" : "invisible"}`}
          >
            {passwordErrors.password || "placeholder"}
          </div>

          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-medium mb-1 mt-3 text-sm"
          >
            Confirm Password:
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={confirmPassword} // Use confirmPassword from hook
            placeholder="Confirm Password"
            required
            onChange={handleChange}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
          <div
            className={`text-red-500 text-xs mt-1 ${passwordErrors.confirmPassword ? "visible" : "invisible"}`}
          >
            {passwordErrors.confirmPassword || "placeholder"}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5ae4a8] text-black font-semibold py-2.5 mt-4 rounded-lg hover:bg-[#4bcc94]/90 transition-all duration-300 disabled:opacity-50 text-sm"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#5ae4a8] hover:text-[#3aa855] hover:underline transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
