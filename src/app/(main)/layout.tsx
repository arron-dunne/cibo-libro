import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { Footer } from "@/app/components/footer/Footer";
import { DesktopNavLink } from "@/app/components/navbar/DesktopNavLink";
import { LogoutButton } from "@/app/components/navbar/LogoutButton";
import { MobileMenu } from "@/app/components/navbar/MobileMenu";
import { logout } from "@/app/actions/logout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // needed for logout and navbar email
  const session = await auth();

  return (
    <>
      {/* Floating navbar */}
      <nav className="sticky top-4 mt-6 z-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-14 gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-2 shadow backdrop-blur">
            {/* Logo */}
            <Link href="/" className="grow" aria-label="cibo libro home">
              <Image
                src="/images/logo.png"
                alt="cibo libro"
                width={150}
                height={36}
                className="h-9 w-auto drop-shadow"
                priority
              />
            </Link>

            {/* Navigation */}
            <div className="hidden gap-6 md:flex">
              <DesktopNavLink type="home" />
              <DesktopNavLink type="all" />
              <DesktopNavLink type="new" />
              <DesktopNavLink type="import" />
              <DesktopNavLink type="settings" />
            </div>

            <div className="flex grow justify-end items-center text-sm">
              <MobileMenu />

              {/* Logout */}
              {session?.user ? (
                <>
                  <span className="hidden lg:inline mr-0 lg:mr-4 text-gray-700">
                    {session.user.email}
                  </span>
                  <LogoutButton action={logout} />
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full border border-orange-200 bg-white px-3 py-1.5 font-medium text-orange-700 shadow transition hover:-translate-y-0.5 hover:bg-orange-50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-orange-600 px-3 py-1.5 font-semibold text-white shadow-[0_8px_18px_rgba(234,88,12,0.35)] transition hover:-translate-y-0.5 hover:bg-orange-700"
                  >
                    Regsiter
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page container */}
      <main className="z-0 mx-auto max-w-7xl px-8 py-4">
        {" "}
        {children}
      </main>

      <Footer />
    </>
  );
}
