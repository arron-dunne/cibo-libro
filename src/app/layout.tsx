// app/layout.tsx
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Nunito } from "next/font/google";

export const metadata: Metadata = {
  title: "Cibo Libro",
  description: "A beautiful digital cookbook.",
};

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en" className={nunito.className}>
      <body>
        <Analytics />
        <SpeedInsights />
        { children}
      </body>
    </html>
  );
}