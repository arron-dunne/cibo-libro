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
import { PrimaryLinkButton, SecondaryLinkButton } from "../LinkButtons";
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
      className={`w-full sticky top-0 px-8 sm:px-12 z-40 flex gap-4 items-center justify-between transition-all border-white/80 ${scrolled ? "py-3 bg-white/50 backdrop-blur-xl border-b" : "pt-8 bg-transparent"}`}
    >
      {/* Logo */}
      <Link href="/" className="grow" aria-label="cibo libro home">
        <Image
          src="/logo.png"
          alt="cibo libro"
          width={563}
          height={102}
          className={`${scrolled ? "max-w-48 sm:max-w-52" : "max-w-48 sm:max-w-56"} w-full h-auto`}
          priority
        />
      </Link>

      {/* Show different navbar depending on page and session */}
      {pathname === "/landing" ? (
        <>
          <PrimaryLinkButton href="/login" className="block md:hidden shrink-0">
            <ChefHat size={20} className="-rotate-12" />
            <span>
              <span>Start</span>
              <span className="hidden sm:inline">&nbsp;Cooking</span>
            </span>
          </PrimaryLinkButton>
          <div className="hidden md:flex gap-4 h-max">
            <SecondaryLinkButton href="/login">Login</SecondaryLinkButton>
            <PrimaryLinkButton href="/register">Get Started</PrimaryLinkButton>
          </div>
        </>
      ) : session?.user ? (
        /^\/support\//.test(pathname) ? (
          <div className="hidden lg:flex grow justify-end items-center text-sm">
            {/* Home button */}
            <span className="text-slate-800">{session.user.email}</span>
            <div className="ml-4">
              <PrimaryLinkButton href="/home">
                <Home size={20} />
                Home
              </PrimaryLinkButton>
            </div>
          </div>
        ) : (
          <>
            {/* Navigation */}
            <div className="hidden md:flex gap-6 items-center">
              <DesktopNavLink type="home" selected={/^\/home/.test(pathname)}/>
              <DesktopNavLink type="all" selected={/^\/(all|view|edit)/.test(pathname)}/>
              <DesktopNavLink type="new" selected={/^\/add/.test(pathname)}/>
              <DesktopNavLink type="import" selected={/^\/import/.test(pathname)}/>
              <DesktopNavLink type="settings" selected={/^\/settings/.test(pathname)}/>
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
          <span className="hidden sm:block font-semibold text-slate-600">
            Already have an account?
          </span>
          <SecondaryLinkButton href="/login">Login</SecondaryLinkButton>
        </>
      ) : pathname === "/login" ? (
        <div className="flex gap-2 sm:gap-4 items-center">
          <span className="hidden sm:block font-semibold text-slate-600">New here?</span>
          <SecondaryLinkButton href="/register">Create Account</SecondaryLinkButton>
        </div>
      ) : (
        <div className="flex gap-4 h-max">
          <SecondaryLinkButton className="hidden md:block" href="/register">Register</SecondaryLinkButton>
          <PrimaryLinkButton href="/login">Login</PrimaryLinkButton>
        </div>
      )}
    </nav>
  );
}
