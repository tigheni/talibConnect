import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/logo.svg";
import img from "../assets/LoginBg.jpg";
import { loginUser } from "../services/loginUser";
import useMobile from "../hooks/useMobile";
import LoadingSpinner from "../components/LoadingSpinner";
import { validateLoginForm } from "../validators/validationLogin";
import { getSession } from "../services/sessionService";
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
  const { isMobile } = useMobile();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/exams";

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (session) {
        navigate(redirectTo, { replace: true });
      }
    };

    checkSession();
  }, [navigate, redirectTo]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errors = validateLoginForm(formData);

    if (errors.email || errors.password) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({
      email: "",
      password: "",
    });
    setLoading(true);

    try {
      await loginUser(formData.email, formData.password);

      if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate("/exams");
      }
    } catch (err) {
      setError(
        err.message ||
          "Could not log in. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat sm:bg-none"
      style={
        !isMobile ? { backgroundImage: `url('${img}')` } : { margin: "20px" }
      }
    >
      <div className="w-full max-w-sm md:max-w-md flex justify-center  flex-col items-center border border-gray-300 bg-white py-5 rounded-2xl shadow-md px-6">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-7 mb-4"
            width={220}
            height={110}
          />
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
            value={formData.password}
            placeholder="Password"
            required
            onChange={handleChange}
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
              className="text-xs text-[#52c76a] hover:underline"
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
              className="text-[#52c76a] hover:text-[#3aa855] hover:underline transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
