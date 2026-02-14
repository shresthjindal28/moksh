"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  getProducts,
  getPublicSettings,
  getCategories,
  buildWhatsAppLink,
  fullImageUrl,
  type ProductListItem,
  type PublicSettings,
  type Category,
} from "@/lib/api";

export function ShopContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [settings, setSettings] = useState<PublicSettings>({
    defaultWhatsappNumber: "",
    whatsappMessageTemplate: "Hi, I'm interested in {productName}",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryId = searchParams.get("category") ?? undefined;
  const minPriceStr = searchParams.get("minPrice");
  const maxPriceStr = searchParams.get("maxPrice");
  const minPrice = minPriceStr ? parseFloat(minPriceStr) : undefined;
  const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : undefined;

  // Fetch categories and settings once on mount
  useEffect(() => {
    Promise.all([getPublicSettings(), getCategories()]).then(
      ([s, c]) => {
        setSettings(s);
        setCategories(c);
      }
    );
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    setLoading(true);
    getProducts({
      isActive: true,
      limit: 50,
      category: categoryId,
      minPrice: Number.isNaN(minPrice) ? undefined : minPrice,
      maxPrice: Number.isNaN(maxPrice) ? undefined : maxPrice,
    })
      .then((data) => {
        setProducts(data.items);
        setTotal(data.total);
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [categoryId, minPrice, maxPrice]);

  return (
    <>
      {/* Page Header */}
      <div className="pt-32 pb-12 bg-deep">
        <div className="container mx-auto px-6 text-center">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-2 block">
            The Collection
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Shop Collection
          </h1>
          <p className="text-muted font-light max-w-2xl mx-auto">
            Browse our complete catalogue of premium essentials, curated for the
            modern connoisseur.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-20 flex flex-col md:flex-row gap-8">
        <FilterSidebar categories={categories} />

        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-white/5 pb-6">
            <span className="text-muted text-sm font-light tracking-wide">
              {loading ? "Loading..." : `${products.length} Products Found`}
            </span>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="sm"
                className="md:hidden border-white/10 text-muted hover:text-white"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
              </Button>
              <div className="relative">
                <select className="appearance-none bg-deep border border-white/10 text-white rounded-none px-4 py-2 pr-8 focus:outline-none focus:border-gold/50 transition-colors cursor-pointer uppercase tracking-wider text-xs">
                  <option value="new">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white/5 aspect-[3/4] rounded"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  category={product.category?.name ?? ""}
                  price={product.price}
                  image={
                    product.images?.[0]
                      ? fullImageUrl(product.images[0])
                      : ""
                  }
                  whatsappLink={buildWhatsAppLink(
                    product.name,
                    settings,
                    product.whatsappNumber,
                    product.images?.[0] ? fullImageUrl(product.images[0]) : undefined
                  )}
                />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <p className="text-muted text-center py-12">
              No products available yet.
            </p>
          )}

          {!loading && products.length > 0 && total > products.length && (
            <div className="mt-20 flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 text-muted hover:text-white rounded-none"
              >
                Load more (coming soon)
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
