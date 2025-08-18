import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import { auth, signOut } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "Cookbook Hub",
  description: "A beautiful digital cookbook.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/signin" });
  }

  return (
    <html lang="en" className={`${inter.variable} ${fredoka.variable}`}>
      <body className="min-h-screen text-gray-900">
        {/* --- Warm brand background --- */}
        <div className="fixed inset-0 -z-50">
          <div className="h-full w-full bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500" />
          {/* subtle glow + vignette */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(700px 320px at 20% 10%, rgba(255,255,255,0.28), transparent 60%), radial-gradient(560px 260px at 82% 0%, rgba(255,255,255,0.18), transparent 60%)",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(140%_80%_at_50%_0%,rgba(0,0,0,0.12),transparent_60%)]" />
        </div>

        {/* --- Floating nav --- */}
        <nav className="sticky top-4 z-40">
          <div className="mx-auto w-[min(1150px,95%)]">
            <div className="flex h-14 items-center gap-3 rounded-full border border-white/60 bg-white/80 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur supports-[backdrop-filter]:bg-white/65">
              <a
                href="/"
                className="grid h-9 w-9 place-items-center rounded-full bg-orange-600 text-white shadow"
                aria-label="Cookbook Hub home"
              >
                🍊
              </a>
              <span className="font-semibold tracking-tight">Cookbook Hub</span>

              <div className="ml-auto flex items-center gap-2 text-sm">
                {session?.user ? (
                  <>
                    <span className="hidden sm:inline text-gray-700">
                      {session.user.email}
                    </span>
                    <form action={doSignOut}>
                      <button className="rounded-full border border-orange-200 bg-white px-3 py-1.5 font-medium text-orange-700 shadow hover:bg-orange-50">
                        Sign out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <a
                      href="/signin"
                      className="rounded-full border border-orange-200 bg-white px-3 py-1.5 font-medium text-orange-700 shadow hover:bg-orange-50"
                    >
                      Sign in
                    </a>
                    <a
                      href="/signup"
                      className="rounded-full bg-orange-600 px-3 py-1.5 font-semibold text-white shadow-[0_8px_18px_rgba(234,88,12,0.35)] hover:bg-orange-700"
                    >
                      Sign up
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* --- Page container (kept roomy to emphasize floating cards) --- */}
        <div className="mx-auto w-[min(1150px,95%)] pb-14 pt-8">
          {children}
        </div>
      </body>
    </html>
  );
}
