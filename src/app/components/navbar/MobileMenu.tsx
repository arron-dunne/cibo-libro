"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { LogOut, Menu, X } from "lucide-react";
import { type NavLinkType } from "./DesktopNavLink";
import { MobileNavLink } from "./MobileNavLink";
import { logout } from "@/app/actions/logout";
import { TertiaryButton } from "../buttons/Buttons";
import Image from "next/image";

const navItems: NavLinkType[] = ["home", "all", "new", "import", "settings"];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TertiaryButton
        type="button"
        aria-label="Open navigation menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={26} />
      </TertiaryButton>

      {isOpen && (
        <>
          {typeof document !== "undefined" &&
            createPortal(<Popup setIsOpen={setIsOpen} />, document.body)}
        </>
      )}
    </>
  );
}

function Popup({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      {/* black background */}
      <div className="fixed inset-x-0 top-0 bottom-0 z-50 bg-black/60 backdrop-blur-sm px-4 pb-6 sm:hidden" />

      <div className="z-60 fixed top-6 left-0 w-full px-4">
        <div
          className="rounded-3xl bg-white p-5 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <Image
              src="/logo.png"
              alt="cibo libro"
              width={563}
              height={102}
              className="h-8 w-auto"
              priority
            />
            <TertiaryButton
              type="button"
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
            >
              <X size={26} />
            </TertiaryButton>
          </div>

          <div className="mt-6 flex flex-col">
            {navItems.map((type) => (
              <div key={type} onClick={() => setIsOpen(false)}>
                <MobileNavLink type={type} />
              </div>
            ))}
            <form className="w-full" action={logout}>
              <button
                className="w-full flex items-center gap-4 font-semibold text-lg rounded-full px-4 py-3 text-orange-700 bg-white hover:brightness-95 cursor-pointer"
                type="submit"
              >
                <LogOut size={24} />
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
