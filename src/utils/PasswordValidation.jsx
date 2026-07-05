import { useState } from "react";

const usePasswordValidation = (initialState = {}) => {
  const [password, setPassword] = useState(initialState.password || "");
  const [confirmPassword, setConfirmPassword] = useState(
    initialState.confirmPassword || "",
  );
  const [errors, setErrors] = useState({});

  const validatePasswords = () => {
    const newErrors = {};

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    validatePasswords,
    clearErrors,
    isValid: Object.keys(errors).length === 0,
  };
};

export default usePasswordValidation;
