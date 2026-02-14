import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShopContent } from "@/components/product/ShopContent";

export default function ShopPage() {
    return (
        <main className="min-h-screen bg-deep text-white">
            <Navbar />
            <Suspense fallback={<ShopLoading />}>
                <ShopContent />
            </Suspense>
            <Footer />
        </main>
    );
}

function ShopLoading() {
    return (
        <>
            <div className="pt-32 pb-12 bg-deep">
                <div className="container mx-auto px-6 text-center">
                    <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-2 block">The Collection</span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Shop Collection</h1>
                    <p className="text-muted font-light max-w-2xl mx-auto">Browse our complete catalogue of premium essentials, curated for the modern connoisseur.</p>
                </div>
            </div>
            <div className="container mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="animate-pulse bg-white/5 aspect-[3/4] rounded" />
                    ))}
                </div>
            </div>
        </>
    );
}
