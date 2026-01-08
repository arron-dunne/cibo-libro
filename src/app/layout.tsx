// app/layout.tsx
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";

export const metadata: Metadata = {
  title: "Cibo Libro",
  description: "A digital cookbook.",
};

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en">
      <body className={nunito.className}>
        <Analytics />
        <SpeedInsights />

        <div className="min-h-screen text-gray-900 antialiased">
          {/* Background */}
          <div className="fixed h-screen w-full -z-10 overscroll-none inset-0">
            <div aria-hidden 
              className="absolute w-full h-full inset-0 bg-linear-to-br from-orange-400 via-orange-500 to-rose-500" />
            <div aria-hidden
              className="fixed -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl pointer-events-none "/>
            <div aria-hidden 
              className="fixed inset-0 bg-gradient-to-b from-transparent to-white/10 pointer-events-none" />
          </div>

          {children}

        </div>

      </body>
    </html >
  );
}