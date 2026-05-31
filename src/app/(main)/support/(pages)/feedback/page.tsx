"use client";

import Link from "next/link";
import {
  Star,
  Heart,
  Bug,
  MessageCircleQuestionMark,
  CheckCircle,
  ChevronLeft,
  CircleX,
  Send,
  Home,
  Loader2,
} from "lucide-react";

import { useState, useActionState, useEffect } from "react";
import { submitFeedback } from "./actions";
import { Header } from "@/app/components/text/Headers";
import { TextArea } from "@/app/components/forms/Inputs";
import { PrimaryButton } from "@/app/components/buttons/Buttons";
import { ErrorBanner, SuccessBanner } from "../../components/Banners";

export default function FeedbackPage() {
  const [rating, setRating] = useState<number | null>(null);

  // Typed action state handling
  const initialState = { status: null, message: "" };
  const [state, formAction, isPending] = useActionState(
    submitFeedback,
    initialState,
  );

  // Scroll to top on submission
  useEffect(() => {
    if (state.status) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.status]);

  return (
    <div>
      {/* Feedback Panel */}
      {state.status === "success" && (
        <SuccessBanner text="Your feedback was submitted. Thank you." />
      )}

      {state.status === "error" && (
        <ErrorBanner text="Something went wrong. Please try again or come back later." />
      )}

      {/* Header */}
      <Header>Leave your feedback</Header>
      <p className="mt-4">
        Help us improve Cibo Libro by sharing your thoughts, frustrations, and
        ideas. Your feedback directly shapes the future of the app.
      </p>

      {/* Feedback Form */}
      <form action={formAction} className="mt-12 space-y-16">
        {/* Rating Card */}
        <div className="space-y-4">
          <div className="ml-2 flex gap-4 items-center">
            <Star
              size={28}
              className="hidden sm:block shrink-0 text-orange-600"
            />
            <h3 className="text-2xl font-semibold">
              Overall, how would you rate Cibo Libro?
            </h3>
          </div>
          <div className="flex gap-4 mt-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                disabled={isPending}
                onClick={() => setRating(n)}
                className={`h-12 w-12 flex items-center justify-center rounded-full border transition text-lg font-medium cursor-pointer
              ${
                rating === n
                  ? "bg-linear-to-br from-orange-500 to-rose-500 text-white font-semibold border-orange-600 scale-105"
                  : "bg-white text-black border-white/60 hover:brightness-95 active:brightness-75"
              }
              ${isPending ? "opacity-50 cursor-not-allowed" : ""}
              `}
              >
                {n}
              </button>
            ))}
            <input type="hidden" name="rating" value={rating ?? ""} />
          </div>
        </div>

        {/* Feature Request */}
        <div className="space-y-4">
          <div className="ml-2 flex gap-4 items-center">
            <MessageCircleQuestionMark
              size={28}
              className="hidden sm:block shrink-0 text-orange-500"
            />
            <h3 className="text-2xl font-semibold">
              What feature would you love to see next?
            </h3>
          </div>

          <TextArea
            name="featureRequest"
            placeholder="Tell us your idea…"
            disabled={isPending}
            rows={4}
          />
        </div>

        {/* Frustrations */}
        <div className="space-y-4">
          <div className="ml-2 flex gap-4 items-center">
            <Bug
              size={28}
              className="hidden sm:block shrink-0 text-orange-500"
            />
            <h3 className="text-2xl font-semibold">
              What feels confusing or frustrating?
            </h3>
          </div>
          <TextArea
            name="uiPainPoints"
            placeholder="What slowed you down, or didn’t work as expected?"
            disabled={isPending}
            rows={4}
          />
        </div>

        {/* Anything else */}
        <div className="space-y-4">
          <div className="ml-2 flex gap-4 items-center">
            <Heart
              size={28}
              className="hidden sm:block shrink-0 text-orange-500"
            />
            <h3 className="text-2xl font-semibold">
              Anything else you&apos;d like to share?
            </h3>
          </div>
          <TextArea
            name="additionalFeedback"
            placeholder="Any other thoughts?"
            disabled={isPending}
            rows={4}
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
                Submit Feedback
                <Send size={26} />
              </>
            )}
          </PrimaryButton>
      </form>
    </div>
  );
}
