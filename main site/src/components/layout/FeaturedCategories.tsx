import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Category {
    id: string;
    name: string;
    image: string;
    itemCount: number;
}

const categories: Category[] = [
    { id: "1", name: "Dresses", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop", itemCount: 42 },
    { id: "2", name: "Jewellery", image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop", itemCount: 28 },
    { id: "3", name: "Footwear", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop", itemCount: 15 },
    { id: "4", name: "Accessories", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop", itemCount: 36 },
];

export function FeaturedCategories() {
    return (
        <section className="py-20 bg-deep relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-red/5 blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">The Collections</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-white">Curated Excellence</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative aspect-3/4 overflow-hidden border border-white/5 cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-maroon/40 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-60" />

                            {/* Placeholder Image Gradient - would be real images */}
                            <div className={`w-full h-full bg-linear-to-b ${index === 0 ? 'from-maroon/20 to-deep' : index === 1 ? 'from-deep to-maroon/40' : 'from-red/10 to-deep'}`} />

                            {/* Actual Image Overlay if we had them matching styling */}
                            <img
                                src={category.image}
                                alt={category.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay grayscale group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
                            />

                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-transform duration-700 group-hover:scale-105 z-10">
                                <h3 className="text-3xl font-serif italic text-white mb-4 group-hover:text-gold transition-colors">{category.name}</h3>
                                <span className="text-[10px] uppercase tracking-widest text-muted border-t border-white/20 pt-4 w-12 group-hover:w-24 transition-all duration-500">Explore</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
