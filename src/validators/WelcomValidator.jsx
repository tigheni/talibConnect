import { useState } from "react";

const useWelcomeValidation = () => {
  const [errors, setErrors] = useState({});

  const validate = (formData, hasNoDepartments = false) => {
    const newErrors = {};

    if (!formData.role) {
      newErrors.role = "Please select your role";
    }
    if (formData.role === "student") {
      if (!formData.study_system) {
        newErrors.study_system = "Please select your study system";
      }
      if (!formData.year_of_study) {
        newErrors.year_of_study = "Please select your year of study";
      }
    }
    if (!formData.wilaya) {
      newErrors.wilaya = "Please select your state";
    }
    if (!formData.institution) {
      newErrors.institution = "Please select your university";
    }
    if (!formData.faculty) {
      newErrors.faculty = "Please select your faculty";
    }
    if (!hasNoDepartments && !formData.department) {
      newErrors.department = "Please select your department";
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const clearErrors = (field) =>
    setErrors((prev) => {
      if (!(field in prev)) return prev;

      const nextErrors = { ...prev };
      delete nextErrors[field];

      return nextErrors;
    });

  return { errors, validate, clearErrors };
};

export default useWelcomeValidation;
