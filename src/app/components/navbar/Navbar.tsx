"use client";

import Link from "next/link";
import Image from "next/image";
import { DesktopNavLink } from "./DesktopNavLink";
import { MobileMenu } from "./MobileMenu";
import { LogoutButton } from "./LogoutButton";
import { logout } from "@/app/actions/logout";
import { Session } from "next-auth";
import { useEffect, useState } from "react";

export function Navbar({session}: {session?: Session | null}) {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

    return (
      <nav className={`w-full sticky top-0 px-8 z-10 flex gap-4 items-center justify-between transition-all border-white/80 ${scrolled ? "py-3 bg-white/50 backdrop-blur-xl border-b" : "py-6 bg-transparent"}`}>
        {/* Logo */}
        <Link href="/" className="grow" aria-label="cibo libro home">
          <Image
            src="/logo.png"
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
      </nav>
    )
}