import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { prisma } from "../src/config/db";

dotenv.config();

const SEED_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@moksh.com";
const SEED_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin123";
const SEED_NAME = process.env.SEED_ADMIN_NAME || "Admin";

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL required");
    process.exit(1);
  }
  await prisma.$connect();
  const existing = await prisma.admin.findUnique({ where: { email: SEED_EMAIL } });
  if (existing) {
    console.log("Admin already exists:", SEED_EMAIL);
    await prisma.$disconnect();
    process.exit(0);
  }
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 12);
  await prisma.admin.create({
    data: { email: SEED_EMAIL, passwordHash, name: SEED_NAME },
  });
  console.log("Admin created:", SEED_EMAIL);
  await prisma.$disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
