import "./globals.css";
import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fredoka = Fredoka({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-fredoka" });

export const metadata: Metadata = {
  title: "Cookbook Hub",
  description: "A beautiful digital cookbook.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fredoka.variable}`}>
      {/* Body uses Inter; headings can opt into Fredoka via className="font-fun" */}
      <body className="min-h-dvh bg-white text-slate-900 antialiased">{children}</body>
    </html>
  );
}
