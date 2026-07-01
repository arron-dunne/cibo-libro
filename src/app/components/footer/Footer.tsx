"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {

  const pathname = usePathname();

  // No footer on cook mode
  if (/^\/cook\//.test(pathname)) {
    return <></>
  }
  
  return (
    <footer className="mt-12 sm:mt-18 border-t border-white/80 bg-white/50 px-12 py-4 text-slate-600 backdrop-blur-xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex-1">
          <Image
            src="/icon.png"
            alt="icon"
            width={50}
            height={50}
            className="hidden sm:block"
          />
        </div>
        <nav className="flex justify-center flex-wrap gap-4 text-orange-700 font-semibold">
          {/* <Link className="hover:underline" href="/about">
            About
          </Link> */}
          <Link className="hover:underline" href="/about">
            About
          </Link>
          <Link className="hover:underline" href="/support/terms">
            Terms of Use
          </Link>
          <Link className="hover:underline" href="/support/privacy">
            Privacy Policy
          </Link>
          <Link className="hover:underline" href="/support">
            Contact
          </Link>
          <Link className="hover:underline" href="/support">
            Support
          </Link>
        </nav>
        <div className="text-sm flex-1 flex justify-end">
          © 2026 cibo libro. All rights reserved.
        </div>
    </footer>
  );
}
