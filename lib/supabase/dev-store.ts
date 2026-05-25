/**
 * In-memory fallback store used when Supabase env vars are not set.
 * Data is lost on server restart — for local development only.
 */

import { v4 as uuid } from "uuid";
import type { SimulationInput, SimulationResult } from "@/types/simulation";

interface DevRecord {
  id: string;
  share_token: string;
  input: SimulationInput;
  result: SimulationResult | null;
  created_at: string;
  completed_at: string | null;
}

// Attach to globalThis so the Map survives Next.js hot-module reloads in dev
const g = globalThis as typeof globalThis & { __regret_store?: Map<string, DevRecord> };
if (!g.__regret_store) g.__regret_store = new Map<string, DevRecord>();
const store = g.__regret_store;

function makeToken() {
  return Math.random().toString(16).slice(2, 12);
}

type Op = "select" | "insert" | "update";

/** Chainable query builder that mirrors the Supabase JS subset we use */
class Query {
  private _op: Op = "select";
  private _filters: Array<{ field: string; value: string }> = [];
  private _insertData: { input: SimulationInput } | null = null;
  private _updateData: Partial<DevRecord> | null = null;
  private _isSingle = false;
  // tracks whether .select() was chained after .insert() / .update()
  private _returningSelect = false;

  select(_fields?: string) {
    if (this._op === "insert" || this._op === "update") {
      this._returningSelect = true; // e.g. .insert({}).select("id, share_token")
    } else {
      this._op = "select";
    }
    return this;
  }

  insert(data: { input: SimulationInput }) {
    this._op = "insert";
    this._insertData = data;
    return this;
  }

  update(data: Partial<{ result: SimulationResult; completed_at: string }>) {
    this._op = "update";
    this._updateData = data as Partial<DevRecord>;
    return this;
  }

  eq(field: string, value: string) {
    this._filters.push({ field, value });
    return this;
  }

  single() {
    this._isSingle = true;
    return this._run();
  }

  // Allow `await query` without .single()
  then(
    resolve: (v: { data: unknown; error: null | { message: string } }) => void,
    reject?: (e: unknown) => void
  ) {
    try {
      resolve(this._run());
    } catch (e) {
      reject?.(e);
    }
  }

  private _matches(record: DevRecord): boolean {
    return this._filters.every(
      (f) => (record as unknown as Record<string, unknown>)[f.field] === f.value
    );
  }

  private _run(): { data: unknown; error: null | { message: string } } {
    // ── INSERT ────────────────────────────────────────────────────────────────
    if (this._op === "insert" && this._insertData) {
      const id = uuid();
      const token = makeToken();
      const record: DevRecord = {
        id,
        share_token: token,
        input: this._insertData.input,
        result: null,
        created_at: new Date().toISOString(),
        completed_at: null,
      };
      store.set(id, record);
      // Return shape Supabase returns after .insert().select().single()
      return { data: this._isSingle ? record : [record], error: null };
    }

    // ── UPDATE ────────────────────────────────────────────────────────────────
    if (this._op === "update" && this._updateData) {
      const matched = Array.from(store.values()).filter((r) => this._matches(r));
      matched.forEach((r) => {
        Object.assign(r, this._updateData);
        store.set(r.id, r);
      });
      return { data: this._isSingle ? (matched[0] ?? null) : matched, error: null };
    }

    // ── SELECT ────────────────────────────────────────────────────────────────
    const rows = Array.from(store.values()).filter((r) => this._matches(r));
    if (this._isSingle) {
      return rows.length > 0
        ? { data: rows[0], error: null }
        : { data: null, error: { message: "Not found" } };
    }
    return { data: rows, error: null };
  }
}

export function getDevStore() {
  return {
    from: (_tableName: string) => new Query(),
  };
}

export function isDevMode() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return key.trim() === "";
}
