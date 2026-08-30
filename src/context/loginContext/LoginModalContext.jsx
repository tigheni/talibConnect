import { useState } from "react";
import { LoginModalContext } from "./loginModalContext";
export function LoginModalProvider({ children }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/exams");

  const openLogin = (redirect = "/exams") => {
    setIsLoginOpen(true);
    setRedirectTo(redirect);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  return (
    <LoginModalContext.Provider
      value={{
        isLoginOpen,
        redirectTo,
        openLogin,
        closeLogin,
      }}
    >
      {children}
    </LoginModalContext.Provider>
  );
}
