import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

// Cloud Postgres (Supabase, Render, etc.) often use TLS certs Node rejects by default.
// Create the pool ourselves so ssl.rejectUnauthorized is definitely applied.
const needsInsecureSSL =
  /sslmode=(require|prefer|verify-ca|verify-full)/i.test(connectionString) ||
  connectionString.includes("render.com") ||
  connectionString.includes("supabase.com") ||
  process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString,
  ...(needsInsecureSSL && { ssl: { rejectUnauthorized: false } }),
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function connectDb(): Promise<void> {
  await prisma.$connect();
}

export function disconnectDb(): Promise<void> {
  return prisma.$disconnect();
}
