import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate(`/login?redirect=${location.pathname}`, { replace: true });
      }
    };
    checkUser();
  }, [navigate]);
  return children;
}
