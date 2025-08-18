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
}: { children: React.ReactNode }) {
  const session = await auth();

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/signin" });
  }

  return (
    <html lang="en" className={`${inter.variable} ${fredoka.variable}`}>
      <body className="min-h-screen text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
