import { useState } from "react";

export function useFormErrors(initialErrors = {}) {
  const [errors, setErrors] = useState(initialErrors);
  const setErrorsFromResponse = (errorObject) => {
    setErrors(errorObject);
  };

  const setFieldError = (field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const clearFieldError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  const hasErrors = () => {
    return Object.values(errors).some((error) => error !== "");
  };

  const getErrorClass = (field) => {
    return errors[field] ? "border-red-500" : "border-gray-400";
  };

  const getErrorMessage = (field) => {
    return errors[field] || "";
  };

  return {
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    setErrorsFromResponse,
    hasErrors,
    getErrorClass,
    getErrorMessage,
  };
}
