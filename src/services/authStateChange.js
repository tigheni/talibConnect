import { supabase } from "../lib/supabase";
export async function authStateChange() {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, session) => {
    const currentUser = session?.user || null;
  });
}
