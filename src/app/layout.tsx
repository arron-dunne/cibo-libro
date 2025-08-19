import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cibo Libro",
  description: "We’re cooking something tasty. Back soon!",
  robots: { index: true, follow: true },
};

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-[100svh] overflow-hidden">
      <body className="h-[100svh] overflow-hidden text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
