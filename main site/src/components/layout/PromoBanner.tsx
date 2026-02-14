import { Button } from "@/components/ui/button";

export function PromoBanner() {
    return (
        <section className="py-20 bg-maroon relative overflow-hidden">
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-deep via-maroon to-deep opacity-90" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 mix-blend-overlay" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-4 block">Limited Time Offer</span>
                <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">
                    The Midnight Collection
                </h2>
                <p className="text-muted text-lg mb-8 max-w-2xl mx-auto font-light leading-relaxed">
                    Exquisite craftsmanship meets timeless elegance. <br />
                    <span className="text-white">Reserve your piece of history.</span>
                </p>
                <Button size="lg" className="bg-white text-maroon hover:bg-gold hover:text-deep border-none uppercase tracking-widest text-xs h-12 px-8 font-bold transition-all duration-300">
                    Explore the Collection
                </Button>
            </div>
        </section>
    );
}
