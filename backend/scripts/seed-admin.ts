import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import { supabase, assertOk } from "../src/config/supabase";

const SEED_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@moksh.com";
const SEED_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin123";
const SEED_NAME = process.env.SEED_ADMIN_NAME || "Admin";

async function seed() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required");
    process.exit(1);
  }
  const existing = await supabase.from("Admin").select("id").eq("email", SEED_EMAIL).maybeSingle();
  const row = assertOk(existing);
  if (row) {
    console.log("Admin already exists:", SEED_EMAIL);
    process.exit(0);
  }
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 12);
  const now = new Date().toISOString();
  await supabase.from("Admin").insert({
    email: SEED_EMAIL,
    password_hash: passwordHash,
    name: SEED_NAME,
    created_at: now,
    updated_at: now,
  });
  console.log("Admin created:", SEED_EMAIL);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
