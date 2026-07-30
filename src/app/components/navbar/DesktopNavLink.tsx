"use client";

import Link from "next/link";
import {
  CirclePlus,
  CookingPot,
  Download,
  HomeIcon,
  Settings,
} from "lucide-react";
import { PrimaryButton, TertiaryButton } from "../buttons/Buttons";

export type NavLinkType = "home" | "all" | "new" | "import" | "settings" | "logout";

export function DesktopNavLink({ type, selected }: { type: NavLinkType, selected: boolean }) {
  
  const { label, href, icon: Icon } = useInfo(type);

  return (
    <Link href={href}>
      { selected ? 
        <PrimaryButton type="button">
          <Icon className="hidden sm:block" size={18} />
          <span className="text-xs sm:text-base">{label}</span>
        </PrimaryButton> : 
        <TertiaryButton type="button" underline={false}>
          <span className="text-xs sm:text-base">{label}</span>
        </TertiaryButton>
      }
    </Link>
  );
}

export function useInfo(type: NavLinkType) {

  switch (type) {
    case "all":
      return {
        label: "Recipes",
        href: "/all",
        icon: CookingPot,
      };
    case "new":
      return {
        label: "Add",
        href: "/add",
        icon: CirclePlus,
      };
    case "import":
      return {
        label: "Import",
        href: "/import",
        icon: Download,
      };
    case "settings":
      return {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      };
    default:
      return {
        label: "Home",
        href: "/home",
        icon: HomeIcon,
      };
  }
}
