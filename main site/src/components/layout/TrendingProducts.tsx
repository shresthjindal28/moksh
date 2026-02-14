"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

const products = [
    {
        id: "1",
        name: "Velvet Midnight Gown",
        category: "Dresses",
        price: 120,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: "2",
        name: "Emerald Silk Scarf",
        category: "Accessories",
        price: 45,
        image: "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa3e?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: "3",
        name: "Gold Plated Necklace",
        category: "Jewellery",
        price: 85,
        image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: "4",
        name: "Classic Leather Satchel",
        category: "Bags",
        price: 150,
        image: "https://images.unsplash.com/photo-1590874102752-ce3351a94d8c?q=80&w=800&auto=format&fit=crop",
    },
];

export function TrendingProducts() {
    return (
        <section className="py-24 bg-maroon border-y border-white/5 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-50%] left-[20%] w-[60%] h-[60%] bg-red/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-gold font-bold tracking-[0.2em] uppercase text-xs">The Collection</span>
                    <h2 className="text-4xl md:text-6xl font-serif text-white mt-4 mb-6">Trending Artifacts</h2>
                    <div className="w-16 h-px bg-gold/50 mx-auto mb-8" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/5 bg-deep shadow-2xl">
                    {products.map((product) => (
                        <div key={product.id} className="border-r border-b border-white/5 p-4 md:p-6 lg:p-8 hover:bg-white/5 transition-colors duration-300">
                            <ProductCard
                                {...product}
                                whatsappLink={`https://wa.me/0?text=${encodeURIComponent("Hi, I'm interested in " + product.name)}`}
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Button size="lg" variant="outline" className="min-w-[240px] border-white/10 text-muted hover:text-gold hover:border-gold hover:bg-maroon/50 uppercase tracking-widest text-xs h-12 rounded-none transition-all duration-300">View All Artifacts</Button>
                </div>
            </div>
        </section>
    );
}
