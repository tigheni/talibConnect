import { useContext } from "react";
import { LoginModalContext } from "./loginModalContext";

export function useLoginModal() {
  const context = useContext(LoginModalContext);

  if (!context) {
    throw new Error("useLoginModal must be used inside LoginModalProvider");
  }

  return context;
}
