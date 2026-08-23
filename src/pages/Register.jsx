import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import img from "../assets/LoginBg.jpg";
import { supabase } from "../lib/supabase";
import useMobile from "../hooks/useMobile";
import toast from "react-hot-toast";
import getAuthErrorMessage from "../validators/getAuthErrorMessage";
import useRegisterValidation from "../validators/useRegisterValidation";
import { FormSection } from "../components/register/FormSection";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const { isMobile } = useMobile();
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
          <FormSection
            formData={formData}
            handleChange={handleChange}
            errors={errors}
            agreedToTerms={agreedToTerms}
            setAgreedToTerms={setAgreedToTerms}
            clearErrors={clearErrors}
            loading={loading}
          />
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
