import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-deep text-white">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center space-y-8 mb-20">
                    <span className="text-gold text-xs font-bold uppercase tracking-[0.2em] block">Concierge Service</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">Get in Touch</h1>
                    <p className="text-muted text-lg leading-relaxed font-light font-sans max-w-2xl mx-auto">
                        We'd love to hear from you. Whether you have a question about our collections, pricing, or need personalized assistance, our dedicated team is at your service.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-serif font-bold text-white mb-6">Contact Information</h2>
                            <p className="text-muted font-light">
                                Visit our flagship boutique or contact us directly for an exclusive consultation.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6 group">
                                <div className="p-4 bg-maroon border border-white/5 rounded-full text-gold group-hover:bg-gold group-hover:text-deep transition-all duration-300">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-lg mb-1 font-serif">Our Boutique</h3>
                                    <p className="text-muted font-light leading-relaxed">123 Luxury Avenue, District 1<br />New York, NY 10001</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="p-4 bg-maroon border border-white/5 rounded-full text-gold group-hover:bg-gold group-hover:text-deep transition-all duration-300">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-lg mb-1 font-serif">Email Us</h3>
                                    <p className="text-muted font-light">support@moksh.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="p-4 bg-maroon border border-white/5 rounded-full text-gold group-hover:bg-gold group-hover:text-deep transition-all duration-300">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-lg mb-1 font-serif">Call Us</h3>
                                    <p className="text-muted font-light">+1 (555) 123-4567</p>
                                </div>
                            </div>
                        </div>

                        <div className="aspect-video w-full overflow-hidden bg-maroon border border-white/10 mt-8 relative flex items-center justify-center">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
                            <p className="text-muted font-serif italic relative z-10">Map Integration Placeholder</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-maroon/50 backdrop-blur-md p-8 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />

                        <h2 className="text-2xl font-serif font-bold text-white mb-2 relative z-10">Send us a Message</h2>
                        <p className="text-muted text-sm mb-8 font-light relative z-10">We usually respond within 24 hours.</p>

                        <form className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">First Name</label>
                                    <input type="text" className="w-full bg-deep border border-white/10 px-4 py-3 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/50 focus:outline-none transition-colors" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Last Name</label>
                                    <input type="text" className="w-full bg-deep border border-white/10 px-4 py-3 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/50 focus:outline-none transition-colors" placeholder="Doe" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Email Address</label>
                                <input type="email" className="w-full bg-deep border border-white/10 px-4 py-3 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/50 focus:outline-none transition-colors" placeholder="john@example.com" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Message</label>
                                <textarea rows={4} className="w-full bg-deep border border-white/10 px-4 py-3 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/50 focus:outline-none transition-colors resize-none" placeholder="How can we help you?" />
                            </div>

                            <Button size="lg" className="w-full bg-gold text-deep hover:bg-white hover:text-deep font-bold uppercase tracking-widest rounded-none h-12 transition-all duration-300">
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
