import "@/styles/globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import { Nunito } from "next/font/google";
import { auth, signOut } from "@/lib/auth";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "Cibo Libro",
  description: "A beautiful digital cookbook.",
};

export default async function RootLayout({
  children,
}: { children: React.ReactNode }) {
  const session = await auth();

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/signin" });
  }

  return (
    <html lang="en" className={`${nunito.variable}`}>
      <body className="min-h-screen text-gray-900 antialiased">
        {/* Brand gradient background + soft glow (site-wide) */}
        <div className="fixed inset-0 -z-50">
          <div className="h-full w-full bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500" />
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(700px 320px at 20% 10%, rgba(255,255,255,0.28), transparent 60%), radial-gradient(560px 260px at 82% 0%, rgba(255,255,255,0.18), transparent 60%)",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(140%_80%_at_50%_0%,rgba(0,0,0,0.12),transparent_60%)]" />
        </div>

        {/* Floating navbar */}
        <nav className="sticky top-4 z-40">
          <div className="mx-auto w-[min(1150px,95%)]">
            <div className="flex h-14 items-center gap-3 rounded-full border border-white/60 bg-white/85 px-3 sm:px-4 shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur supports-[backdrop-filter]:bg-white/65">
              <a href="/" className="flex items-center gap-2" aria-label="cibo libro home">
                <Image
                  src="/images/logo.png"
                  alt="cibo libro"
                  width={150}
                  height={36}
                  className="h-9 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                  priority
                />
              </a>

              <div className="ml-auto flex items-center gap-2 text-sm">
                {session?.user ? (
                  <>
                    <span className="hidden sm:inline text-gray-700">{session.user.email}</span>
                    <form action={doSignOut}>
                      <button className="rounded-full border border-orange-200 bg-white px-3 py-1.5 font-medium text-orange-700 shadow transition hover:-translate-y-0.5 hover:bg-orange-50">
                        Sign out
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <a
                      href="/signin"
                      className="rounded-full border border-orange-200 bg-white px-3 py-1.5 font-medium text-orange-700 shadow transition hover:-translate-y-0.5 hover:bg-orange-50"
                    >
                      Sign in
                    </a>
                    <a
                      href="/signup"
                      className="rounded-full bg-orange-600 px-3 py-1.5 font-semibold text-white shadow-[0_8px_18px_rgba(234,88,12,0.35)] transition hover:-translate-y-0.5 hover:bg-orange-700"
                    >
                      Sign up
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Page container */}
        <main className="mx-auto w-[min(1150px,95%)] py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-white/30 bg-white/10 py-8 text-white backdrop-blur">
          <div className="mx-auto w-[min(1150px,95%)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-white/85 text-orange-600 shadow">
                🍽️
              </div>
              <Image
                src="/images/logo.png"
                alt="cibo libro"
                width={140}
                height={32}
                className="h-8 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
              />
            </div>
            <nav className="flex flex-wrap gap-4 text-sm">
              <a className="hover:underline" href="/legal/content-policy">Content Policy</a>
              <a className="hover:underline" href="/legal/privacy">Privacy Policy</a>
              <a className="hover:underline" href="/support">Support</a>
              <a className="hover:underline" href="/contact">Contact</a>
            </nav>
            <div className="text-xs/6 opacity-90">
              © {new Date().getFullYear()} cibo libro. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
