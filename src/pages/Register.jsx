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
          navigate("/");
          //          openLogin(true);
        }, 2000);
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
      className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 bg-cover bg-center bg-no-repeat sm:bg-none"
      style={!isMobile ? { backgroundImage: `url('${img}')` } : undefined}
    >
      <div
        ref={formTopRef}
        className="w-full max-w-sm sm:max-w-lg lg:max-w-xl flex flex-col items-center justify-center border border-gray-300 bg-white px-5 py-6 sm:px-8 sm:py-8 rounded-2xl shadow-md"
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
