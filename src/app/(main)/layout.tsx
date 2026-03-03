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
    <div className="min-h-screen flex flex-col">
      {/* Floating navbar */}
      <nav className="sticky top-4 mt-6 z-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-between h-14 gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-2 shadow backdrop-blur">
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

            {/* Logged in navbar */}
            {session?.user ? (
              <>
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
                  <span className="hidden lg:inline mr-0 lg:mr-4 text-gray-700">
                    {session.user.email}
                  </span>
                  <LogoutButton action={logout} />
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-full border border-white/70 bg-linear-to-br text-slate-900 from-slate-200 to-slate-300 px-4 py-2 font-semibold shadow hover:brightness-90 active:brightness-75"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center border border-white/70 rounded-full bg-linear-to-br from-orange-500 to-rose-500 text-white px-4 py-2 font-semibold shadow hover:brightness-90 active:brightness-75"
                >
                  Regsiter
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Page container */}
      <main className="z-0 mx-auto w-full max-w-7xl px-8 py-4 flex-1">{children}</main>

      <Footer />
    </div>
  );
}
