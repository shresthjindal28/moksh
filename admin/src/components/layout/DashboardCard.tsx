"use client";

import { type ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

export function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted uppercase tracking-wider">{title}</span>
        {icon && <span className="text-gold">{icon}</span>}
      </div>
      <p className="text-2xl font-semibold text-foreground">{value}</p>
    </Card>
  );
}
