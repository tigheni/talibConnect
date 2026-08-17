import { useNavigate, useLocation } from "react-router-dom";
import { getUser } from "../services/getUser";
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

      const { user } = await getUser();
      if (!user) {
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
