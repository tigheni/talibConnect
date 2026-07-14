const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateForm = (formData, agreedToTerms) => {
  const errors = {};
  const username = formData.username.trim();
  const email = formData.email.trim();

  if (!username) {
    errors.username = "Username is required";
  } else if (!USERNAME_REGEX.test(username)) {
    errors.username =
      "Username must be 3-20 characters, letters/numbers/underscores only";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!formData.role) {
    errors.role = "Please select your role";
  }
  if (!formData.wilaya_id) {
    errors.wilaya_id = "Please select your state";
  }
  if (!formData.university_id) {
    errors.university_id = "Please select your university";
  }
  if (!formData.faculty_id) {
    errors.faculty_id = "Please select your faculty";
  }
  if (!formData.department_id) {
    errors.department_id = "Please select your department";
  }
  if (!agreedToTerms) {
    errors.agreement = "You must agree to the Terms and Privacy Policy";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

export default validateForm;
