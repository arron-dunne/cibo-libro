"use client";

import { useState, useActionState } from "react";
import { changePassword } from "./actions";
import { KeyRound, Loader2 } from "lucide-react";
import {
  PrimaryButton,
  SecondaryButton,
} from "@/app/components/buttons/Buttons";
import { Modal } from "@/app/components/modals/Modal";
import { Input } from "@/app/components/forms/Inputs";

export default function ChangePassword() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const closeModal = () => setIsModalOpen(false);

  const [formState, formAction, isSubmitting] = useActionState(changePassword, {
    error: null,
  });

  return (
    <>
      {/* Trigger Button */}
      <SecondaryButton type="button" width="w-full" onClick={() => setIsModalOpen(true)}>
        Change Password
      </SecondaryButton>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        icon={KeyRound}
        header="Change Password"
        // subheader="Enter your current password and choose a new one."
      >
        <form action={formAction} className="mt-4 space-y-4">
          <Input
            label="Current Password"
            name="current-password"
            type="password"
            required
          />
          <Input
            label="New Password"
            name="new-password"
            type="password"
            required
            minLength={8}
          />
          <Input
            label="Confirm New Password"
            name="confirm-new-password"
            type="password"
            required
            minLength={8}
          />

          {formState.error && (
            <p className="text-sm text-red-600">{formState.error}</p>
          )}

          <PrimaryButton
            type="submit"
            disabled={isSubmitting}
            width="w-full"
            size="lg"
            className="mt-8"
          >
            {isSubmitting ? <Loader2 size={28} className="animate-spin"/> : "Update Password"}
          </PrimaryButton>
        </form>
      </Modal>
    </>
  );
}
