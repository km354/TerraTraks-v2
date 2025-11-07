/**
 * Next.js Middleware
 * 
 * Handles authentication and request routing
 */

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow public access to auth routes
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // Protect API routes (except auth)
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
    if (!req.auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

