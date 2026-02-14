"use server";

import { getLatestProduct, getLatestProducts, getPublicSettings } from "@/lib/api";
import type { ProductListItem, PublicSettings } from "@/lib/api";

const DEFAULT_SETTINGS: PublicSettings = {
  defaultWhatsappNumber: "",
  whatsappMessageTemplate: "Hi, I'm interested in {productName}",
};

/** Server action: fetches the latest uploaded product for hero. */
export async function getLatestProductAction(): Promise<ProductListItem | null> {
  return getLatestProduct();
}

/** Server action: fetches the 4 latest products + settings for Trending Artifacts. */
export async function getLatestProductsAction(): Promise<{
  products: ProductListItem[];
  settings: PublicSettings;
}> {
  try {
    const [products, settings] = await Promise.all([
      getLatestProducts(4),
      getPublicSettings().catch(() => DEFAULT_SETTINGS),
    ]);
    return { products, settings };
  } catch {
    return { products: [], settings: DEFAULT_SETTINGS };
  }
}
