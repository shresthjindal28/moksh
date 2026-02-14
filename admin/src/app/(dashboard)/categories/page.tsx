"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function fetchCategories() {
    api
      .get<{ data: Category[] }>("/categories")
      .then((res) => setCategories(res.data.data))
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function openEdit(c: Category) {
    setEditingId(c.id);
    setFormName(c.name);
    setFormDescription(c.description ?? "");
  }

  function openCreate() {
    setShowForm(true);
    setFormName("");
    setFormDescription("");
  }

  function cancelForm() {
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, {
          name: formName.trim(),
          description: formDescription.trim() || undefined,
        });
        toast.success("Category updated");
      } else {
        await api.post("/categories", {
          name: formName.trim(),
          description: formDescription.trim() || undefined,
        });
        toast.success("Category created");
      }
      cancelForm();
      fetchCategories();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: { message?: string } } } }).response?.data
              ?.error?.message
          : "Failed";
      toast.error(msg || "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(c: Category) {
    if (!confirm(`Delete category "${c.name}"? Products using it must be updated first.`)) return;
    try {
      await api.delete(`/categories/${c.id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { error?: { message?: string } } } }).response?.data
              ?.error?.message
          : "Cannot delete: category may be in use";
      toast.error(msg);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
        <Button onClick={openCreate} className="gap-2" disabled={showForm}>
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {(showForm || editingId) && (
        <Card className="mb-6">
          <h2 className="text-lg font-medium text-foreground mb-4">
            {editingId ? "Edit Category" : "New Category"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Description</label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Optional description"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" loading={submitting}>
                {editingId ? "Save" : "Create"}
              </Button>
              <Button type="button" variant="outline" onClick={cancelForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-muted">No categories yet. Add one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted font-medium">Name</th>
                  <th className="text-left p-4 text-muted font-medium">Slug</th>
                  <th className="text-right p-4 text-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-b border-border hover:bg-white/5">
                    <td className="p-4 font-medium text-foreground">{c.name}</td>
                    <td className="p-4 text-muted">{c.slug}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(c)}
                          disabled={!!editingId}
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(c)}
                          title="Delete"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
