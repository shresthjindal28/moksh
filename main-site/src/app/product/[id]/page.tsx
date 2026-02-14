import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getProduct, getProducts, getPublicSettings, buildWhatsAppLink, fullImageUrl } from "@/lib/api";
import { notFound } from "next/navigation";
import { WhatsAppButton } from "./WhatsAppButton";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const [product, settings, allProducts] = await Promise.all([
        getProduct(id),
        getPublicSettings(),
        getProducts({ isActive: true, limit: 10 }),
    ]);

    if (!product) notFound();

    const images = product.images?.length ? product.images : [""];
    const categoryName = typeof product.category === "object" && product.category?.name ? product.category.name : "";
    const mainImage = product.images?.[0] ? fullImageUrl(product.images[0]) : undefined;
    const whatsappLink = buildWhatsAppLink(product.name, settings, product.whatsappNumber, mainImage);

    const related = allProducts.items.filter((p) => p.id !== id).slice(0, 4);

    return (
        <main className="min-h-screen bg-deep text-white">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-6">
                <Link href="/shop" className="inline-flex items-center text-muted hover:text-gold mb-8 transition-colors uppercase tracking-widest text-xs group">
                    <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Collection
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-3/4 overflow-hidden border border-white/5 bg-maroon relative text-center">
                            {images[0] ? (
                                <img src={fullImageUrl(images[0])} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-muted flex items-center justify-center h-full">No image</span>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-3 gap-4">
                                {images.slice(0, 3).map((img, i) => (
                                    <div key={i} className="aspect-square overflow-hidden border border-white/5 cursor-pointer hover:border-gold transition-colors relative">
                                        <img src={fullImageUrl(img)} alt={`View ${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-10">
                        <div>
                            <span className="text-gold uppercase tracking-[0.2em] text-xs font-bold">{categoryName}</span>
                            <h1 className="text-4xl md:text-6xl font-serif font-medium text-white mt-4 mb-6 leading-tight">{product.name}</h1>
                            {product.price != null && (
                                <p className="text-3xl text-muted font-light border-b border-white/10 pb-6 inline-block pr-12">₹{product.price}</p>
                            )}
                        </div>

                        {product.description && (
                            <div className="text-muted leading-loose text-lg font-light">
                                {product.description}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-4 pt-8 border-t border-white/10">
                            <WhatsAppButton href={whatsappLink} productId={id}>
                                <Button size="lg" className="w-full bg-gold text-deep hover:bg-white hover:text-deep gap-3 h-14 rounded-none uppercase tracking-widest font-semibold text-sm transition-all duration-300">
                                    <MessageCircle className="w-5 h-5" />
                                    Connect with Concierge
                                </Button>
                            </WhatsAppButton>
                            <p className="text-xs text-muted/60 text-center uppercase tracking-wider mt-2">
                                * Personalized sizing and shipping arranged via consultation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {related.length > 0 && (
                <div className="bg-maroon py-20 border-t border-white/5">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-serif font-medium text-white mb-12 text-center">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/5 bg-deep">
                            {related.map((p) => (
                                <div key={p.id} className="border-r border-b border-white/5 p-4 md:p-6 hover:bg-white/5 transition-colors">
                                    <ProductCard
                                        id={p.id}
                                        name={p.name}
                                        category={p.category?.name ?? ""}
                                        price={p.price}
                                        image={p.images?.[0] ? fullImageUrl(p.images[0]) : ""}
                                        whatsappLink={buildWhatsAppLink(p.name, settings, p.whatsappNumber, p.images?.[0] ? fullImageUrl(p.images[0]) : undefined)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
