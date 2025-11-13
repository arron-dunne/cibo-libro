"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";

type LogoutButtonProps = {
  action: () => Promise<void>;
};

export function LogoutButton({ action }: LogoutButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => {
    if (isSubmitting) return;
    setIsDialogOpen(false);
  };

  const confirmLogout = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsDialogOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <form ref={formRef} action={action}>
        <button
          type="button"
          onClick={openDialog}
          className="flex gap-1 place-items-center rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white px-4 py-2 font-bold shadow transition cursor-pointer hover:brightness-95 active:brightness-75"
        >
          <LogOut size={16} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </form>

      {isDialogOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[10] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-gray-900">Log out?</h2>
              <p className="mt-2 text-sm text-gray-600">
                You&apos;ll be signed out of Cibo Libro and will need to log in again to
                access your recipes.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer transition hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmLogout}
                  className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white cursor-pointer shadow hover:brightness-95 active:brightness-75 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging out..." : "Log out"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
