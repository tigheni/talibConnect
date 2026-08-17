import { supabase } from "../lib/supabase";

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("role, username")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
export async function isUserAdmin(userId) {
  const profile = await getProfile(userId);

  return profile?.role === "admin";
}
