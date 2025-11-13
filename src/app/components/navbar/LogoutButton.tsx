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
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-[26px] bg-white p-6 text-center shadow-2xl ring-1 ring-black/5 sm:p-7">
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
                  onClick={closeDialog}
                  className="w-full rounded-full border border-gray-200 px-5 py-3 text-base font-semibold text-gray-700 transition hover:bg-gray-50 active:bg-gray-100 cursor-pointer disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmLogout}
                  className="w-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-base font-semibold text-white shadow-lg transition cursor-pointer hover:brightness-95 active:brightness-75 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
