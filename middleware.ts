// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: "/auth/signin",
  },
});

// Configure which routes to protect
export const config = {
  matcher: [
    "/project/:path*/edit/:path*",
    "/project/:path*/record/:path*",
    "/api/protected/:path*",
    "/api/projects/:path*",
  ],
};
