export default function getAuthErrorMessage(err) {
  if (!err) return "Something went wrong. Please try again.";

  // Network-level failure (no internet, DNS, CORS, Supabase down)
  if (
    err.name === "AuthRetryableFetchError" ||
    err.message === "Failed to fetch"
  ) {
    return "Can't reach the server. Check your internet connection and try again.";
  }

  const msg = err.message?.toLowerCase() || "";

  if (msg.includes("already registered") || msg.includes("already exists")) {
    return "An account with this email already exists. Try logging in instead.";
  }
  if (msg.includes("invalid email")) {
    return "That email address doesn't look valid.";
  }
  if (msg.includes("password")) {
    return err.message; // Supabase password policy messages are usually specific/useful
  }
  if (msg.includes("rate limit") || msg.includes("too many requests")) {
    return "Too many attempts. Please wait a moment before trying again.";
  }
  if (err.status >= 500) {
    return "Our server is having issues right now. Please try again shortly.";
  }

  return err.message || "Registration failed. Please try again.";
}
