import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next 16 proxy: pass-through only. Auth is via backend API (JWT), not Supabase.
 */
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
