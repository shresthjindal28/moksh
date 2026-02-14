const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const BASE = `${API_URL}/api`;

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category: Category;
  images: string[];
  whatsappNumber?: string;
  isActive: boolean;
}

export interface ProductDetail extends ProductListItem {
  whatsappNumber?: string;
}

export interface PublicSettings {
  defaultWhatsappNumber: string;
  whatsappMessageTemplate: string;
}

export async function getProducts(params?: {
  category?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
}): Promise<{ items: ProductListItem[]; total: number }> {
  const search = new URLSearchParams();
  if (params?.isActive !== false) search.set("isActive", "true");
  if (params?.category) search.set("category", params.category);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit ?? 20));
  if (params?.minPrice != null) search.set("minPrice", String(params.minPrice));
  if (params?.maxPrice != null) search.set("maxPrice", String(params.maxPrice));
  const res = await fetch(`${BASE}/products?${search}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  const json = await res.json();
  return json.data;
}

/** Fetches the single latest (most recently created) active product — for hero section. Returns null if backend is down or errors. */
export async function getLatestProduct(): Promise<ProductListItem | null> {
  try {
    const res = await fetch(`${BASE}/products/latest`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

/** Fetches the N latest (most recently created) active products — e.g. for Trending Artifacts. Returns [] if backend is down or errors. */
export async function getLatestProducts(limit: number = 4): Promise<ProductListItem[]> {
  try {
    const data = await getProducts({ limit, page: 1, isActive: true });
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function getProduct(id: string): Promise<ProductDetail | null> {
  const res = await fetch(`${BASE}/products/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE}/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function getPublicSettings(): Promise<PublicSettings> {
  const res = await fetch(`${BASE}/settings/public`, { cache: "no-store" });
  if (!res.ok) return { defaultWhatsappNumber: "", whatsappMessageTemplate: "Hi, I'm interested in {productName}" };
  const json = await res.json();
  return json.data;
}

export function buildWhatsAppLink(
  productName: string,
  settings: PublicSettings,
  productWhatsappNumber?: string
): string {
  const num = (productWhatsappNumber || settings.defaultWhatsappNumber || "").replace(/\D/g, "");
  const template = settings.whatsappMessageTemplate || "Hi, I'm interested in {productName}";
  const text = encodeURIComponent(template.replace(/{productName}/g, productName));
  return `https://wa.me/${num || "0"}?text=${text}`;
}

export function fullImageUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}

export async function trackLead(productId?: string): Promise<void> {
  try {
    await fetch(`${BASE}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
  } catch {
    // ignore
  }
}
