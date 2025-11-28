"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";

type LogoutButtonProps = {
  action: () => Promise<void>;
};

export function LogoutButton({ action }: LogoutButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // needed to avoid hydration mismatch
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => setHasMounted(true), []) // useEffect fires after mount

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = useCallback(() => {
    if (isSubmitting) return;
    setIsDialogOpen(false);
  }, [isSubmitting]);

  // close popup with escape key
  useEffect(() => {
    if (!isDialogOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDialog();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDialogOpen, closeDialog]);

  // close popup with escape key
  useEffect(() => {
    if (!isDialogOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeDialog();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDialogOpen, closeDialog]);

  const confirmLogout = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsDialogOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      {/* Button */}
      <form ref={formRef} action={action}>
        <button
          type="button"
          onClick={openDialog}
          className="hidden md:flex gap-1 justify-center items-center rounded-full bg-linear-to-r from-orange-500 to-rose-500 text-white w-10 h-10 sm:w-max sm:px-4 sm:py-2 font-bold shadow transition cursor-pointer hover:brightness-95 active:brightness-75"
        >
          <LogOut size={18} />
          <span className="block">Logout</span>
        </button>
      </form>

      {/* Dialog */}
      {hasMounted && typeof window !== "undefined" &&
        createPortal(
          <div
            className={`fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 transition duration-200 ${isDialogOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            aria-hidden={!isDialogOpen}
          >
            <div
              className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl sm:p-7"
              role="dialog"
              aria-modal="true"
              aria-labelledby="change-password-title"
              aria-describedby="change-password-description"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-rose-100 text-rose-500">
                <LogOut size={28} />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Are you sure you want to log out?</h2>
              <p className="mt-2 text-sm text-gray-500">
                You can always sign back in to keep cooking.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={confirmLogout}
                  className="w-full rounded-full bg-linear-to-r from-orange-500 to-rose-500 px-5 py-3 text-base font-semibold text-white shadow-lg transition cursor-pointer hover:brightness-95 active:brightness-75 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging out..." : "Logout"}
                </button>
                <button
                  type="button"
                  onClick={closeDialog}
                  className="w-full rounded-full border border-gray-200 px-5 py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-50 active:bg-gray-100 cursor-pointer disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </>
  );
}
