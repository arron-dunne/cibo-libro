"use client";

import { Star, MessageSquare, Heart, Bug, MessageCircleQuestionMark, Inbox } from "lucide-react";
import { useState } from "react";
import { submitFeedback } from "./actions";
import { useToast } from "@/app/components/toast/ToastContext";

export default function FeedbackPage() {
  const [rating, setRating] = useState<number | null>(null);

  const { addToast } = useToast();

  const handleSubmit = async (fd: FormData) => {

    // Simulate API call
    try {
      // await fetch("/api/feedback", { method: "POST" });
      addToast({
        message: "Thanks for the feedback!",
        type: "success",
        duration: 5000,
        // onReturnHome: () => router.push("/"),
      });
    } catch {
      addToast({
        message: "Something went wrong.",
        type: "error",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header Card */}
      <section className="mt-8 rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-950">
          We’d love your feedback
        </h1>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Help us improve CiboLibro by sharing your thoughts, frustrations, and
          ideas. Your feedback directly shapes the future of the app.
        </p>
      </section>

      {/* Feedback Form */}
      {/* <form action={submitFeedback} className="mt-10 space-y-10"> */}
      <form action={handleSubmit} className="mt-10 space-y-10">

        {/* Rating Card */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-orange-950 mb-6 flex items-center gap-4">
            <Star size={32} className="text-orange-500" />
            Overall, how are you enjoying CiboLibro?
          </h2>

          <div className="flex gap-4 mt-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                className={`h-12 w-12 flex items-center justify-center rounded-full border transition shadow-sm text-lg font-medium
                  ${rating === n
                    ? "bg-orange-500 text-white border-orange-600 shadow-md scale-105"
                    : "bg-white/80 text-orange-900 border-orange-200 hover:border-orange-400 hover:scale-105"
                  }`}
              >
                {n}
              </button>
            ))}
          </div>

          <input type="hidden" name="rating" value={rating ?? ""} />
        </section>

        {/* Feature Request */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-orange-950 mb-6 flex items-center gap-4">
            <MessageCircleQuestionMark size={32} className="text-orange-500" />
            What feature would you love to see next?
          </h2>

          <textarea
            name="featureRequest"
            placeholder="Tell us your idea…"
            rows={4}
            className="w-full rounded-2xl border border-orange-200 bg-white/80 p-4 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-300"
          />
        </section>

        {/* UI Pain Points */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-orange-950 mb-6 flex items-center gap-4">
            <Bug size={32} className="text-orange-500" />
            What feels confusing or frustrating?
          </h2>
          <textarea
            name="uiPainPoints"
            placeholder="What slowed you down, or didn’t work as expected?"
            rows={4}
            className="w-full rounded-2xl border border-orange-200 bg-white/80 p-4 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-300"
          />
        </section>

        {/* Additional Thoughts */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-orange-950 mb-6 flex items-center gap-4">
            <Heart size={32} className="text-orange-500" />
            Anything else you'd like to share?
          </h2>
          <textarea
            name="additionalFeedback"
            placeholder="Anything at all — we're listening."
            rows={4}
            className="w-full rounded-2xl border border-orange-200 bg-white/80 p-4 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-300"
          />
        </section>

        {/* Submit Button */}
        <div className="mt-10 flex justify-center">
          <button
            type="submit"
            className="w-full max-w-md rounded-full border border-white/80 bg-linear-to-br from-orange-200 to-rose-300 font-semibold text-2xl text-slate-900
               py-4 shadow cursor-pointer
               transition hover:brightness-90 active:brightness-75"
          >
            Submit Feedback
          </button>
        </div>

        {/* Submit Button */}
        {/* <div className="mt-10 max-w-md mx-auto rounded-3xl border border-white/60 bg-white/95 p-4 shadow-lg backdrop-blur">
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold text-lg py-4 shadow-md transition 
               hover:brightness-90 active:brightness-75"
          >
            Submit Feedback
          </button>
        </div> */}

        {/* Submit Button */}
        {/* <div className="mt-10 flex justify-center">
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-blue-500 to-sky-400 text-white font-semibold text-lg 
               px-10 py-4 shadow backdrop-blur-sm
               transition hover:brightness-90 active:brightness-75"
          >
            Submit Feedback
          </button>
        </div> */}

        {/* Submit Button */}
        {/* <div className="mt-10 flex justify-center">
          <button
            type="submit"
            className="rounded-full border border-white/70 text-slate-700 bg-gradient-to-r from-slate-200 to-slate-300 font-semibold text-lg 
               px-10 py-4 shadow
               transition hover:brightness-90 active:brightness-75"
          >
            Submit Feedback
          </button>
        </div> */}

        {/* Submit Button */}
        {/* <div className="mt-10 flex justify-center">
          <button
            type="submit"
            className="rounded-full border border-white/80 text-slate-700 bg-white/60 backdrop-blur-md font-semibold text-lg 
               px-10 py-4 shadow
               transition hover:brightness-90 active:brightness-75"
          >
            Submit Feedback
          </button>
        </div> */}
      </form>
    </div>
  );
}
