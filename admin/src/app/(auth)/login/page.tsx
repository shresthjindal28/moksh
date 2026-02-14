"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { setToken, getToken } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (getToken()) {
      api.get("/auth/me").then(() => router.replace("/")).catch(() => {});
    }
  }, [router]);

  async function onSubmit(data: FormData) {
    try {
      const res = await api.post<{ data: { token: string } }>("/auth/login", data);
      setToken(res.data.data.token);
      router.replace("/");
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message
        : "Login failed";
      setError("root", { message: message || "Invalid email or password" });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-deep">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gold mb-2">MOKSH Admin</h1>
        <p className="text-muted text-sm mb-6">Sign in to manage your catalogue</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <Input type="email" placeholder="admin@moksh.com" {...register("email")} />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <Input type="password" placeholder="••••••••" {...register("password")} />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>}
          </div>
          {errors.root && <p className="text-sm text-red-400">{errors.root.message}</p>}
          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  );
}
