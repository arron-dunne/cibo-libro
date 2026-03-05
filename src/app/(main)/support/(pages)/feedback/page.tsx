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
} from "lucide-react";
import { FormSubmitButton } from "@/app/components/forms/FormSubmitButton";

import { useState, useActionState, useEffect } from "react";
import { submitFeedback } from "./actions";

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
        <div className="mb-8 rounded-3xl bg-green-200/90 border border-green-500/50 p-8 text-green-900 shadow">
          <h2 className="text-xl sm:text-2xl font-semibold mb-1 flex items-center gap-4">
            <CheckCircle size={28} className="hidden sm:block shrink-0" />
            Your feedback was submitted
          </h2>
          <p className="sm:ml-11 text-sm sm:text-base">
            Thank you for taking the time to make Cibo Libro a better place
          </p>
        </div>
      )}

      {state.status === "error" && (
        <div className="mb-8 rounded-3xl bg-red-200/90 border border-red-500/50 p-8 text-red-800 shadow">
          <h2 className="text-xl sm:text-2xl font-semibold mb-1 flex items-center gap-4">
            <CircleX size={28} className="hidden sm:block shrink-0" />
            Something went wrong
          </h2>
          <p className="sm:ml-11 text-sm sm:text-base">Please try again or come back later</p>
        </div>
      )}

      {/* Header Card */}
      <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-black">
          We’d love your feedback
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed">
          Help us improve CiboLibro by sharing your thoughts, frustrations, and
          ideas. Your feedback directly shapes the future of the app.
        </p>
      </section>

      {/* Feedback Form */}
      <form action={formAction} className="mt-10 space-y-10">
        {/* Rating Card */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-4">
            <Star size={28} className="hidden sm:block shrink-0 text-orange-500" />
            Overall, how are you enjoying CiboLibro?
          </h2>

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
                      : "bg-white text-slate-700 border-zinc-300 hover:brightness-95 active:brightness-75"
                  }
                  ${isPending ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {n}
              </button>
            ))}
          </div>

          <input type="hidden" name="rating" value={rating ?? ""} />
        </section>

        {/* Feature Request */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-4">
            <MessageCircleQuestionMark size={28} className="hidden sm:block shrink-0 text-orange-500" />
            What feature would you love to see next?
          </h2>

          <textarea
            name="featureRequest"
            placeholder="Tell us your idea…"
            disabled={isPending}
            rows={4}
            className="w-full rounded-2xl border border-zinc-300 bg-white p-4 text-slate-800 placeholder:text-slate-400 disabled:opacity-50"
          />
        </section>

        {/* UI Pain Points */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-black flex gap-4 items-center mb-4">
            <Bug size={28} className="hidden sm:block shrink-0 text-orange-500" />
            What feels confusing or frustrating?
          </h2>

          <textarea
            name="uiPainPoints"
            placeholder="What slowed you down, or didn’t work as expected?"
            disabled={isPending}
            rows={4}
            className="w-full rounded-2xl border border-zinc-300 bg-white p-4 text-slate-800 placeholder:text-slate-400 disabled:opacity-50"
          />
        </section>

        {/* Additional Thoughts */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-4">
            <Heart size={28} className="hidden sm:block shrink-0 text-orange-500" />
            Anything else you&apos;d like to share?
          </h2>

          <textarea
            name="additionalFeedback"
            placeholder="Anything at all — we're listening."
            disabled={isPending}
            rows={4}
            className="w-full rounded-2xl border border-zinc-300 bg-white p-4 text-slate-800 placeholder:text-slate-400 disabled:opacity-50"
          />
        </section>

        {/* Submit Button */}
        <FormSubmitButton pendingLabel="Submitting...">
          Submit Feedback <Send size={22} />
        </FormSubmitButton>
      </form>
    </div>
  );
}
