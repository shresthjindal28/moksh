"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, Heart, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductProps {
    id: string;
    name: string;
    category: string;
    price?: number;
    image: string;
    whatsappLink: string;
}

export function ProductCard({ id, name, category, price, image, whatsappLink }: ProductProps) {

    return (
        <motion.div
            whileHover={{ y: -8 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative block bg-maroon border border-white/5 overflow-hidden hover:border-gold/30 transition-all duration-500"
        >
            {/* Image Container */}
            <div className="relative aspect-3/4 overflow-hidden bg-deep">
                <div className="absolute inset-0 bg-maroon/10 group-hover:bg-transparent transition-all duration-500 z-10 mix-blend-overlay" />

                {/* Main Image */}
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                    ) : (
                        <span className="text-xs uppercase tracking-widest font-serif text-muted">No Image</span>
                    )}
                </div>

                {/* Quick Actions (Hover) */}
                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 bg-linear-to-t from-deep/90 to-transparent">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <Button size="sm" className="w-full justify-center bg-red hover:bg-gold text-white hover:text-deep border-none uppercase tracking-wider text-[10px] h-10 shadow-[0_4px_10px_rgba(0,0,0,0.3)] duration-300 font-bold">
                            View Details  <ArrowUpRight className="ml-2 w-3 h-3" />
                        </Button>
                    </a>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 text-center bg-maroon group-hover:bg-deep transition-colors duration-500">
                <div className="mb-3">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] opacity-80">{category}</span>
                </div>
                <Link href={`/product/${id}`}>
                    <h3 className="text-lg font-serif font-medium text-white group-hover:text-gold transition-colors cursor-pointer mb-2">
                        {name}
                    </h3>
                </Link>
                <div className="flex items-center justify-center gap-3">
                    {price != null && <span className="text-sm font-light text-muted tracking-wide">₹{price}</span>}
                </div>
            </div>
        </motion.div>
    );
}
