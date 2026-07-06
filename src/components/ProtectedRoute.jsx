import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import LoadingSpinner from "./LoadingSpinner";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);

      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate(`/login?redirect=${location.pathname}`, { replace: true });
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    checkUser();
  }, [navigate, location.pathname]);

  if (loading) {
    return <LoadingSpinner />;
  }
  return isAuthenticated ? children : null;
}
