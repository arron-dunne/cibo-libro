"use client";

import Link from "next/link";
import { useInfo, type NavLinkType } from "./DesktopNavLink";

export function MobileNavLink({
  type,
  selected,
}: {
  type: NavLinkType;
  selected: boolean;
}) {
  const { label, href, icon: Icon } = useInfo(type);

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 font-semibold text-lg rounded-full px-4 py-3 
        ${
          selected
            ? "bg-linear-to-r from-orange-500 to-rose-500 text-white font-bold shadow"
            : "text-orange-700 bg-white hover:brightness-95"
        }`}
    >
      <Icon size={24} />
      {label}
    </Link>
  );
}
