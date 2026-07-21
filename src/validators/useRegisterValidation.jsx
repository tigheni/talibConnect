import { useState } from "react";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const useRegisterValidation = () => {
  const [errors, setErrors] = useState({});

  const validate = (formData, agreedToTerms) => {
    const newErrors = {};

    const username = formData.username.trim();
    const email = formData.email.trim();

    if (!username) {
      newErrors.username = "Username is required";
    } else if (!USERNAME_REGEX.test(username)) {
      newErrors.username =
        "Username must be 3-20 characters and contain only letters, numbers, and underscores";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (!agreedToTerms) {
      newErrors.agreement = "You must agree to the Terms and Privacy Policy";
    }

    const isValid = Object.keys(newErrors).length === 0;
    setErrors(newErrors);

    return {
      isValid,
      errors: newErrors,
    };
  };

  const clearErrors = (field) =>
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });

  return {
    errors,
    validate,
    clearErrors,
  };
};

export default useRegisterValidation;
