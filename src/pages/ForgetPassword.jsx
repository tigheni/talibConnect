import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";
import { supabase } from "../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;

      setMessage(
        "If an account exists with this email, you will receive a password reset link.",
      );
      setEmail("");
    } catch (err) {
      setError("Something went wrong. Please try again.", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-[95vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white py-8 px-8 rounded-lg shadow-lg border border-gray-300">
        <Link to="/" className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-8" width={250} height={100} />
        </Link>

        <h1 className="text-2xl font-bold text-center mb-2">
          Forgot Password?
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Enter your email and we'll send you a reset link
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
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email Address:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:border-[var(--cp)] mb-6"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--cp)] text-black font-semibold py-3 rounded-lg hover:bg-[#4bc864] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
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
