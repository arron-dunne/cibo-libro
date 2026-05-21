"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { LogOut, Menu, X } from "lucide-react";
import { type NavLinkType } from "./DesktopNavLink";
import { MobileNavLink } from "./MobileNavLink";
import { logout } from "@/app/actions/logout";

const navItems: NavLinkType[] = ["home", "all", "new", "import", "settings", "logout"];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 justify-center items-center cursor-pointer gap-1 rounded-full border border-white/70 bg-linear-to-r from-orange-500 to-rose-500 text-white font-bold sm:w-max sm:px-4 sm:py-2 shadow hover:brightness-90 active:brightness-75 md:hidden"
      >
        <Menu size={20} />
        <span className="hidden sm:block lg:hidden">Menu</span>
      </button>

      {isOpen && (
        <>
          {
            // black background
            typeof document !== "undefined" &&
              createPortal(
                <div className="fixed inset-x-0 top-0 bottom-0 z-8 bg-black/60 backdrop-blur-sm px-4 pb-6 sm:hidden" />,
                document.body,
              )
          }
          <div className="fixed top-16 left-0 w-full px-4">
            <div
              className="rounded-3xl bg-white p-5 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <p className="ml-4 text-xl font-medium text-orange-700 tracking-wide">
                  Menu
                </p>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={closeMenu}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-slate-200 to-slate-300 hover:brightness-90 active:brightness-75"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-2 flex flex-col">
                {navItems.map((type) => (
                  <div key={type} onClick={closeMenu}>
                    <MobileNavLink type={type} />
                  </div>
                ))}
                <form className="w-full" action={logout}>
                  <button
                    className="w-full flex items-center gap-4 font-semibold text-lg rounded-full px-4 py-3 text-orange-700 bg-white hover:brightness-95"
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
      )}
    </>
  );
}
