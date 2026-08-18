import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getUser } from "../services/getUser";
import { isUserAdmin } from "../services/profiles";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdmin = async (currentUser) => {
    if (!currentUser) {
      setIsAdmin(false);
      return;
    }

    try {
      const admin = await isUserAdmin(currentUser.id);

      setIsAdmin(admin);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { user } = await getUser();

        setUser(user || null);
        await checkAdmin(user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user || null;

      setUser(currentUser);
      await checkAdmin(currentUser);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
