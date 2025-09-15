import { Nunito } from "next/font/google";
import type { ReactNode } from "react";

/**
 * Cook Mode route layout
 * - Provides brand gradient background and font variable
 * - Keeps content constrained for readability
 */
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={`min-h-screen text-gray-900 antialiased ${nunito.variable}`}>
      {/* Brand gradient background + soft glow */}
      <div className="fixed inset-0 -z-50">
        <div className="h-full w-full bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500" />
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(700px 320px at 20% 10%, rgba(255,255,255,0.28), transparent 60%), radial-gradient(560px 260px at 82% 0%, rgba(255,255,255,0.18), transparent 60%)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(140%_80%_at_50%_0%,rgba(0,0,0,0.12),transparent_60%)]" />
      </div>

      {/* Page container */}
      <main className="mx-auto w-[min(1150px,95%)] py-8">{children}</main>
    </div>
  );
}
