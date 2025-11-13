"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { type NavLinkType } from "./DesktopNavLink";
import { MobileNavLink } from "./MobileNavLink";

const navItems: NavLinkType[] = ["home", "all", "new", "import", "settings"];

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 justify-center items-center cursor-pointer gap-1 rounded-full border border-orange bg-white/70 backdrop-blur-md text-orange-600 sm:w-max sm:px-4 sm:py-2 font-bold shadow transition hover:bg-orange-50 active:bg-orange-100 md:hidden"
      >
        <Menu size={20} />
        <span className="hidden sm:block md:hidden">Menu</span>
      </button>

      {isOpen &&
        <>
          {
            // black background
            typeof document !== "undefined" &&
            createPortal(
              <div className="fixed inset-x-0 top-0 bottom-0 z-8 bg-black/60 px-4 pb-6 sm:hidden" />,
              document.body
            )
          }
          <div className="fixed top-13 left-0 w-full px-4">
            <div
              className="rounded-b-3xl bg-white p-5 shadow-2xl"
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
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-linear-to-br from-slate-200 to-slate-300 transition hover:bg-gray-50 active:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-2 flex flex-col">
                {navItems.map((type) => (
                  <div key={type} onClick={closeMenu}>
                    <MobileNavLink type={type}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      }
    </>
  );
}
