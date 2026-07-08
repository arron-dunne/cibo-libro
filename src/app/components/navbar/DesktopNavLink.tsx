"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CirclePlus,
  CookingPot,
  Download,
  HomeIcon,
  Settings,
} from "lucide-react";

export type NavLinkType = "home" | "all" | "new" | "import" | "settings" | "logout";

export function DesktopNavLink({ type }: { type: NavLinkType }) {
  const { label, href, icon: Icon, highlight } = useInfo(type);

  return (
    <Link
      href={href}
      className={`flex flex-col sm:flex-row items-center justify-center gap-0 sm:gap-1 font-medium rounded-full transition 
      ${
        highlight
          ? "bg-linear-to-r from-orange-500 to-rose-500 text-white px-4 py-2 font-bold shadow"
          : "text-orange-700 hover:brightness-200"
      }`}
    >
      <Icon size={18} className="block sm:hidden"/>
      {highlight && <Icon className="hidden sm:block" size={18} />}
      <span className="text-xs sm:text-base">{label}</span>
    </Link>
  );
}

export function useInfo(type: NavLinkType) {
  const pathname = usePathname();

  switch (type) {
    case "all":
      return {
        label: "Recipes",
        href: "/all",
        icon: CookingPot,
        highlight: pathname === "/all" || RegExp("/view/").test(pathname) || RegExp("/edit/").test(pathname),
      };
    case "new":
      return {
        label: "Add",
        href: "/add",
        icon: CirclePlus,
        highlight: pathname === "/add",
      };
    case "import":
      return {
        label: "Import",
        href: "/import",
        icon: Download,
        highlight: RegExp("/import*").test(pathname),
      };
    case "settings":
      return {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        highlight: pathname === "/settings",
      };
    default:
      return {
        label: "Home",
        href: "/home",
        icon: HomeIcon,
        highlight: pathname === "/home",
      };
  }
}
