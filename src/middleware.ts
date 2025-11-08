/**
 * Next.js Middleware
 * 
 * Handles authentication and request routing
 */

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Public routes - allow access without authentication
  const publicRoutes = ["/", "/pricing", "/auth/signin", "/auth/error"];
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/api/auth");

  // Protected routes - require authentication
  const protectedRoutes = ["/dashboard", "/new-itinerary", "/itinerary"];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Allow public routes and auth routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protect routes that require authentication
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Protect API routes (except auth)
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth")) {
    if (!isAuthenticated) {
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

