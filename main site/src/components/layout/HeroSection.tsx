"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SLIDES = [
  {
    tag: "Ethnic Elegance",
    title: "Timeless",
    titleAccent: "Kurtis",
    description: "Handcrafted ethnic wear that blends tradition with modern sophistication.",
    cta: "Shop Kurtis",
    href: "/shop?category=kurti",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1400&auto=format&fit=crop",
    badge: "Kurti Collection",
  },
  {
    tag: "Home Luxury",
    title: "Premium",
    titleAccent: "Bedsheets",
    description: "Indulge in the finest cotton bedsheets, designed for comfort and elegance.",
    cta: "Shop Bedsheets",
    href: "/shop?category=bedsheet",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1400&auto=format&fit=crop",
    badge: "Bedsheet Collection",
  },
  {
    tag: "Artisan Craft",
    title: "Exquisite",
    titleAccent: "Jewellery",
    description: "Statement pieces crafted with precision, for the woman who commands attention.",
    cta: "Shop Jewellery",
    href: "/shop?category=jewellery",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1400&auto=format&fit=crop",
    badge: "Jewellery Collection",
  },
];

const INTERVAL = 5000; // 5 seconds per slide

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  const imageVariants = {
    enter: (dir: number) => ({ opacity: 0, scale: 1.15, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, scale: 1.05, x: 0, transition: { duration: 1, ease: [0.33, 1, 0.68, 1] as [number, number, number, number] } },
    exit: (dir: number) => ({ opacity: 0, scale: 1, x: dir > 0 ? -60 : 60, transition: { duration: 0.6 } }),
  };

  const textVariants = {
    enter: { opacity: 0, y: 30 },
    center: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <section className="relative min-h-[100dvh] w-full flex items-center bg-deep overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-deep" />
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-maroon/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] bg-accent-gold/5 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8 min-h-[100dvh]">
        {/* Left Content Area */}
        <div className="lg:col-span-5 flex flex-col justify-center px-6 md:px-12 lg:px-16 pt-24 pb-12 lg:py-0 relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-8 md:space-y-10"
            >
              {/* Tagline */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-[1px] bg-gold/60" />
                <span className="text-gold/90 text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase font-sans">
                  {slide.tag}
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] text-main">
                <span className="block">{slide.title}</span>
                <span className="block italic text-gold">{slide.titleAccent}</span>
              </h1>

              {/* Description */}
              <p className="text-muted text-sm md:text-base font-light leading-relaxed max-w-sm border-l border-white/10 pl-6">
                {slide.description}
              </p>

              {/* CTA */}
              <div className="pt-4">
                <Link
                  href={slide.href}
                  className="group relative inline-flex items-center gap-4 text-sm font-medium tracking-widest text-main uppercase overflow-hidden pb-1"
                >
                  <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-[120%]">
                    {slide.cta}
                  </span>
                  <span className="absolute top-0 left-0 z-10 transition-transform duration-300 translate-y-[120%] group-hover:translate-y-0 text-gold">
                    {slide.cta}
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20 group-hover:bg-gold transition-colors duration-300" />
                  <ArrowRight className="w-4 h-4 text-gold transform transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide Indicators */}
          <div className="absolute bottom-12 left-6 md:left-12 lg:left-16 flex items-center gap-3 z-20">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative group flex items-center"
                aria-label={`Go to slide ${i + 1}`}
              >
                <div
                  className={`h-[2px] transition-all duration-500 ${
                    i === current ? "w-10 bg-gold" : "w-5 bg-white/20 group-hover:bg-white/40"
                  }`}
                />
              </button>
            ))}
            <span className="text-[10px] text-muted ml-2 font-mono tracking-wider">
              {String(current + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
          </div>

          {/* Scrolling Ticker */}
          <div className="absolute bottom-8 left-0 w-full overflow-hidden opacity-20 select-none pointer-events-none hidden lg:block">
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
              className="flex whitespace-nowrap gap-16 text-[10px] tracking-[0.4em] text-white/50 uppercase font-sans"
            >
              <span>Timeless Elegance</span>
              <span>•</span>
              <span>Master Craftsmanship</span>
              <span>•</span>
              <span>Exclusive Designs</span>
              <span>•</span>
              <span>Timeless Elegance</span>
              <span>•</span>
              <span>Master Craftsmanship</span>
              <span>•</span>
              <span>Exclusive Designs</span>
            </motion.div>
          </div>
        </div>

        {/* Right Image Area */}
        <div className="lg:col-span-7 relative h-[50vh] lg:h-full lg:min-h-screen overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              <div className="relative w-full h-full">
                {/* Image Overlay Gradients */}
                <div className="absolute inset-0 bg-linear-to-r from-deep via-transparent to-transparent z-10 hidden lg:block" />
                <div className="absolute inset-0 bg-linear-to-t from-deep via-transparent to-transparent z-10 lg:hidden" />

                <Image
                  src={slide.image}
                  alt={slide.badge}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Category Badge */}
          <motion.div
            key={`badge-${current}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute bottom-12 right-8 md:right-16 z-20 hidden md:block"
          >
            <div className="glass-card backdrop-blur-md px-6 py-4 flex flex-col gap-1 border-l-2 border-gold/50">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold/80">Collection</span>
              <span className="text-sm font-serif text-white">{slide.badge}</span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 z-20">
            <motion.div
              key={`progress-${current}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: INTERVAL / 1000, ease: "linear" }}
              className="h-full bg-gold/60"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
