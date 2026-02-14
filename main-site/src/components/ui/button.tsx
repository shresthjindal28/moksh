"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "default" | "secondary" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        const variants = {
            default: "bg-aurum text-obsidian hover:bg-white hover:text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]",
            secondary: "bg-charcoal text-white hover:bg-white/10 border border-white/5",
            outline: "border border-platinum/20 text-platinum hover:border-aurum hover:text-aurum bg-transparent",
            ghost: "text-platinum hover:text-white hover:bg-white/5",
        };

        const sizes = {
            default: "h-11 px-6 py-2",
            sm: "h-9 rounded-none px-4 text-xs tracking-wider",
            lg: "h-14 rounded-none px-8 text-lg",
            icon: "h-10 w-10",
        };

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
