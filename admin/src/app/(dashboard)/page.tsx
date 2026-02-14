"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DashboardCard } from "@/components/layout/DashboardCard";
import { Card } from "@/components/ui/Card";
import { Package, FolderTree, MessageCircle, Activity } from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalLeads: number;
  recentActivity: {
    leads: Array<{ id: string; product?: { name: string }; clickedAt: string }>;
    products: Array<{ id: string; name: string; category?: { name: string }; createdAt: string }>;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: DashboardStats }>("/dashboard/stats")
      .then((res) => setStats(res.data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <DashboardCard
          title="Total Products"
          value={stats?.totalProducts ?? 0}
          icon={<Package className="w-5 h-5" />}
        />
        <DashboardCard
          title="Categories"
          value={stats?.totalCategories ?? 0}
          icon={<FolderTree className="w-5 h-5" />}
        />
        <DashboardCard
          title="Leads (WhatsApp clicks)"
          value={stats?.totalLeads ?? 0}
          icon={<MessageCircle className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gold" /> Recent Activity
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats?.recentActivity?.leads?.length ? (
              stats.recentActivity.leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="text-sm text-muted border-b border-border pb-2 last:border-0"
                >
                  WhatsApp click
                  {lead.product?.name && (
                    <span className="text-foreground"> on {lead.product.name}</span>
                  )}
                  <span className="block text-xs mt-0.5">
                    {new Date(lead.clickedAt).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted text-sm">No leads yet</p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-gold" /> Recent Products
          </h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats?.recentActivity?.products?.length ? (
              stats.recentActivity.products.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}/edit`}
                  className="block text-sm text-foreground hover:text-gold transition-colors border-b border-border pb-2 last:border-0"
                >
                  {p.name}
                  {p.category?.name && (
                    <span className="text-muted ml-2">({p.category.name})</span>
                  )}
                </Link>
              ))
            ) : (
              <p className="text-muted text-sm">No products yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
