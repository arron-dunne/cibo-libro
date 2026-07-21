"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { DesktopNavLink } from "./DesktopNavLink";
import { MobileMenu } from "./MobileMenu";
import { LogoutButton } from "./LogoutButton";
import { logout } from "@/app/actions/logout";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { PrimaryButton, SecondaryButton } from "../buttons/Buttons";
import { ChefHat, Home } from "lucide-react";

export function Navbar({ session }: { session?: Session | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState<boolean>(false);

  // toggle scrolled state
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 16) setScrolled(true);
      else if (window.scrollY < 6) setScrolled(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // No navbar on cook mode
  if (/^\/cook\//.test(pathname)) {
    return <></>
  }

  return (
    <nav
      className={`w-full sticky top-0 px-8 sm:px-12 z-10 flex gap-4 items-center justify-between transition-all border-white/80 ${scrolled ? "py-3 bg-white/50 backdrop-blur-xl border-b" : "pt-8 bg-transparent"}`}
    >
      {/* Logo */}
      <Link href="/" className="w-60 grow" aria-label="cibo libro home">
        <Image
          src="/logo.png"
          alt="cibo libro"
          width={563}
          height={102}
          className={`${scrolled ? "max-w-48 sm:max-w-52" : "max-w-52 sm:max-w-56"} w-full h-auto`}
          // className={`${scrolled ? "h-9 sm:h-10" : "h-10 sm:h-12"} w-auto`}
          priority
        />
      </Link>

      {/* Show different navbar depending on page and session */}
      {pathname === "/landing" ? (
        <>
          <Link href="/login">
            <PrimaryButton type="button" className="block md:hidden shrink-0">
              <ChefHat size={20} className="-rotate-12" />
              <span>
                <span>Start</span>
                <span className="hidden sm:inline">&nbsp;Cooking</span>
              </span>
            </PrimaryButton>
          </Link>
          <div className="hidden md:flex gap-4 h-max">
            <Link href="/login">
              <SecondaryButton type="button">Login</SecondaryButton>
            </Link>
            <Link href="/register">
              <PrimaryButton type="button">Get Started</PrimaryButton>
            </Link>
          </div>
        </>
      ) : session?.user ? (
        /^\/support\//.test(pathname) ? (
          <div className="hidden lg:flex grow justify-end items-center text-sm">
            {/* Home button */}
            <span className="text-slate-800">{session.user.email}</span>
            <div className="ml-4">
              <Link href="/home">
                <PrimaryButton type="button">
                  <Home size={20} />
                  Home
                </PrimaryButton>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Navigation */}
            <div className="hidden md:flex gap-6">
              <DesktopNavLink type="home" />
              <DesktopNavLink type="all" />
              <DesktopNavLink type="new" />
              <DesktopNavLink type="import" />
              <DesktopNavLink type="settings" />
            </div>

            {/* Logout */}
            <div className="hidden lg:flex grow justify-end items-center text-sm">
              <span className="text-slate-800">{session.user.email}</span>
              <div className="ml-4">
                <LogoutButton action={logout} />
              </div>
            </div>

            <div className="block md:hidden">
              <MobileMenu />
            </div>
          </>
        )
      ) : pathname === "/register" ? (
        <>
          <span className="font-semibold text-slate-600">
            Already have an account?
          </span>
          <Link href="/login">
            <SecondaryButton type="button">Login</SecondaryButton>
          </Link>
        </>
      ) : pathname === "/login" ? (
        <div className="flex gap-2 sm:gap-4 items-center">
          <span className="font-semibold text-slate-600">New here?</span>
          <Link href="/register">
            <SecondaryButton type="button">Create Account</SecondaryButton>
          </Link>
        </div>
      ) : (
        <div className="flex gap-4 h-max">
          <Link className="hidden md:block" href="/register">
            <SecondaryButton type="button">Register</SecondaryButton>
          </Link>
          <Link href="/login">
            <PrimaryButton type="button">Login</PrimaryButton>
          </Link>
        </div>
      )}
    </nav>
  );
}
