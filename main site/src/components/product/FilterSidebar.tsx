"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { Category } from "@/lib/api";

const PRICE_RANGES: { label: string; minPrice?: number; maxPrice?: number }[] = [
  { label: "Under ₹500", maxPrice: 500 },
  { label: "₹500 - ₹1,000", minPrice: 500, maxPrice: 1000 },
  { label: "₹1,000 - ₹2,000", minPrice: 1000, maxPrice: 2000 },
  { label: "₹2,000+", minPrice: 2000 },
];

interface FilterSidebarProps {
  categories: Category[];
}

export function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") ?? "";
  const currentMinPrice = searchParams.get("minPrice");
  const currentMaxPrice = searchParams.get("maxPrice");

  const updateFilters = useCallback(
    (updates: Record<string, string | number | undefined | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === null || value === "") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }
      const q = next.toString();
      router.push(pathname + (q ? `?${q}` : ""), { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const isPriceRangeActive = (min?: number, max?: number) => {
    const minS = min != null ? String(min) : null;
    const maxS = max != null ? String(max) : null;
    return (currentMinPrice ?? null) === minS && (currentMaxPrice ?? null) === maxS;
  };

  return (
    <div className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-24 space-y-8">
        {/* Categories */}
        <div>
          <h3 className="text-gold font-bold mb-4 font-serif text-sm uppercase tracking-widest">
            Categories
          </h3>
          <ul className="space-y-3">
            <li>
              <button
                onClick={() => updateFilters({ category: null })}
                className={`text-left w-full font-light tracking-wide group flex items-center transition-colors ${
                  !currentCategory ? "text-gold" : "text-muted hover:text-white"
                }`}
              >
                <span
                  className={`w-0 h-px mr-0 transition-all duration-300 ${
                    !currentCategory ? "w-2 mr-2 bg-gold" : "group-hover:w-2 group-hover:mr-2 bg-gold"
                  }`}
                />
                All Products
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() =>
                    updateFilters({ category: currentCategory === cat.id ? null : cat.id })
                  }
                  className={`text-left w-full font-light tracking-wide group flex items-center transition-colors ${
                    currentCategory === cat.id ? "text-gold" : "text-muted hover:text-white"
                  }`}
                >
                  <span
                    className={`w-0 h-px mr-0 transition-all duration-300 ${
                      currentCategory === cat.id
                        ? "w-2 mr-2 bg-gold"
                        : "group-hover:w-2 group-hover:mr-2 bg-gold"
                    }`}
                  />
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Price Range — single selection */}
        <div>
          <h3 className="text-gold font-bold mb-4 font-serif text-sm uppercase tracking-widest">
            Price Range
          </h3>
          <div className="space-y-3">
            {PRICE_RANGES.map((range) => {
              const active = isPriceRangeActive(range.minPrice, range.maxPrice);
              return (
                <label
                  key={range.label}
                  className="flex items-center space-x-3 text-sm cursor-pointer hover:text-white transition-colors group"
                >
                  <div className="relative flex items-center shrink-0">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={active}
                      onChange={() =>
                        updateFilters({
                          minPrice: range.minPrice,
                          maxPrice: range.maxPrice,
                        })
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 border flex items-center justify-center transition-all ${
                        active
                          ? "border-gold bg-gold"
                          : "border-white/20 bg-deep group-hover:border-white/40"
                      }`}
                    >
                      {active && (
                        <svg
                          className="w-2.5 h-2.5 text-deep"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                        >
                          <path d="M5 12l5 5l10 -10" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className={active ? "text-white font-light" : "text-muted font-light"}>
                    {range.label}
                  </span>
                </label>
              );
            })}
            <button
              onClick={() => updateFilters({ minPrice: null, maxPrice: null })}
              className="text-muted hover:text-gold text-xs font-light mt-2"
            >
              Clear price
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
