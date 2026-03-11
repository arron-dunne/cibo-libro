import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

export default async function proxy(req: NextRequest) {
  const session = await auth();
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
  ],
};
