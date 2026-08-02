import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import img from "../assets/LoginBg.jpg";
import { supabase } from "../lib/supabase";
import useMobile from "../hooks/useMobile";
import toast from "react-hot-toast";
import getAuthErrorMessage from "../validators/getAuthErrorMessage";
import useRegisterValidation from "../validators/useRegisterValidation";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const isMobile = useMobile();
  const navigate = useNavigate();
  const formTopRef = useRef(null);
  const { errors, validate, clearErrors } = useRegisterValidation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearErrors(name);
  };

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const result = validate(formData, agreedToTerms);

    if (!result.isValid) {
      formTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      return;
    }
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            username: formData.username.trim(),
          },
          emailRedirectTo: `${window.location.origin}/complete-profile`,
        },
      });

      if (signUpError) throw signUpError;
      if (!data?.user) {
        throw new Error(
          "Registration didn't complete as expected. Please try again.",
        );
      }

      if (data.session) {
        navigate("/complete-profile");
      } else {
        toast.success("Check your email to confirm your account.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      const friendlyMessage = getAuthErrorMessage(err);
      toast.error(`talibConnect: ${friendlyMessage}`);
      formTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat sm:bg-none"
      style={
        !isMobile ? { backgroundImage: `url('${img}')` } : { margin: "20px" }
      }
    >
      <div
        ref={formTopRef}
        className="w-full max-w-sm md:max-w-md flex justify-center  flex-col items-center border border-gray-300 bg-white py-4 rounded-2xl shadow-md px-6"
      >
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-7 m-6"
            width={220}
            height={110}
          />
        </Link>

        <form onSubmit={handleSubmit} className="w-full" noValidate>
          <label
            htmlFor="username"
            className="block mb-2 font-medium text-gray-700 text-sm"
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
            maxLength={20}
            autoComplete="username"
            aria-invalid={!!errors.username}
            aria-describedby="username-error"
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
          <div
            id="username-error"
            className={`text-red-500 text-xs mt-1 ${errors.username ? "visible" : "invisible"}`}
          >
            {errors.username || "placeholder"}
          </div>

          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2 mt-1 text-sm"
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
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
          <div
            id="email-error"
            className={`text-red-500 text-xs mt-1 ${errors.email ? "visible" : "invisible"}`}
          >
            {errors.email || "placeholder"}
          </div>

          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2 mt-1 text-sm"
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
            autoComplete="new-password"
            aria-invalid={errors.password}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
          <div
            className={`text-red-500 text-xs mt-1 ${errors.password ? "visible" : "invisible"}`}
          >
            {errors.password || "placeholder"}
          </div>

          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-medium mb-2 mt-1 text-sm"
          >
            Confirm Password:
          </label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirm Password"
            onChange={handleChange}
            autoComplete="new-password"
            aria-invalid={errors.confirmPassword}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
          <div
            className={`text-red-500 text-xs mt-1 ${errors.confirmPassword ? "visible" : "invisible"}`}
          >
            {errors.confirmPassword || "placeholder"}
          </div>

          <div className="mb-4">
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="agreedToTerms"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  clearErrors("agreement");
                }}
                className="mt-1"
              />
              <span>
                I agree to the{" "}
                <Link
                  to="/terms"
                  target="_blank"
                  className="text-[#52c76a] hover:underline"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  target="_blank"
                  className="text-[#52c76a] hover:underline"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreement && (
              <div className="text-red-500 text-xs mt-1">
                {errors.agreement}
              </div>
            )}
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
              className="text-[#52c76a] hover:text-[#3aa855] hover:underline transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
