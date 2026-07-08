"use client";

import {
  Loader2,
  Mail,
  MessageSquare,
  Send,
  Tag,
} from "lucide-react";
import { useActionState, useEffect } from "react";
import { submitContact } from "./actions";
import { ErrorBanner, SuccessBanner } from "../../components/Banners";
import { Header } from "@/app/components/text/Headers";
import { Input, TextArea } from "@/app/components/forms/Inputs";
import { PrimaryButton } from "@/app/components/buttons/Buttons";

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContact, {
    status: null,
  });

  useEffect(() => {
    if (state.status) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.status]);

  return (
    <div>
      {state.status === "success" && (
        <SuccessBanner text="Message sent. Thanks for getting in touch." />
      )}

      {state.status === "error" && (
        <ErrorBanner text="Please try again or come back later" />
      )}

      {/* Header */}
      <Header>
        Send us a message
      </Header>
      <p className="mt-4">
        Have a question, a suggestion, or want to get in touch? Fill in the form
        below and we&apos;ll get back to you as soon as we can.
      </p>

      {/* Form */}
      <form action={formAction} className="mt-12 space-y-16">
        {/* Subject */}
        <div className="space-y-4">
          <div className="ml-2 flex gap-4 items-center">
            <Tag
              size={28}
              className="hidden sm:block shrink-0 text-orange-500"
            />
            <h3 className="text-2xl font-semibold">Subject</h3>
          </div>
          <Input
            type="text"
            name="subject"
            required
            placeholder="What's this about?"
          />
        </div>

        {/* Email */}
        <div>
          <div className="ml-2 mb-4 flex gap-4 items-center">
            <Mail
              size={28}
              className="hidden sm:block shrink-0 text-orange-500"
            />
            <h3 className="text-2xl font-semibold">Your email address</h3>
          </div>
          <Input type="email" name="email" placeholder="you@example.com" />
          <p className="mt-1 ml-4 text-base">
            Only needed if you&apos;d like a reply.
          </p>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <div className="ml-2 flex gap-4 items-center">
            <MessageSquare
              size={28}
              className="hidden sm:block shrink-0 text-orange-500"
            />
            <h3 className="text-2xl font-semibold">Message</h3>
          </div>
          <TextArea
            name="message"
            required
            placeholder="Tell us what's on your mind…"
            rows={6}
          />
        </div>

                {/* Submit Button */}
        <PrimaryButton
          type="submit"
          className="mx-auto"
          size="lg"
          width="w-60"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 size={28} className="animate-spin" />
          ) : (
            <>
              Send Message
              <Send size={26} />
            </>
          )}
        </PrimaryButton>
      </form>
    </div>
  );
}
