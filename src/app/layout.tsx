import "@/styles/globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Cibo Libro",
  description: "We’re cooking something tasty. Back soon!",
  robots: { index: true, follow: true },
  icons: {
    icon: "/icon.png",
  },
};

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-[100svh] overflow-hidden">
      <body className="h-[100svh] overflow-hidden text-slate-900 antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  );
}
