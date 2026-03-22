import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cibo Libro",
  description: "A beautiful digital cookbook.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}