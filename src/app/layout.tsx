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
        <Analytics />
        <SpeedInsights />
        { children}
      </body>
    </html>
  );
}

/* Reusable pill-like navbar link */
function NavLink({
  href,
  label,
  icon,
  highlight = false,
}: {
  href: string;
  label: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <a
      href={href}
      className={[
        "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium shadow transition",
        highlight
          ? "bg-orange-600 text-white hover:-translate-y-0.5 hover:bg-orange-700"
          : "border border-orange-200 bg-white text-orange-700 hover:-translate-y-0.5 hover:bg-orange-50",
      ].join(" ")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        aria-hidden
        width={16}
        height={16}
        src={`javascript:__navIcon('${icon}')`}
      />
      {label}
    </a>
  );
}
