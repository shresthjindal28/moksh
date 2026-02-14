import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

// Supabase, Render, and other cloud Postgres often use TLS certs that Node rejects by default.
// Allow the connection when SSL is requested (sslmode=require etc.) or when using known hosts.
const needsInsecureSSL =
  /sslmode=(require|prefer|verify-ca|verify-full)/i.test(connectionString) ||
  connectionString.includes("render.com") ||
  connectionString.includes("supabase.com") ||
  process.env.NODE_ENV === "production";

const poolConfig = needsInsecureSSL
  ? { connectionString, ssl: { rejectUnauthorized: false } }
  : { connectionString };

const adapter = new PrismaPg(poolConfig);

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
