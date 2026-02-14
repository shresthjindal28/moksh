"use client";

import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/layout/HeroSection";
import { FeaturedCategories } from "@/components/layout/FeaturedCategories";
import { TrendingProducts } from "@/components/layout/TrendingProducts";
import { PromoBanner } from "@/components/layout/PromoBanner";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      <HeroSection />
      <FeaturedCategories />
      <TrendingProducts />
      <PromoBanner />
      <Footer />
    </main>
  );
}
