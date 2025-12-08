"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CirclePlus, CookingPot, HomeIcon, Import, Settings } from "lucide-react";

export type NavLinkType = "home" | "all" | "new" | "import" | "settings"

export function DesktopNavLink({ type }: { type: NavLinkType }) {

  const { label, href, icon: Icon, highlight } = useInfo(type)

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-1 font-medium rounded-full transition",
        highlight
          ? "bg-linear-to-r from-orange-500 to-rose-500 text-white px-4 py-2 font-bold shadow"
          : "text-orange-700 hover:brightness-200",
      ].join(" ")}
    >
      {highlight && <Icon size={18} />}
      {label}
    </Link>
  );
}

export function useInfo(type: NavLinkType) {

  const pathname = usePathname()

  switch (type) {
    case "all":
      return { label: "Recipes", href: "/all", icon: CookingPot, highlight: pathname === "/all" || RegExp("/view/").test(pathname) };
    case "new":
      return { label: "Add", href: "/new", icon: CirclePlus, highlight: pathname === "/new" };
    case "import":
      return { label: "Import", href: "/import", icon: Import, highlight: RegExp("/import*").test(pathname) };
    case "settings":
      return { label: "Settings", href: "/settings", icon: Settings, highlight: pathname === "/settings" };
    default:
      return { label: "Home", href: "/home", icon: HomeIcon, highlight: pathname === "/home" };
  }
}
