import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";
import { auth, signOut } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fredoka = Fredoka({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-fredoka" });

export const metadata: Metadata = {
  title: "Cookbook Hub",
  description: "A beautiful digital cookbook.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/signin" });
  }

  return (
    <html lang="en" className={`${inter.variable} ${fredoka.variable}`}>
      <body className="min-h-screen bg-white text-gray-900">
        <header className="border-b">
          <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
            <a href="/" className="font-semibold">Cookbook</a>
            <nav className="flex items-center gap-3 text-sm">
              {session?.user ? (
                <>
                  <span className="hidden sm:inline">{session.user.email}</span>
                  <form action={doSignOut}>
                    <button className="rounded-md border px-3 py-1.5">Sign out</button>
                  </form>
                </>
              ) : (
                <>
                  <a href="/signin" className="rounded-md border px-3 py-1.5">Sign in</a>
                  <a href="/signup" className="rounded-md bg-black text-white px-3 py-1.5">Sign up</a>
                </>
              )}
            </nav>
          </div>
        </header>
        <div className="mx-auto max-w-5xl px-4 py-6">{children}</div>
      </body>
    </html>
  );
}
