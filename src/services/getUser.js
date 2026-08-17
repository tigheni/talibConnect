import { supabase } from "../lib/supabase";

export async function getUser() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  return { user };
}
