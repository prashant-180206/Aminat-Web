// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if accessing teacher routes
    if (path.startsWith("/teacher") || path.startsWith("/api/teacher")) {
      const userRole = token?.role as string;
      if (userRole !== "teacher" && userRole !== "admin") {
        return NextResponse.redirect(new URL("/learn", req.url));
      }
    }

    // Check if accessing admin routes
    if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
      const userRole = token?.role as string;
      if (userRole !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  },
);

// Configure which routes to protect
export const config = {
  matcher: [
    "/project/:path*/edit/:path*",
    "/project/:path*/record/:path*",
    "/teacher/:path*",
    "/admin/:path*",
    "/api/protected/:path*",
    "/api/projects/:path*",
    "/api/teacher/:path*",
    "/api/admin/:path*",
  ],
};
