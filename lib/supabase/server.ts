import { createClient } from "@supabase/supabase-js";

let _client: ReturnType<typeof createClient> | null = null;

export function getSupabaseServer() {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  _client = createClient(url, key, {
    auth: { persistSession: false },
  });

  return _client;
}

// Convenience alias — same as calling getSupabaseServer() but reads more naturally
// in route handlers. Safe because route handlers only run at request-time.
export const supabaseServer = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    const client = getSupabaseServer();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});
