"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";

const schema = z.object({
  defaultWhatsappNumber: z.string(),
  whatsappMessageTemplate: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    api
      .get<{ data: FormData }>("/settings")
      .then((res) => reset(res.data.data))
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, [reset]);

  async function onSubmit(data: FormData) {
    try {
      await api.put("/settings", data);
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground mb-6">Settings</h1>

      <Card className="max-w-xl">
        <h2 className="text-lg font-medium text-foreground mb-4">WhatsApp Integration</h2>
        <p className="text-sm text-muted mb-6">
          Default number and message template for product enquiry links. Use{" "}
          <code className="px-1 py-0.5 rounded bg-maroon text-gold">{"{productName}"}</code> in the
          template to insert the product name.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Default WhatsApp number
            </label>
            <div className="flex items-center rounded-lg border border-border bg-maroon overflow-hidden focus-within:ring-2 focus-within:ring-gold/50">
              <span className="pl-3 text-foreground text-sm font-medium shrink-0">+91</span>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                className="flex-1 h-10 px-3 bg-transparent border-0 text-foreground placeholder:text-muted focus:outline-none focus:ring-0 min-w-0"
                value={
                  (() => {
                    const v = watch("defaultWhatsappNumber") || "";
                    if (v.startsWith("91")) return v.slice(2);
                    return v;
                  })()
                }
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  setValue("defaultWhatsappNumber", digits ? "91" + digits.replace(/^91/, "") : "");
                }}
              />
            </div>
            <p className="text-xs text-muted mt-1">+91 (India) is prefixed by default.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Message template
            </label>
            <Textarea
              placeholder="Hi, I'm interested in {productName}"
              rows={3}
              {...register("whatsappMessageTemplate")}
            />
          </div>
          <Button type="submit" loading={isSubmitting}>
            Save Settings
          </Button>
        </form>
      </Card>
    </div>
  );
}
