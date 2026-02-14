"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`w-full min-h-[100px] px-3 py-2 rounded-lg bg-maroon border border-border text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-transparent ${className}`}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
