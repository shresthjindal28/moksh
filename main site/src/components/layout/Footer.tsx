import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-maroon border-t border-white/5 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="text-2xl font-serif font-bold text-white tracking-widest">
                            MOKSH
                        </Link>
                        <p className="text-muted text-sm leading-relaxed max-w-xs font-light">
                            Curating the finest in luxury. <br />
                            Exclusively for the discerning few.
                        </p>
                    </div>

                    {/* Collections */}
                    <div>
                        <h4 className="text-gold font-bold uppercase tracking-widest text-xs mb-6">Collections</h4>
                        <ul className="space-y-3 text-sm text-muted">
                            <li><Link href="/shop" className="hover:text-white transition-colors">Chronos Obsidian</Link></li>
                            <li><Link href="/shop" className="hover:text-white transition-colors">Ethereal Band</Link></li>
                            <li><Link href="/shop" className="hover:text-white transition-colors">Vantana Lounge</Link></li>
                            <li><Link href="/shop" className="hover:text-white transition-colors">Midnight Oud</Link></li>
                        </ul>
                    </div>

                    {/* Concierge */}
                    <div>
                        <h4 className="text-gold font-bold uppercase tracking-widest text-xs mb-6">Concierge</h4>
                        <ul className="space-y-3 text-sm text-muted">
                            <li><Link href="/contact" className="hover:text-white transition-colors">Private Consultation</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Authenticity Guarantee</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-gold font-bold uppercase tracking-widest text-xs mb-6">Connect</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-muted hover:text-gold hover:border-gold transition-all rounded-none bg-deep/50">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-muted hover:text-gold hover:border-gold transition-all rounded-none bg-deep/50">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center text-muted hover:text-gold hover:border-gold transition-all rounded-none bg-deep/50">
                                <span className="sr-only">Mail</span>
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted/50 uppercase tracking-widest">
                    <p>&copy; 2024 MOKSH. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
