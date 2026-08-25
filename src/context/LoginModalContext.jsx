import { createContext, useContext, useState } from "react";

const LoginModalContext = createContext();

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

export function useLoginModal() {
  const context = useContext(LoginModalContext);

  if (!context) {
    throw new Error("useLoginModal must be used inside LoginModalProvider");
  }

  return context;
}
