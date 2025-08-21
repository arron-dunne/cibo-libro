// app/layout.tsx
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cibo Libro",
  description: "A beautiful digital cookbook.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en">
      <body>
        {/* <Analytics />
        <SpeedInsights /> */}
        { children}
      </body>
    </html>
  );
}