import { Button } from "@/components/ui/button";

export function FilterSidebar() {
    return (
        <div className="w-64 shrink-0 hidden md:block">
            <div className="sticky top-24 space-y-8">
                {/* Categories */}
                <div>
                    <h3 className="text-gold font-bold mb-4 font-serif text-sm uppercase tracking-widest">Categories</h3>
                    <ul className="space-y-3">
                        {["All Products", "Dresses", "Tops", "Jewellery", "Accessories", "Footwear"].map((cat) => (
                            <li key={cat}>
                                <button className="text-muted hover:text-white transition-colors text-sm text-left w-full font-light tracking-wide group flex items-center">
                                    <span className="w-0 group-hover:w-2 h-px bg-gold mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                    {cat}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Price Range */}
                <div>
                    <h3 className="text-gold font-bold mb-4 font-serif text-sm uppercase tracking-widest">Price Range</h3>
                    <div className="space-y-3">
                        {["Under ₹500", "₹500 - ₹1,000", "₹1,000 - ₹2,000", "₹2,000+"].map((range) => (
                            <label key={range} className="flex items-center space-x-3 text-sm text-muted cursor-pointer hover:text-white transition-colors group">
                                <div className="relative flex items-center">
                                    <input type="checkbox" className="peer w-4 h-4 appearance-none border border-white/20 bg-deep checked:bg-gold checked:border-gold transition-all" />
                                    <svg className="absolute w-3 h-3 text-deep pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                        <path d="M5 12l5 5l10 -10"></path>
                                    </svg>
                                </div>
                                <span className="font-light">{range}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Colors */}
                <div>
                    <h3 className="text-gold font-bold mb-4 font-serif text-sm uppercase tracking-widest">Colors</h3>
                    <div className="flex flex-wrap gap-3">
                        {["bg-red-900 border-red-800", "bg-blue-900 border-blue-800", "bg-green-900 border-green-800", "bg-yellow-700 border-yellow-600", "bg-white border-white", "bg-black border-white/20"].map((color, i) => (
                            <button key={i} className={`w-8 h-8 rounded-full ${color} border shadow-lg hover:scale-110 transition-transform`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
