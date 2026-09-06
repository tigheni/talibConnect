import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../context/authContext/useAuth";

import { useLoginModal } from "../context/loginContext/useLoginModal";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { openLogin } = useLoginModal();

  const hasOpenedModal = useRef(false);

  useEffect(() => {
    if (!loading && !user && !hasOpenedModal.current) {
      hasOpenedModal.current = true;

      openLogin(location.pathname);
    }
  }, [loading, user, location.pathname, location.state, openLogin]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return children;
}
