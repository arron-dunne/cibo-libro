"use client";

import Link from "next/link";
import { useInfo, type NavLinkType } from "./DesktopNavLink";

export function MobileNavLink({ type }: { type: NavLinkType }) {

  const { label, href, icon: Icon, highlight } = useInfo(type)

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-4 font-semibold text-lg rounded-full px-4 py-3 hover:outline",
        highlight
          ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold shadow"
          : "text-orange-700 bg-white hover:outline hover:brightness-95",
      ].join(" ")}
    >
      <Icon size={24} />
      {label}
    </Link>
  );
}
