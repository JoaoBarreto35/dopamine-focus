import { supabase } from "../lib/supabaseClient";

export async function checkSupabaseConnection(): Promise<boolean> {
  const { error } = await supabase.from("achievements").select("id").limit(1);

  return !error;
}