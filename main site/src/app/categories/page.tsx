"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getCategoriesAction } from "@/actions/category";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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

export default function CategoriesPage() {
    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategoriesAction,
    });

    return (
        <main className="min-h-screen bg-deep text-white">
            <Navbar />

            {/* Hero Section for Categories */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-1/2 h-full bg-red/5 blur-[120px] pointer-events-none" />
                <div className="container mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="text-gold text-xs font-bold uppercase tracking-[0.3em] block mb-4">
                            Explore Our World
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
                            The Collections
                        </h1>
                        <p className="text-muted max-w-2xl mx-auto font-light text-lg">
                            Discover our carefully curated categories, each embodying the essence of timeless elegance and craftsmanship.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="pb-24 px-6 relative z-10">
                <div className="container mx-auto">
                    {categories.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-muted text-lg">Loading collections...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {categories.map((category, index) => {
                                const imageSrc = getCategoryImage(category.slug);
                                return (
                                    <motion.div
                                        key={category.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ delay: index * 0.1, duration: 0.6 }}
                                        className="group relative aspect-3/4 overflow-hidden border border-white/5 cursor-pointer rounded-sm"
                                    >
                                        {/* Fallback gradient */}
                                        <div className={CARD_BG} aria-hidden />

                                        {/* Image */}
                                        <img
                                            src={imageSrc}
                                            alt={category.name}
                                            className="absolute inset-0 w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = DEFAULT_DUMMY_IMAGE;
                                            }}
                                        />

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-maroon/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500 z-[1]" />

                                        {/* Content */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <h2 className="text-3xl md:text-4xl font-serif italic text-white mb-2 group-hover:text-gold transition-colors drop-shadow-lg">
                                                    {category.name}
                                                </h2>
                                                {/* Decorative Line */}
                                                <div className="w-12 h-px bg-white/30 mx-auto my-4 group-hover:w-24 group-hover:bg-gold transition-all duration-500" />

                                                <Link
                                                    href={`/shop?category=${category.slug}`}
                                                    className="inline-block text-[10px] uppercase tracking-[0.2em] text-white/70 hover:text-white border border-white/20 hover:border-gold px-6 py-3 rounded-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0"
                                                >
                                                    View Collection
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
