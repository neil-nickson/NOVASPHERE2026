import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPaths = ["/dashboard", "/api/payment", "/api/registrations"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPaths.some((path) =>
    pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || (token as any).emailVerified !== true) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          error:
            token && (token as any).emailVerified !== true
              ? "Please verify your email before continuing"
              : "Unauthorized"
        },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    if (token && (token as any).emailVerified !== true) {
      loginUrl.searchParams.set("error", "verify_required");
    }
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (pathname.startsWith("/api/payment") || pathname.startsWith("/api/registrations")) {
    response.headers.set("Cache-Control", "no-store, max-age=0");
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/api/payment/:path*",
    "/api/registrations/:path*"
  ]
};

