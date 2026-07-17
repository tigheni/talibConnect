import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import img from "../assets/LoginBg.jpg";
import { supabase } from "../lib/supabase";
import usePasswordValidation from "../hooks/PasswordValidation";
import useMobile from "../hooks/useMobile";
import { useLocations } from "../hooks/useLocations";
import toast from "react-hot-toast";
import { validateForm } from "../validators/validateRegesterForm";
import getAuthErrorMessage from "../validators/getAuthErrorMessage";
export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    wilaya_id: "",
    university_id: "",
    faculty_id: "",
    department_id: "",
  });
  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    role: "",
    wilaya_id: "",
    university_id: "",
    faculty_id: "",
    department_id: "",
    agreement: "",
  });
  const isMobile = useMobile();
  const navigate = useNavigate();
  const formTopRef = useRef(null);

  const {
    wilayas,
    institutions,
    faculties,
    departments,
    selectedWilaya,
    selectedInstitution,
    selectedFaculty,
    setSelectedWilaya,
    setSelectedInstitution,
    setSelectedFaculty,
    error: locationsError, // assumes useLocations can surface a load error; safe if undefined
  } = useLocations();

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

    if (name === "username" || name === "email" || name === "role") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (fieldErrors[name]) {
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
      }
    } else if (name === "password") {
      setPassword(value);
      clearErrors("password");
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
      clearErrors("confirmPassword");
    }
  };

  // Single handler for the cascading location selects — replaces the
  // duplicated handleChange + setSelected... + setFormData calls
  const handleLocationChange = (field, setter) => (e) => {
    const { value } = e.target;

    setter(value);
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const { errors } = validateForm(formData, agreedToTerms);
    const passwordsOk = validatePasswords();

    if (Object.keys(errors).length > 0 || !passwordsOk) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      formTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    if (!wilayas?.length) {
      toast.error(
        "Location data hasn't finished loading. Please wait a moment and try again.",
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password,
        options: {
          data: {
            username: formData.username.trim(),
            role: formData.role,
            wilaya_id: formData.wilaya_id ? Number(formData.wilaya_id) : null,
            university_id: formData.university_id
              ? Number(formData.university_id)
              : null,
            faculty_id: formData.faculty_id
              ? Number(formData.faculty_id)
              : null,
            department_id: formData.department_id
              ? Number(formData.department_id)
              : null,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (!data?.user) {
        throw new Error(
          "Registration didn't complete as expected. Please try again.",
        );
      }

      if (data.session) {
        navigate("/exams");
      } else {
        toast.success("Check your email to confirm your account.");
      }
    } catch (err) {
      const friendlyMessage = getAuthErrorMessage(err);
      toast.error(friendlyMessage);
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
        className="w-full max-w-sm md:max-w-md flex justify-center font-inter flex-col items-center border border-gray-200 bg-white py-5 rounded-2xl shadow-md px-6"
      >
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="h-7 mb-4"
            width={220}
            height={110}
          />
        </Link>

        {locationsError && (
          <div
            role="alert"
            className="bg-amber-500/10 border border-amber-500 text-amber-600 rounded-lg p-2 mb-3 text-sm text-center w-full"
          >
            Couldn't load location data. Some fields may not work — try
            refreshing the page.
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full" noValidate>
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
            maxLength={20}
            autoComplete="username"
            aria-invalid={!!fieldErrors.username}
            aria-describedby="username-error"
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
          <div
            id="username-error"
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
            autoComplete="email"
            aria-invalid={!!fieldErrors.email}
            aria-describedby="email-error"
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
          <div
            id="email-error"
            className={`text-red-500 text-xs mt-1 ${fieldErrors.email ? "visible" : "invisible"}`}
          >
            {fieldErrors.email || "placeholder"}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Are you a student or teacher?
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              aria-invalid={!!fieldErrors.role}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3"
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div
            className={`text-red-500 text-xs mt-1 ${fieldErrors.role ? "visible" : "invisible"}`}
          >
            {fieldErrors.role || "placeholder"}
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              State (Wilaya):
            </label>
            <select
              name="wilaya_id"
              value={selectedWilaya}
              onChange={handleLocationChange("wilaya_id", setSelectedWilaya)}
              aria-invalid={!!fieldErrors.wilaya_id}
              disabled={!wilayas?.length}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5ae4a8] disabled:opacity-50"
            >
              <option value="">
                {wilayas?.length ? "Select your state" : "Loading states..."}
              </option>
              {wilayas?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name_en}
                </option>
              ))}
            </select>
          </div>
          <div
            className={`text-red-500 text-xs mt-1 ${fieldErrors.wilaya_id ? "visible" : "invisible"}`}
          >
            {fieldErrors.wilaya_id || "placeholder"}
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              University:
            </label>
            <select
              name="university_id"
              value={selectedInstitution}
              onChange={handleLocationChange(
                "university_id",
                setSelectedInstitution,
              )}
              aria-invalid={!!fieldErrors.university_id}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5ae4a8] disabled:opacity-50"
              disabled={!selectedWilaya}
            >
              <option value="">Select your university</option>
              {institutions?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name_en}
                </option>
              ))}
            </select>
            {selectedWilaya && institutions?.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                No institutions found for this state
              </p>
            )}
          </div>
          <div
            className={`text-red-500 text-xs mt-1 ${fieldErrors.university_id ? "visible" : "invisible"}`}
          >
            {fieldErrors.university_id || "placeholder"}
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Faculty:
            </label>
            <select
              name="faculty_id"
              value={selectedFaculty}
              onChange={handleLocationChange("faculty_id", setSelectedFaculty)}
              aria-invalid={!!fieldErrors.faculty_id}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5ae4a8] disabled:opacity-50"
              disabled={!selectedInstitution}
            >
              <option value="">Select your faculty</option>
              {faculties?.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name_en}
                </option>
              ))}
            </select>
          </div>
          <div
            className={`text-red-500 text-xs mt-1 ${fieldErrors.faculty_id ? "visible" : "invisible"}`}
          >
            {fieldErrors.faculty_id || "placeholder"}
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Department:
            </label>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleLocationChange("department_id", () => {})}
              aria-invalid={!!fieldErrors.department_id}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5ae4a8] disabled:opacity-50"
              disabled={!selectedFaculty}
            >
              <option value="">Select your department</option>
              {departments?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name_en}
                </option>
              ))}
            </select>
          </div>
          <div
            className={`text-red-500 text-xs mt-1 ${fieldErrors.department_id ? "visible" : "invisible"}`}
          >
            {fieldErrors.department_id || "placeholder"}
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
            value={password}
            placeholder="Password"
            onChange={handleChange}
            autoComplete="new-password"
            aria-invalid={!!passwordErrors.password}
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
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={handleChange}
            autoComplete="new-password"
            aria-invalid={!!passwordErrors.confirmPassword}
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-[#5ae4a8] text-sm"
          />
          <div
            className={`text-red-500 text-xs mt-1 ${passwordErrors.confirmPassword ? "visible" : "invisible"}`}
          >
            {passwordErrors.confirmPassword || "placeholder"}
          </div>

          <div className="mb-4">
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="agreedToTerms"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (fieldErrors.agreement) {
                    setFieldErrors((prev) => ({ ...prev, agreement: "" }));
                  }
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
            {fieldErrors.agreement && (
              <div className="text-red-500 text-xs mt-1">
                {fieldErrors.agreement}
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
