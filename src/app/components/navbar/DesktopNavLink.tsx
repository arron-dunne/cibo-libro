"use client";

import {
  CirclePlus,
  CookingPot,
  Download,
  HomeIcon,
  Settings,
} from "lucide-react";
import { PrimaryLinkButton, TertiaryLinkButton } from "../LinkButtons";

export type NavLinkType = "home" | "all" | "new" | "import" | "settings" | "logout";

export function DesktopNavLink({ type, selected }: { type: NavLinkType, selected: boolean }) {
  
  const { label, href, icon: Icon } = useInfo(type);

  return (
    selected ?
      <PrimaryLinkButton href={href}>
        <Icon className="hidden sm:block" size={18} />
        <span className="text-xs sm:text-base">{label}</span>
      </PrimaryLinkButton> :
      <TertiaryLinkButton href={href} underline={false}>
        <span className="text-xs sm:text-base">{label}</span>
      </TertiaryLinkButton>
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
