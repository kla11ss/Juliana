import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/database";
import { getServerSupabaseEnv } from "@/lib/env";

let serviceClient: SupabaseClient<Database> | null = null;

export function getServiceSupabaseClient() {
  if (serviceClient) {
    return serviceClient;
  }

  const { url, serviceRoleKey } = getServerSupabaseEnv();

  serviceClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return serviceClient;
}
