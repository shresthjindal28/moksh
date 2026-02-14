import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";
import { getLatestProductAction } from "@/actions/product";
import { useHeroStore } from "@/store/hero-store";
import { fullImageUrl } from "@/lib/api";

const HERO_PLACEHOLDER =
  "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop";

export function HeroSection() {
  const { setLatestProduct } = useHeroStore();
  const containerRef = useRef<HTMLElement>(null);

  // Mouse parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    mouseX.set((clientX - left) / width - 0.5);
    mouseY.set((clientY - top) / height - 0.5);
  };

  const { data: latestProduct, isSuccess } = useQuery({
    queryKey: ["latestProduct"],
    queryFn: getLatestProductAction,
  });

  useEffect(() => {
    if (isSuccess && latestProduct !== undefined) {
      setLatestProduct(latestProduct ?? null);
    }
  }, [isSuccess, latestProduct, setLatestProduct]);

  const imageUrl =
    latestProduct?.images && latestProduct.images.length > 0
      ? fullImageUrl(latestProduct.images[0])
      : HERO_PLACEHOLDER;
  const alt = latestProduct?.name ?? "Latest arrival";

  // Parallax spring config
  const springConfig = { damping: 25, stiffness: 150 };
  const moveX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  const moveY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), springConfig);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] w-full flex items-center bg-deep overflow-hidden"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-deep" />
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-maroon/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] bg-accent-gold/5 rounded-full blur-[100px]" />

        {/* Grain Texture */}
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 md:space-y-10"
          >
            {/* Tagline */}
            <div className="flex items-center gap-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 40 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-[1px] bg-gold/60"
              />
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-gold/90 text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase font-sans"
              >
                The Collection
              </motion.span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] text-main">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.33, 1, 0.68, 1] }}
                  className="block"
                >
                  Refined
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.33, 1, 0.68, 1] }}
                  className="block italic text-gold"
                >
                  Luxury
                </motion.span>
              </span>
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-muted text-sm md:text-base font-light leading-relaxed max-w-sm border-l border-white/10 pl-6"
            >
              Curated for the discerning few who appreciate the timeless art of elegance.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="pt-4"
            >
              <Link href="/shop" className="group relative inline-flex items-center gap-4 text-sm font-medium tracking-widest text-main uppercase overflow-hidden pb-1">
                <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-[120%]">Explore Shop</span>
                <span className="absolute top-0 left-0 z-10 transition-transform duration-300 translate-y-[120%] group-hover:translate-y-0 text-gold">Explore Shop</span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20 group-hover:bg-gold transition-colors duration-300" />
                <ArrowRight className="w-4 h-4 text-gold transform transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Scrolling Ticker (Bottom Left) */}
          <div className="absolute bottom-8 left-0 w-full overflow-hidden opacity-30 select-none pointer-events-none">
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
          <motion.div
            style={{ x: moveX, y: moveY, scale: 1.1 }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="relative w-full h-full">
              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-r from-deep via-transparent to-transparent z-10 hidden lg:block" />
              <div className="absolute inset-0 bg-linear-to-t from-deep via-transparent to-transparent z-10 lg:hidden" />

              <motion.div
                initial={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-full h-full relative"
              >
                <Image
                  src={imageUrl}
                  alt={alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                  unoptimized={imageUrl.startsWith("http://localhost")}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute bottom-12 right-8 md:right-16 z-20 hidden md:block"
          >
            <div className="glass-card backdrop-blur-md px-6 py-4 flex flex-col gap-1 border-l-2 border-gold/50">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold/80">Featured</span>
              <span className="text-sm font-serif text-white">{alt}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
