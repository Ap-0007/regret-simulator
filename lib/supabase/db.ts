/**
 * Unified DB accessor.
 *
 * - Uses Supabase when SUPABASE_SERVICE_ROLE_KEY is set.
 * - Falls back to an in-memory store for local dev when it isn't.
 */

import { isDevMode, getDevStore } from "./dev-store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getClient(): { from: (table: string) => any } {
  if (isDevMode()) {
    return getDevStore();
  }

  // Lazy import so the module doesn't throw at build-time without env vars
  const { getSupabaseServer } = require("./server") as typeof import("./server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getSupabaseServer() as any;
}

export const db = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  simulations: (): any => getClient().from("simulations"),
};
