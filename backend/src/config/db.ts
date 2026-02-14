import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

// Render (and similar) Postgres uses a self-signed TLS cert; allow it so the connection succeeds
const poolConfig =
  connectionString.includes("render.com") || process.env.NODE_ENV === "production"
    ? {
        connectionString,
        ssl: { rejectUnauthorized: false },
      }
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
