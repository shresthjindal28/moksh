"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";

type FormData = {
  name: string;
  description?: string;
  price?: number;
  categoryId: string;
  whatsappNumber?: string;
  isActive: boolean;
};

interface Category {
  id: string;
  name: string;
}

const ACCEPT_IMAGES = "image/jpeg,image/png,image/gif,image/webp";
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { isActive: true },
  });

  const isActive = watch("isActive");

  useEffect(() => {
    api.get<{ data: Category[] }>("/categories").then((res) => setCategories(res.data.data));
  }, []);

  function addImageUrl() {
    const url = newImageUrl.trim();
    if (url) {
      setImageUrls((prev) => [...prev, url]);
      setNewImageUrl("");
    }
  }

  function removeImageUrl(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    const valid = Array.from(files).filter((f) => {
      if (f.size > MAX_IMAGE_SIZE) {
        toast.error(`${f.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });
    if (!valid.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      valid.forEach((f) => formData.append("files", f));
      const res = await api.post<{ data: { url: string }[] }>("/media", formData);
      const urls = (res.data.data || []).map((r) => r.url);
      setImageUrls((prev) => [...prev, ...urls]);
      toast.success(`${urls.length} image(s) added`);
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function onSubmit(data: FormData) {
    try {
      await api.post("/products", { ...data, images: imageUrls });
      toast.success("Product created");
      router.push("/products");
    } catch {
      toast.error("Failed to create product");
    }
  }

  return (
    <div>
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-muted hover:text-gold text-sm mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Add Product</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
            <Input placeholder="Product name" {...register("name")} />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <Textarea placeholder="Product description" {...register("description")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Price (optional)</label>
            <Input type="number" step="0.01" min="0" placeholder="0.00" {...register("price")} />
            {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category *</label>
            <select
              className="w-full h-10 px-3 rounded-lg bg-maroon border border-border text-foreground"
              {...register("categoryId")}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-400">{errors.categoryId.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Images</label>
            <p className="text-xs text-muted mb-2">
              Upload images or paste a URL. JPEG, PNG, GIF, WebP up to 10MB.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT_IMAGES}
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="flex flex-wrap gap-2 mb-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading…" : "Upload images"}
              </Button>
              <span className="inline-flex items-center gap-2 text-muted text-sm">
                or paste URL:
              </span>
              <Input
                placeholder="https://... or /uploads/..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImageUrl())}
                className="flex-1 min-w-[200px]"
              />
              <Button type="button" variant="secondary" onClick={addImageUrl}>
                Add URL
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {imageUrls.map((url, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-border p-2 bg-maroon"
                >
                  <div className="w-12 h-12 rounded overflow-hidden bg-deep relative">
                    <Image
                      src={url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL || ""}${url}`}
                      alt=""
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImageUrl(i)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              WhatsApp number (optional, overrides default)
            </label>
            <div className="flex items-center rounded-lg border border-border bg-maroon overflow-hidden focus-within:ring-2 focus-within:ring-gold/50">
              <span className="pl-3 text-foreground text-sm font-medium shrink-0">+91</span>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                className="flex-1 h-10 px-3 bg-transparent border-0 text-foreground placeholder:text-muted focus:outline-none focus:ring-0 min-w-0"
                value={
                  (() => {
                    const v = watch("whatsappNumber") || "";
                    if (v.startsWith("91")) return v.slice(2);
                    return v;
                  })()
                }
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  setValue("whatsappNumber", digits ? "91" + digits.replace(/^91/, "") : "");
                }}
              />
            </div>
            <p className="text-xs text-muted mt-1">+91 (India) is prefixed by default.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              className="rounded border-border bg-maroon text-gold focus:ring-gold/50"
              checked={isActive}
              onChange={(e) => setValue("isActive", e.target.checked)}
            />
            <label htmlFor="isActive" className="text-sm text-foreground">
              Visible on site
            </label>
          </div>
        </Card>
        <div className="flex gap-4">
          <Button type="submit" loading={isSubmitting}>
            Create Product
          </Button>
          <Link href="/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
