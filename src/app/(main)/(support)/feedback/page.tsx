"use client";

import Link from "next/link";
import {
  Star,
  Heart,
  Bug,
  MessageCircleQuestionMark,
  LoaderCircle,
  CheckCircle,
  ChevronLeft,
  CircleX,
} from "lucide-react";

import { useState, useActionState, useEffect } from "react";
import { submitFeedback } from "./actions";

export default function FeedbackPage() {
  const [rating, setRating] = useState<number | null>(null);

  // Typed action state handling
  const initialState = { status: null, message: "" };
  const [state, formAction, isPending] = useActionState(
    submitFeedback,
    initialState
  );

  // Scroll to top on submission
  useEffect(() => {
    if (state.status) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.status]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Feedback Panel */}
      {state.status === "success" && (
        <div className="mb-4 rounded-3xl bg-green-200/90 border border-green-800 p-8 text-green-800 shadow">
          <h2 className="text-2xl font-semibold mb-1 flex items-center gap-4">
            <CheckCircle size={28} />
            Your feedback was submitted
          </h2>
          <p className="ml-11">Thank you for taking the time to make Cibo Libro a better place</p>
          <Link href="/home" className="ml-11 mt-2 w-max text-black flex items-center gap-2 rounded-full px-4 py-2 bg-slate-200 border border-white cursor-pointer hover:brightness-90 active:brightness-75">
            <ChevronLeft />
            Home
          </Link>
          {/* {state.message ?? "Thanks for your feedback!"} */}
        </div>
      )}

      {state.status === "error" && (
        <div className="mb-4 rounded-3xl bg-red-200/90 border border-red-800 p-8 text-red-800 shadow">
          <h2 className="text-2xl font-semibold mb-1 flex items-center gap-4">
            <CircleX size={28} />
            Something went wrong
          </h2>
          <p className="ml-11">Please try again or come back later</p>
          <Link href="/home" className="ml-11 mt-2 w-max text-black flex items-center gap-2 rounded-full px-4 py-2 bg-slate-200 border border-white cursor-pointer hover:brightness-90 active:brightness-75">
            <ChevronLeft />
            Home
          </Link>
          {/* {state.message ?? "Thanks for your feedback!"} */}
        </div>
      )}

      {/* Header Card */}
      <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-950">
          We’d love your feedback
        </h1>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Help us improve CiboLibro by sharing your thoughts, frustrations, and
          ideas. Your feedback directly shapes the future of the app.
        </p>
      </section>

      {/* Feedback Form */}
      <form action={formAction} className="mt-10 space-y-10">
        {/* Rating Card */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-orange-950 mb-4 flex items-center gap-4">
            <Star size={28} className="text-orange-500" />
            Overall, how are you enjoying CiboLibro?
          </h2>

          <div className="flex gap-4 mt-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                disabled={isPending}
                onClick={() => setRating(n)}
                className={`h-12 w-12 flex items-center justify-center rounded-full border transition shadow-sm text-lg font-medium
                  ${rating === n
                    ? "bg-orange-500 text-white border-orange-600 shadow-md scale-105"
                    : "bg-white/80 text-orange-900 border-orange-200 hover:border-orange-400 hover:scale-105"
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
          <h2 className="text-2xl font-semibold text-orange-950 mb-4 flex items-center gap-4">
            <MessageCircleQuestionMark size={28} className="text-orange-500" />
            What feature would you love to see next?
          </h2>

          <textarea
            name="featureRequest"
            placeholder="Tell us your idea…"
            disabled={isPending}
            rows={4}
            className="w-full rounded-2xl border border-orange-200 bg-white/80 p-4 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
          />
        </section>

        {/* UI Pain Points */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-orange-950 flex gap-4 items-center mb-4">
            <Bug size={28} className="text-orange-500" />
            What feels confusing or frustrating?
          </h2>

          <textarea
            name="uiPainPoints"
            placeholder="What slowed you down, or didn’t work as expected?"
            disabled={isPending}
            rows={4}
            className="w-full rounded-2xl border border-orange-200 bg-white/80 p-4 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
          />
        </section>

        {/* Additional Thoughts */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-orange-950 mb-4 flex items-center gap-4">
            <Heart size={28} className="text-orange-500" />
            Anything else you'd like to share?
          </h2>

          <textarea
            name="additionalFeedback"
            placeholder="Anything at all — we're listening."
            disabled={isPending}
            rows={4}
            className="w-full rounded-2xl border border-orange-200 bg-white/80 p-4 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-300 disabled:opacity-50"
          />
        </section>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-white/60 border border-white px-8 py-3 text-lg font-semibold text-slate-600 shadow-lg backdrop-blur hover:brightness-90 active:brightness-75 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin" size={20} />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
