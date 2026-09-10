import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { validateLoginForm } from "../validators/validationLogin";
import { loginUser } from "../services/loginUser";
import { useAuth } from "../context/authContext/useAuth";
export default function AdminLogin({ onClose, redirectTo = "/admin" }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [redirectPending, setRedirectPending] = useState(false);
  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const close = onClose || (() => navigate("/"));
  const { user, isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!redirectPending || authLoading || !user) return;

    if (!isAdmin) {
      return;
    }

    if (onClose) onClose();
    navigate(redirectTo, { replace: true });
  }, [authLoading, isAdmin, navigate, onClose, redirectPending, redirectTo, user]);

  const authorizationError =
    redirectPending && !authLoading && user && !isAdmin
      ? "This account is not authorized to access the admin panel."
      : "";

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
      // Wait for AuthProvider to receive the session and finish the server-side
      // admin check before entering /admin. Navigating immediately races that
      // update and causes the first login attempt to bounce back to login.
      setRedirectPending(true);
    } catch (err) {
      setError(
        err.message ||
          "Could not log in. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm sm:max-w-lg lg:max-w-xl flex flex-col items-center border border-gray-300 bg-white py-6 sm:py-8 rounded-2xl shadow-2xl px-5 sm:px-8"
      >
        <button
          onClick={close}
          className="absolute right-4 top-3 text-2xl text-gray-400 hover:text-gray-800 transition"
          aria-label="Close login"
        >
          ×
        </button>

        <Link to="/" onClick={close}>
          <img
            src={logo}
            alt="Logo"
            className="h-7 mb-4"
            width={220}
            height={110}
          />
        </Link>

        {(error || authorizationError) && (
          <div
            role="alert"
            className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-2 mb-3 text-sm text-center w-full"
          >
            {error || authorizationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full" noValidate>
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
            onChange={handleChange}
            aria-invalid={!!fieldErrors.email}
            aria-describedby="login-email-error"
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />

          <div
            id="login-email-error"
            className={`text-red-500 text-xs mt-1 ${
              fieldErrors.email ? "visible" : "invisible"
            }`}
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
            onChange={handleChange}
            aria-invalid={!!fieldErrors.password}
            aria-describedby="login-password-error"
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />

          <div
            id="login-password-error"
            className={`text-red-500 text-xs mt-1 ${
              fieldErrors.password ? "visible" : "invisible"
            }`}
          >
            {fieldErrors.password || "placeholder"}
          </div>

          <div className="text-right mt-1">
            <Link
              to="/admin/forgot-password"
              onClick={close}
              className="text-xs text-[#2f9e6d] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || redirectPending}
            className="w-full bg-[#5ae4a8] text-black font-semibold py-2.5 mt-4 rounded-lg hover:bg-[#2f9e6d] transition-all duration-300 disabled:opacity-50 text-sm"
          >
            {loading || redirectPending ? "Verifying admin access..." : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
}
