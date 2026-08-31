const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validateLoginForm({ email, password }) {
  const errors = {
    email: "",
    password: "",
  };
  const mail = email?.trim();

  if (!mail) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(mail)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}
