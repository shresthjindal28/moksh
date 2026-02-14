import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../src/config/db";

const CATEGORIES = [
  { name: "Kurti", slug: "kurti", order: 0 },
  { name: "Bedsheet", slug: "bedsheet", order: 1 },
  { name: "Jewellery", slug: "jewellery", order: 2 },
];

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL required");
    process.exit(1);
  }
  await prisma.$connect();
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: {},
    });
    console.log("Category OK:", cat.slug);
  }
  console.log("Done. Categories:", CATEGORIES.map((c) => c.slug).join(", "));
  await prisma.$disconnect();
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
