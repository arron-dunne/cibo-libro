import type { ReactNode } from "react";

/**
 * Cook Mode route layout
 * - Provides brand gradient background and font variable
 * - Keeps content constrained for readability
 */

export default function Layout({ children }: { children: ReactNode }) {
  return (
      <main className="mx-auto w-[min(1150px,95%)] py-4">{children}</main>
  );
}
