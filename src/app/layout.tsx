import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter, Fredoka } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "Cibo Libro — Coming Soon",
  description: "We’re cooking something tasty. Back soon!",
  robots: { index: true, follow: true },
};

export default function ComingSoonLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fredoka.variable} h-[100svh] overflow-hidden`}>
      <body className="h-[100svh] overflow-hidden text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
