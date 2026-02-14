"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-100",
                isScrolled ? "py-4 bg-maroon/90 backdrop-blur-md border-b border-white/5 shadow-lg" : "py-8 bg-transparent"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl md:text-3xl font-serif font-bold tracking-[0.2em] text-white">
                    MOKSH
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-xs font-medium uppercase tracking-widest text-muted hover:text-gold transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-2 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Icons / Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <Button variant="ghost" size="icon" className="text-muted hover:text-white hover:bg-white/5">
                        <Search className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted hover:text-white hover:bg-white/5">
                        <Heart className="w-5 h-5" />
                    </Button>
                    <Link href="/contact">
                        <Button variant="outline" size="sm" className="rounded-none border-gold/50 text-gold hover:bg-gold hover:text-bg-deep uppercase text-xs tracking-wider px-6 transition-all duration-300">
                            Contact
                        </Button>
                    </Link>
                </div>
                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-maroon/95 backdrop-blur-lg border-t border-white/10 p-6 md:hidden flex flex-col space-y-4 shadow-2xl"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg font-medium text-white block hover:text-gold transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="flex space-x-4 pt-4 border-t border-white/10">
                            <Button variant="ghost" size="icon" className="text-muted hover:text-white">
                                <Search className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted hover:text-white">
                                <Heart className="w-5 h-5" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
