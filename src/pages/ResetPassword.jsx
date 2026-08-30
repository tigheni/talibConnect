import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import usePasswordValidation from "../validators/passwordValidation";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/authContext/useAuth";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
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

  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) return;

    const exchangeCode = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setError(
          "Invalid or expired reset link. Please request a new password reset link.",
        );
      }
    };

    exchangeCode();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!validatePasswords()) {
      return;
    }

    setLoading(true);

    try {
      if (!session) {
        setError(
          "Invalid or expired reset link. Please request a new password reset link.",
        );
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-[95vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white py-8 px-8 rounded-3xl shadow-lg border border-gray-300">
        <Link to="/" className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-8" width={250} height={100} />
        </Link>

        <h1 className="text-2xl font-bold text-center mb-2">
          Create New Password
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your new password below
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-2 mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-500/10 border border-green-500 text-green-600 rounded-lg p-2 mb-4 text-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2"
          >
            New Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearErrors();
            }}
            placeholder="Enter new password"
            required
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[var(--cp)]"
          />
          <div
            className={`text-red-500 text-xs mt-1 mb-4 ${passwordErrors.password ? "visible" : "invisible"}`}
          >
            {passwordErrors.password || "placeholder"}
          </div>

          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-medium mb-2"
          >
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearErrors();
            }}
            placeholder="Confirm new password"
            required
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[var(--cp)]"
          />
          <div
            className={`text-red-500 text-xs mt-1 mb-6 ${passwordErrors.confirmPassword ? "visible" : "invisible"}`}
          >
            {passwordErrors.confirmPassword || "placeholder"}
          </div>

          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full bg-[var(--cp)] text-black font-semibold py-3 rounded-lg hover:bg-[#4bc864] transition-all duration-300 disabled:opacity-50"
          >
            {authLoading
              ? "Verifying reset link..."
              : loading
                ? "Resetting..."
                : "Reset Password"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-[var(--cp)] hover:underline text-sm"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
