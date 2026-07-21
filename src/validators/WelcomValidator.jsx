import { useState } from "react";

const useWelcomeValidation = () => {
  const [errors, setErrors] = useState({});

  const validate = (formData) => {
    const newErrors = {};
    if (!formData.role) newErrors.role = "Please select your role";
    if (!formData.wilaya) newErrors.wilaya = "Please select your state";
    if (!formData.institution)
      newErrors.institution = "Please select your university";
    if (!formData.faculty) newErrors.faculty = "Please select your faculty";
    if (!formData.department)
      newErrors.department = "Please select your department";

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
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
    isValid: Object.keys(errors).length === 0,
  };
};

export default useWelcomeValidation;
