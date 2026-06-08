import { NextRequest, NextResponse } from "next/server";
  import { auth } from "@/lib/auth/auth";
  
  const authPages = ["/login", "/register"];

  export default async function proxy(req: NextRequest) {
    const session = await auth();
    const isLoggedIn = Boolean(session?.user?.id);
    const isAuthPage = authPages.includes(req.nextUrl.pathname);

    // Logged-in users shouldn't see login/register — send them home
    if (isAuthPage) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL("/home", req.url));
      }
      return; // not logged in + auth page = let them through
    }

    // Everything else is a protected route
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!session.user?.id) {
      return NextResponse.redirect(new URL("/login?error=expired", req.url));
    }
  }

export const config = {
  matcher: [
    "/home/:path*",
    "/all/:path*",
    "/view/:path*",
    "/edit/:path*",
    "/add/:path*",
    "/import/:path*",
    "/settings/:path*",
    "/cook/:path*",
    "/api/:path*",
    "/login",
    "/register"
  ],
};
