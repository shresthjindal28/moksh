"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getCategoriesAction } from "@/actions/category";

/** Relevant dummy images per category slug (fallback for unknown slugs). */
const CATEGORY_DUMMY_IMAGES: Record<string, string> = {
  kurti: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
  bedsheet: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop",
  jewellery:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
  jewelry:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
};

const DEFAULT_DUMMY_IMAGE =
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop";

function getCategoryImage(slug: string): string {
  return CATEGORY_DUMMY_IMAGES[slug.toLowerCase()] ?? DEFAULT_DUMMY_IMAGE;
}

/** Fallback gradient so the card is never empty (used behind img and if img fails). */
const CARD_BG = "absolute inset-0 bg-linear-to-b from-deep via-maroon/50 to-deep";

export function FeaturedCategories() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAction,
  });

  const displayCategories = categories.slice(0, 3);

  if (displayCategories.length === 0) return null;

  return (
    <section className="py-20 bg-deep relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-red/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">The Collections</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white">Curated Excellence</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayCategories.map((category, index) => {
            const imageSrc = getCategoryImage(category.slug);
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative aspect-3/4 overflow-hidden border border-white/5 cursor-pointer"
              >
                {/* Fallback gradient – always visible so card is never empty */}
                <div className={CARD_BG} aria-hidden />
                {/* Category image – native img so it always loads; gradient shows through if loading/fail */}
                <img
                  src={imageSrc}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-75 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_DUMMY_IMAGE;
                  }}
                />
                <div className="absolute inset-0 bg-maroon/30 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-50 z-[1]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                  <h3 className="text-3xl font-serif italic text-white mb-4 group-hover:text-gold transition-colors drop-shadow-md">
                    {category.name}
                  </h3>
                  <Link
                    href="/shop"
                    className="text-[10px] uppercase tracking-widest text-muted border-t border-white/20 pt-4 w-12 group-hover:w-24 transition-all duration-500 hover:text-gold"
                  >
                    Explore
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
