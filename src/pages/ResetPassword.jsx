import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const validatePasswords = () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setError("");
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    if (!token) {
      setError(
        "Invalid or missing reset token. Please request a new password reset link.",
      );
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    setLoading(true);

    try {
      console.log("Resetting password for token:", token);
      console.log("New password:", password);

      setMessage("Password reset successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[95vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white py-8 px-8 rounded-3xl shadow-lg border border-gray-300">
        <Link to="/" className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-8" />
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
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            required
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[var(--cp)] mb-4"
          />

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
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[var(--cp)] mb-6"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--cp)] text-black font-semibold py-3 rounded-lg hover:bg-[#4bc864] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
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
    </div>
  );
}
