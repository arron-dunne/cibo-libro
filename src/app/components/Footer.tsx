"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TertiaryButton } from "./buttons/Buttons";

export function Footer() {
  const pathname = usePathname();

  // No footer on cook mode
  if (/^\/cook\//.test(pathname)) {
    return null;
  }

  return (
    <footer className="mt-12 border-t border-white/80 bg-white/50 px-12 py-4 text-slate-600 backdrop-blur-xl flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex-1">
        <Image
          src="/icon.png"
          alt="Icon"
          width={91}
          height={102}
          className="hidden md:block w-8"
        />
      </div>
      <nav className="flex justify-center flex-wrap gap-4 md:gap-8 text-orange-700 font-semibold">
        <Link className="hover:underline" href="/about">
          <TertiaryButton underline={false} >About</TertiaryButton>
        </Link>
        <Link className="hover:underline" href="/support/terms">
          <TertiaryButton underline={false} >Terms of Use</TertiaryButton>
        </Link>
        <Link className="hover:underline" href="/support/privacy">
          <TertiaryButton underline={false} >Privacy Policy</TertiaryButton>
        </Link>
        <Link className="hover:underline" href="/support">
          <TertiaryButton underline={false} >Contact</TertiaryButton>
        </Link>
        <Link className="hover:underline" href="/support">
          <TertiaryButton underline={false} >Support</TertiaryButton>
        </Link>
      </nav>
      <span className="flex-1 text-end text-sm">
        © 2026 cibo libro. All rights reserved.
      </span>
    </footer>
  );
}
