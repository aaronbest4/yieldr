import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export { schema };
export { and, eq, sql } from "drizzle-orm";

export type Database = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as { yieldrDb?: Database };

function connect(): Database {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to apps/web/.env.local.");
  }
  // `prepare: false` keeps us compatible with transaction-mode poolers (Neon, Supabase).
  const client = postgres(url, { max: 10, prepare: false });
  return drizzle(client, { schema, casing: "snake_case" });
}

/** Lazily created so that importing this module never needs a database (e.g. during builds). */
export function getDb(): Database {
  if (!globalForDb.yieldrDb) globalForDb.yieldrDb = connect();
  return globalForDb.yieldrDb;
}
