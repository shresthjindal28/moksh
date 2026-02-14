import "dotenv/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
}

/** Server-only Supabase client (service role). Use for all DB access. */
export const supabase: SupabaseClient = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});

/** Throw if Supabase returned an error; otherwise return data. */
export function assertOk<T>(result: { data: T; error: unknown }): T {
  if (result.error) throw result.error;
  return result.data;
}
