import dotenv from "dotenv";
dotenv.config();

import { supabase, assertOk } from "../src/config/supabase";

const CATEGORIES = [
  { name: "Kurti", slug: "kurti", order: 0 },
  { name: "Bedsheet", slug: "bedsheet", order: 1 },
  { name: "Jewellery", slug: "jewellery", order: 2 },
];

async function seed() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required");
    process.exit(1);
  }
  for (const cat of CATEGORIES) {
    const existing = await supabase.from("Category").select("id").eq("slug", cat.slug).maybeSingle();
    if (assertOk(existing)) {
      console.log("Category exists:", cat.slug);
    } else {
      const now = new Date().toISOString();
      await supabase.from("Category").insert({ ...cat, created_at: now, updated_at: now });
      console.log("Category OK:", cat.slug);
    }
  }
  console.log("Done. Categories:", CATEGORIES.map((c) => c.slug).join(", "));
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
