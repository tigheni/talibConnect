import { supabase } from "../lib/supabase";

export async function isCurrentUserAdmin() {
  // Authorization is evaluated server-side from the current Supabase session;
  // no client-provided user ID is trusted.
  const { data, error } = await supabase.rpc("is_admin");

  if (error) throw error;
  return data === true;
}
