"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full h-10 px-3 rounded-lg bg-maroon border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
