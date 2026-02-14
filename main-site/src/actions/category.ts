"use server";

import { getCategories } from "@/lib/api";
import type { Category } from "@/lib/api";

/** Server action: fetches all categories from DB (for Curated Excellence section). */
export async function getCategoriesAction(): Promise<Category[]> {
  return getCategories();
}
