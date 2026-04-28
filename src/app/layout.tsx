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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <Analytics />
        <SpeedInsights />

        <div className="min-h-screen antialiased">
          {/* Background */}
          <div className="fixed h-full w-full -z-10 overscroll-none inset-0 bg-[#FFEEE3]">
          </div>

          {children}
        </div>
      </body>
    </html>
  );
}
