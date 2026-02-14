import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-deep text-white">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8 mb-20">
                    <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] block">Our Heritage</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">The Story of Moksh</h1>
                    <p className="text-muted text-lg leading-relaxed font-light">
                        Born from a passion for timeless elegance and modern craftsmanship, MOKSH is more than just a brand—it's a celebration of individuality and refined taste.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                    <div className="relative aspect-square overflow-hidden border border-white/5 bg-maroon p-2">
                        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent z-10 pointer-events-none" />
                        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop" alt="Craftsmanship" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                    </div>
                    <div className="space-y-8">
                        <div>
                            <span className="text-gold text-xs font-bold uppercase tracking-widest mb-2 block">Artisanal Excellence</span>
                            <h2 className="text-3xl font-serif font-bold text-white">Crafted with Care</h2>
                        </div>
                        <p className="text-muted leading-relaxed font-light">
                            Every piece in our collection is a testament to the skill and dedication of our artisans. We believe in sustainable luxury, ensuring that each item not only looks exquisite but is also ethically produced using the finest materials available.
                        </p>
                        <p className="text-muted leading-relaxed font-light">
                            From selecting the finest fabrics to the final stitch, we pay attention to every detail, ensuring that you receive nothing but the best. Our commitment to quality is unwavering.
                        </p>
                    </div>
                </div>

                <div className="text-center bg-maroon/30 border border-white/5 p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red/10 blur-[100px] rounded-full pointer-events-none" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-serif font-bold text-white mb-6">Our Vision</h2>
                        <p className="text-muted text-lg max-w-2xl mx-auto font-light leading-relaxed">
                            To redefine luxury for the modern world, making it accessible, sustainable, and deeply personal. We strive to create pieces that become part of your legacy.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
