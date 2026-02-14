"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { clearToken } from "@/lib/auth";

export function Header() {
  const router = useRouter();

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  return (
    <header className="h-14 border-b border-border bg-maroon/50 flex items-center justify-end px-6">
      <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
        <LogOut className="w-4 h-4" /> Log out
      </Button>
    </header>
  );
}
