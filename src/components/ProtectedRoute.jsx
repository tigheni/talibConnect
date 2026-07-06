import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const checkUser = async () => {
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
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="flex gap-2">
          <div className="w-4 h-4 bg-[#4FE56D] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 bg-[#4FE56D] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-4 h-4 bg-[#4FE56D] rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : null;
}
