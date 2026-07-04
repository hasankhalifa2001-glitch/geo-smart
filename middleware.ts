import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "some-fallback-secret-for-dev" });
    const { pathname } = req.nextUrl;

    // 1. If user is authenticated and attempts to access login or register, redirect to map calculator
    if (token && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/calculator/map", req.url));
    }

    // 2. Protect dashboard and reports routes (redirect unauthenticated users to login)
    const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/reports");
    if (!token && isProtectedRoute) {
        const signInUrl = new URL("/login", req.url);
        signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/register",
        "/dashboard/:path*",
        "/reports/:path*",
    ],
};
