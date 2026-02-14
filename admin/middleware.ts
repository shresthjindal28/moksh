import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Admin app uses the backend API (JWT in localStorage) for auth, not Supabase.
 * This middleware simply continues the request.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
