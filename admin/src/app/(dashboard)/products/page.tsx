"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category: Category;
  images: string[];
  isActive: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState<boolean | "">("");
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState<string | null>(null);

  const limit = 20;

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (search) params.set("search", search);
    if (categoryFilter) params.set("category", categoryFilter);
    if (activeFilter !== "") params.set("isActive", String(activeFilter));
    api
      .get<{ data: { items: Product[]; total: number } }>(`/products?${params}`)
      .then((res) => {
        setProducts(res.data.data.items);
        setTotal(res.data.data.total);
      })
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, [page, search, categoryFilter, activeFilter]);

  useEffect(() => {
    api.get<{ data: Category[] }>("/categories").then((res) => setCategories(res.data.data));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  function handleToggleVisibility(id: string) {
    setActioning(id);
    api
      .patch<{ data: Product }>(`/products/${id}/visibility`)
      .then((res) => {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? res.data.data : p))
        );
        toast.success(res.data.data.isActive ? "Product visible" : "Product hidden");
      })
      .catch(() => toast.error("Failed to update"))
      .finally(() => setActioning(null));
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    setActioning(id);
    api
      .delete(`/products/${id}`)
      .then(() => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setTotal((t) => t - 1);
        toast.success("Product deleted");
      })
      .catch(() => toast.error("Failed to delete"))
      .finally(() => setActioning(null));
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Products</h1>
        <Link href="/products/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="h-10 px-3 rounded-lg bg-maroon border border-border text-foreground"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="h-10 px-3 rounded-lg bg-maroon border border-border text-foreground"
            value={activeFilter === "" ? "" : String(activeFilter)}
            onChange={(e) => {
              setActiveFilter(e.target.value === "" ? "" : e.target.value === "true");
              setPage(1);
            }}
          >
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <Button type="submit" variant="secondary">
            <Search className="w-4 h-4 mr-2" /> Search
          </Button>
        </form>
      </Card>

      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-muted">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted font-medium">Image</th>
                  <th className="text-left p-4 text-muted font-medium">Name</th>
                  <th className="text-left p-4 text-muted font-medium">Category</th>
                  <th className="text-left p-4 text-muted font-medium">Price</th>
                  <th className="text-left p-4 text-muted font-medium">Status</th>
                  <th className="text-right p-4 text-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border hover:bg-white/5">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-maroon relative">
                        {p.images?.[0] ? (
                          <Image
                            src={p.images[0].startsWith("http") ? p.images[0] : `${process.env.NEXT_PUBLIC_API_URL || ""}${p.images[0]}`}
                            alt=""
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="text-xs text-muted flex items-center justify-center h-full">—</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-foreground">{p.name}</td>
                    <td className="p-4 text-muted">{p.category?.name ?? "—"}</td>
                    <td className="p-4 text-muted">{p.price != null ? `₹${p.price}` : "—"}</td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${p.isActive ? "bg-green-900/30 text-green-400" : "bg-muted/20 text-muted"}`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleVisibility(p.id)}
                        disabled={actioning === p.id}
                        title={p.isActive ? "Hide" : "Show"}
                      >
                        {p.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Link href={`/products/${p.id}/edit`}>
                        <Button variant="ghost" size="sm" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={actioning === p.id}
                        title="Delete"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-muted text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
