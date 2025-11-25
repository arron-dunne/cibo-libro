"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";

type DeleteButtonProps = {
  slug: string,
  action: (formData: FormData) => Promise<void>;
};

export function DeleteButton({ slug, action }: DeleteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // needed to avoid hydration mismatch
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => setHasMounted(true), []) // useEffect fires after mount

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
  };

  // close modal with escape key
  useEffect(() => {
    if (!isModalOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, closeModal]);

  const confirmDelete = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsModalOpen(false);
    formRef.current?.requestSubmit();
  };

  return (
    <>
      {/* Button */}
      <form ref={formRef} action={action}>
        <input type="hidden" name="slug" value={slug} />
        <button
          type="button"
          onClick={openModal}
          className="flex gap-2 justify-center items-center rounded-full bg-linear-to-r from-red-500 to-red-600 border border-white/70 text-white px-4 py-2 shadow transition cursor-pointer hover:brightness-95 active:brightness-75"
        >
          <Trash2 size={18} />
          <span>Delete</span>
        </button>
      </form>

      {/* Dialog */}
      {hasMounted && typeof window !== "undefined" &&
        createPortal(
          <div
            className={`fixed inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 transition duration-200 ${isModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            aria-hidden={!isModalOpen}
          >
            <div
              className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl sm:p-7"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-recipe"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-rose-100 text-rose-500">
                <Trash2 size={28} />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Are you sure you want to delete this recipe?</h2>
              <p className="mt-2 text-sm text-gray-500">
                This action can't be undone.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 text-base font-semibold text-white shadow-lg transition cursor-pointer hover:brightness-95 active:brightness-75 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2 sm:text-sm"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
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
