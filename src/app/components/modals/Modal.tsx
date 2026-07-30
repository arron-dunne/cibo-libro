"use client";

import { LucideIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TertiaryButton } from "../buttons/Buttons";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  header?: string;
  subheader?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}

export function Modal({
  isOpen,
  closeModal,
  header,
  subheader,
  icon: Icon,
  // confirmAction,
  children,
}: ModalProps) {
  // set mounted with useEffect hook to avoid hydration issues
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => setHasMounted(true), []);

  // close popup with escape key
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeModal]);

  return (
    <>
      {isOpen &&
        hasMounted &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className={`fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur px-6 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            aria-hidden={!isOpen}
          >
            <div
              className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl"
              role="dialog"
              aria-modal="true"
            >
              {/* Close button */}
              <TertiaryButton
                onClick={() => closeModal()}
                className="absolute right-4 top-4"
              >
                <X size={24} />
              </TertiaryButton>

              {/* Icon */}
              {Icon && (
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-orange-100 to-rose-100 text-rose-500">
                  <Icon size={28} />
                </div>
              )}

              {/* Header */}
              {header && (
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  {header}
                </h2>
              )}

              {/* Subheader */}
              {subheader && (
                <p className="mb-4 text-sm text-gray-500">
                  Enter your current password and choose a new one.
                </p>
              )}

              {/* Modal contents */}
              {children}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
