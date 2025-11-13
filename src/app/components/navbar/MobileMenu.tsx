"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { NavLink, type NavLinkType } from "@/app/components/navbar/NavLink";

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
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-20 bg-black/40 px-4 py-6 sm:hidden"
            onClick={closeMenu}
          >
            <div
              className="mx-auto max-w-sm rounded-3xl bg-white p-5 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-orange-500 uppercase tracking-wide">
                  Menu
                </p>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={closeMenu}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:bg-gray-50 active:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {navItems.map((type) => (
                  <div key={type} onClick={closeMenu}>
                    <NavLink type={type} />
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
