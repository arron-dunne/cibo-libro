"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { Loader2, Trash2 } from "lucide-react";
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from "@/app/components/buttons/Buttons";
import { deleteRecipe } from "./actions";

type DeleteButtonProps = {
  slug: string;
  action: (formData: FormData) => Promise<void>;
  variant?: "inline" | "dropdown";
};

export function DeleteButton({
  slug,
  action,
  variant = "inline",
}: DeleteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(isSubmitting);

  // needed to avoid hydration mismatch
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  useEffect(() => setHasMounted(true), []); // useEffect fires after mount

  const openModal = () => setIsModalOpen(true);
  const closeModal = useCallback(() => {
    if (isSubmitting) return;
    setIsModalOpen(false);
  }, [isSubmitting]);

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

  async function handleClick() {
    setIsSubmitting(true);
    await deleteRecipe(slug);
    setIsSubmitting(false);
  }

  return (
    <>
      {/* Button */}
      <form className="w-full">
        <input type="hidden" readOnly name="slug" value={slug} />

        {variant === "inline" ? (
          // Desktop Navbar
          <SecondaryButton type="button" onClick={openModal}>
            <Trash2 size={20} />
            Delete
          </SecondaryButton>
        ) : (
          // Mobile dropdown
          <button
            type="button"
            onClick={openModal}
            className="w-full h-10 p-2 bg-white rounded-xl text-orange-600 cursor-pointer font-semibold flex items-center gap-2 hover:brightness-95"
          >
            <Trash2 size={20} />
            Delete
          </button>
        )}
      </form>

      {/* Dialog */}
      {hasMounted &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className={`fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 transition duration-200 ${isModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            aria-hidden={!isModalOpen}
          >
            <div
              className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-xl sm:p-7 z-110"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-recipe"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-orange-100 to-rose-100 text-rose-500">
                <Trash2 size={28} />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-800">
                Are you sure you want to delete this recipe?
              </h2>
              <p className="mt-2 text-slate-800">This action can't be undone</p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <PrimaryButton
                  type="button"
                  onClick={handleClick}
                  disabled={isSubmitting}
                  width="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      Deleting...
                      <Loader2 size={26} className="animate-spin"/>
                    </>
                  ) : (
                    "Delete"
                  )}
                </PrimaryButton>
                <SecondaryButton
                  type="button"
                  onClick={closeModal}
                  width="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  Cancel
                </SecondaryButton>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
