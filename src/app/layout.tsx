import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { auth } from "@/lib/auth/auth";
import "@/styles/globals.css";
import { nunito } from "@/app/fonts";
import { Footer } from "@/app/components/Footer";
import { Navbar } from "@/app/components/navbar/Navbar";

export const metadata: Metadata = {
  title: "Cibo Libro",
  description: "A digital cookbook.",
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={nunito.className}>
        <Analytics />
        <SpeedInsights />

        <div className="min-h-screen antialiased flex flex-col">
          {/* Background */}
          <div className="fixed h-full w-full -z-100 overscroll-none inset-0 bg-linear-to-br from-orange-50 via-orange-100 to-rose-200">
          </div>

          <Navbar session={session}/>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
