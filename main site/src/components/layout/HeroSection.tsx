"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-deep">
            {/* Background Gradients from Stitch Design */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {/* Top Right Red Glow */}
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red/20 blur-[150px] rounded-full" />
                {/* Bottom Left Maroon Glow */}
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[60%] bg-maroon/40 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16 pt-20">
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left space-y-8">


                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-6xl md:text-7xl lg:text-8xl font-serif leading-[1.1] text-white"
                    >
                        Refined Luxury <br />
                        <span className="text-white font-light">for the</span> <br />
                        <span className="text-gold italic font-serif">Discerning Few</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-muted text-lg font-light max-w-md md:mx-0 leading-relaxed font-sans"
                    >
                        Experience the epitome of elegance with our curated collection of fine artifacts.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-6 pt-8 justify-center md:justify-start"
                    >
                        <Button size="lg" className="h-12 px-8 rounded-full bg-red text-white hover:bg-gold hover:text-deep border-none shadow-[0_4px_20px_rgba(74,4,4,0.4)] font-medium tracking-wide uppercase text-xs transition-all duration-300">
                            Shop Collection <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </motion.div>
                </div>

                {/* Visual Content (Watch Image from Screenshot) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.4 }}
                    className="flex-1 w-full max-w-md md:max-w-xl aspect-square relative"
                >
                    {/* Main Hero Image Container */}
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-linear-to-br from-white/5 to-transparent backdrop-blur-sm p-4">
                        <div className="absolute inset-0 bg-linear-to-br from-deep via-maroon to-deep opacity-90 z-0" />

                        {/* Mock Image Placeholder (Watch) */}
                        <div className="w-full h-full rounded-xl overflow-hidden relative">
                            <img
                                src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop"
                                alt="Luxury Watch"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000"
                            />

                            {/* Floating Tag */}
                            <div className="absolute top-6 left-6 bg-deep/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                                <span className="text-gold text-[10px] uppercase tracking-widest font-bold">New Arrival</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
