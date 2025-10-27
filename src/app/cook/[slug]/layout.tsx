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
      
      {/* Background */}
      <div className="fixed h-screen w-full -z-10 overscroll-none inset-0">
        <div className="absolute w-full h-full inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500" />
        <div
          aria-hidden
          className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-orange-200/35 blur-3xl pointer-events-none "
        />
      </div>

      {/* Page container */}
      <main className="mx-auto w-[min(1150px,95%)] py-4">{children}</main>
    </div>
  );
}
