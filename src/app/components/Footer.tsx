"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { TertiaryLinkButton } from "./LinkButtons";

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
        <TertiaryLinkButton className="hover:underline" href="/about" underline={false}>About</TertiaryLinkButton>
        <TertiaryLinkButton className="hover:underline" href="/support/terms" underline={false}>Terms of Use</TertiaryLinkButton>
        <TertiaryLinkButton className="hover:underline" href="/support/privacy" underline={false}>Privacy Policy</TertiaryLinkButton>
        <TertiaryLinkButton className="hover:underline" href="/support" underline={false}>Contact</TertiaryLinkButton>
        <TertiaryLinkButton className="hover:underline" href="/support" underline={false}>Support</TertiaryLinkButton>
      </nav>
      <span className="flex-1 text-end text-sm">
        © 2026 cibo libro. All rights reserved.
      </span>
    </footer>
  );
}
