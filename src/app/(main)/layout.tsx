import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Footer } from "@/app/components/footer/Footer";
import { NavLink } from "@/app/components/navbar/NavLink";
import { LogoutButton } from "@/app/components/navbar/LogoutButton";


export default async function Layout({ children }: { children: React.ReactNode }) {

  // needed for logout and navbar email
  const session = await auth();

  async function doSignOut() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <>
      {/* Floating navbar */}
      <nav className="sticky top-4 z-40" >
        <div className="mx-auto w-[min(1150px,95%)]">
          <div className="flex h-14 gap-2 rounded-full border border-white/80 bg-white/60 px-3 sm:px-4 py-2 shadow-sm backdrop-blur">

            {/* Logo */}
            <Link href="/" className="grow" aria-label="cibo libro home">
              <Image
                src="/images/logo.png"
                alt="cibo libro"
                width={150}
                height={36}
                className="h-9 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
                priority
              />
            </Link>

            {/* Navigation */}
            <div className="hidden gap-6 sm:flex">
              <NavLink type="home" />
              <NavLink type="all" />
              <NavLink type="new" />
              <NavLink type="import" />
              <NavLink type="settings" />
            </div>

            {/* Logout */}
            <div className="flex grow justify-end items-center gap-2 text-sm">
              {session?.user ? (
                <>
                  <span className="hidden sm:inline text-gray-700">{session.user.email}</span>
                  <LogoutButton action={doSignOut} />
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
      </nav >

      {/* Page container */}
      <main className="z-0 mx-auto w-[min(1150px,95%)] py-8 md:px-2"> {children}</main >

      <Footer />
    </>
  );
}

