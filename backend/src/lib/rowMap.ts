/** Map DB snake_case row to camelCase for API (matches former Prisma shape). */
export function rowToCamel<T = Record<string, unknown>>(row: Record<string, unknown> | null): T | null {
  if (row == null) return null;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    out[camel] =
      v != null && typeof v === "object" && !Array.isArray(v) && !(v instanceof Date)
        ? rowToCamel(v as Record<string, unknown>)
        : v;
  }
  return out as T;
}

export function rowsToCamel<T = Record<string, unknown>>(rows: Record<string, unknown>[]): T[] {
  return rows.map((r) => rowToCamel(r) as T);
}
