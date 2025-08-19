export { auth as middleware } from "@/lib/middlewareAuth";

export const config = {
  matcher: [
    // Protect these paths when not signed in
    "/recipes/:path*",
    "/api/recipes/:path*",
    "/import/:path*",
    "/api/import/:path*",
  ],
};
