"use client";

import { type HTMLAttributes } from "react";

export function Card({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-xl bg-card border border-border shadow-lg p-6 transition-shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
