/**
 * Legacy DB module: no-op for compatibility. All data access now goes through Supabase (src/config/supabase.ts).
 */
export async function connectDb(): Promise<void> {
  // No-op; Supabase client is ready on import
}

export function disconnectDb(): Promise<void> {
  return Promise.resolve();
}
