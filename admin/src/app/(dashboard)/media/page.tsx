"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { api, getApiUrl } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Upload, Copy, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const limit = 24;

  const fetchMedia = useCallback(() => {
    setLoading(true);
    api
      .get<{ data: { items: MediaItem[]; total: number } }>(`/media?page=${page}&limit=${limit}`)
      .then((res) => {
        setItems(res.data.data.items);
        setTotal(res.data.data.total);
      })
      .catch(() => toast.error("Failed to load media"))
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  function fullUrl(url: string): string {
    if (url.startsWith("http")) return url;
    return getApiUrl(url);
  }

  function handleCopyUrl(item: MediaItem) {
    const url = fullUrl(item.url);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(item.id);
      toast.success("URL copied");
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    api
      .post("/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        toast.success("Uploaded");
        fetchMedia();
      })
      .catch(() => toast.error("Upload failed"))
      .finally(() => {
        setUploading(false);
        e.target.value = "";
      });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this file from media library?")) return;
    api
      .delete(`/media/${id}`)
      .then(() => {
        setItems((prev) => prev.filter((i) => i.id !== id));
        setTotal((t) => t - 1);
        toast.success("Deleted");
      })
      .catch(() => toast.error("Delete failed"));
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Media</h1>

      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            loading={uploading}
            className="gap-2"
          >
            <Upload className="w-4 h-4" /> Upload images
          </Button>
          <p className="text-sm text-muted">
            Upload images to reuse in products. Max 10MB per file, 10 files per upload.
          </p>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <p className="text-center text-muted py-12">No media yet. Upload images above.</p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <Card key={item.id} className="p-2 overflow-hidden">
                <div className="aspect-square rounded-lg overflow-hidden bg-maroon mb-2 relative">
                  <Image
                    src={fullUrl(item.url)}
                    alt={item.filename}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 16vw"
                    unoptimized
                  />
                </div>
                <p className="text-xs text-muted truncate mb-2" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 min-w-0 p-1"
                    onClick={() => handleCopyUrl(item)}
                    title="Copy URL"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 text-red-400 hover:text-red-300"
                    onClick={() => handleDelete(item.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
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
        </>
      )}
    </div>
  );
}
