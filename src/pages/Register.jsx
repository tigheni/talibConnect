import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import img from "../assets/LoginBg.jpg";
import { supabase } from "../lib/supabase";
import usePasswordValidation from "../hooks/PasswordValidation";
import useMobile from "../hooks/useMobile";
import { useLocations } from "../hooks/useLocations";

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
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
  });
  const isMobile = useMobile();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
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
    setError("");
    setMessage("");

    if (name === "username" || name === "email" || name === "role") {
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
    setMessage("");
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

      if (error) throw error;

      if (data.session) {
        navigate("/exams");
      } else {
        setMessage("Check your email to confirm your account.");
      }
    } catch (err) {
      setError(
        err.message || "Could not create your account. Please try again.",
      );
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
        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-600 rounded-lg p-2 mb-3 text-sm text-center w-full">
            {message}
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
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Are you a student or teacher?
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3"
              required
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              State (Wilaya):
            </label>
            <select
              name="wilaya_id"
              value={selectedWilaya}
              onChange={(e) => {
                setSelectedWilaya(e.target.value);
                setFormData({ ...formData, wilaya_id: e.target.value });
              }}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5ae4a8]"
              required
            >
              <option value="">Select your state</option>
              {wilayas.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name_en}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              University:
            </label>
            <select
              name="university_id"
              value={selectedInstitution}
              onChange={(e) => {
                setSelectedInstitution(e.target.value);
                setFormData({ ...formData, university_id: e.target.value });
              }}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5ae4a8]"
              required
              disabled={!selectedWilaya}
            >
              <option value="">Select your university</option>
              {institutions.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name_en}
                </option>
              ))}
            </select>
            {selectedWilaya && institutions.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                No institutions found for this state
              </p>
            )}
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Faculty:
            </label>
            <select
              name="faculty_id"
              value={selectedFaculty}
              onChange={(e) => {
                setSelectedFaculty(e.target.value);
                setFormData({
                  ...formData,
                  faculty_id: e.target.value,
                });
              }}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5ae4a8]"
              required
              disabled={!selectedInstitution}
            >
              <option value="">Select your faculty</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name_en}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Department:
            </label>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={(e) => {
                setFormData({ ...formData, department_id: e.target.value });
              }}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5ae4a8]"
              required
              disabled={!selectedFaculty}
            >
              <option value="">Select your department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name_en}
                </option>
              ))}
            </select>
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
            value={confirmPassword}
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
