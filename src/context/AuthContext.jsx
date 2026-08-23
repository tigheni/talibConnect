import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getSession } from "../services/sessionService";
import { isUserAdmin } from "../services/profiles";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
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
      console.error("Failed to fetch admin status:", error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const currentSession = await getSession();

        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        await checkAdmin(currentSession?.user ?? null);
      } catch (error) {
        console.error("Failed to initialize auth:", error);

        setSession(null);
        setUser(null);
        setIsAdmin(false);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      const currentUser = newSession?.user ?? null;

      setSession(newSession);
      setUser(currentUser);

      setTimeout(async () => {
        if (!mounted) return;

        await checkAdmin(currentUser);

        if (mounted) {
          setLoading(false);
        }
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isAdmin,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
