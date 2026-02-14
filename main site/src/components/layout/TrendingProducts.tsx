"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { getLatestProductsAction } from "@/actions/product";
import { buildWhatsAppLink, fullImageUrl } from "@/lib/api";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop";

export function TrendingProducts() {
  const { data } = useQuery({
    queryKey: ["latestProducts", 4],
    queryFn: getLatestProductsAction,
  });

  const products = (data?.products ?? []).slice(0, 4);
  const settings = data?.settings;

  return (
    <section className="py-24 bg-maroon border-y border-white/5 relative overflow-hidden">
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
          {products.map((product) => {
            const image =
              product.images?.length > 0
                ? fullImageUrl(product.images[0])
                : PLACEHOLDER_IMAGE;
            const imageUrl = product.images?.[0] ? fullImageUrl(product.images[0]) : undefined;
            const whatsappLink = settings
              ? buildWhatsAppLink(product.name, settings, product.whatsappNumber, imageUrl)
              : `https://wa.me/0?text=${encodeURIComponent("Hi, I'm interested in " + product.name)}`;
            return (
              <div
                key={product.id}
                className="border-r border-b border-white/5 p-4 md:p-6 lg:p-8 hover:bg-white/5 transition-colors duration-300"
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  category={product.category?.name ?? ""}
                  price={product.price}
                  image={image}
                  whatsappLink={whatsappLink}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Link href="/shop">
            <Button size="lg" variant="outline" className="min-w-[240px] border-white/10 text-muted hover:text-gold hover:border-gold hover:bg-maroon/50 uppercase tracking-widest text-xs h-12 rounded-none transition-all duration-300">
              View All Artifacts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
