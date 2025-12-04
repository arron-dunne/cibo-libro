"use client";

import { Star, MessageSquare, Heart } from "lucide-react";
import { useState } from "react";
import { submitFeedback } from "./actions";

export default function FeedbackPage() {
  const [rating, setRating] = useState<number | null>(null);

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
      <form action={submitFeedback} className="mt-10 space-y-10">
        
        {/* Rating Card */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-orange-950 mb-4 flex items-center gap-2">
            <Star className="text-orange-500 h-6 w-6" />
            Overall, how are you enjoying CiboLibro?
          </h2>

          <div className="flex gap-4 mt-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                className={`h-12 w-12 flex items-center justify-center rounded-full border transition shadow-sm text-lg font-medium
                  ${
                    rating === n
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
          <h2 className="text-2xl font-semibold text-orange-950 mb-4 flex items-center gap-2">
            <MessageSquare className="text-orange-500 h-6 w-6" />
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
          <h2 className="text-2xl font-semibold text-orange-950 mb-4">
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
          <h2 className="text-2xl font-semibold text-orange-950 mb-4 flex items-center gap-2">
            <Heart className="text-orange-500 h-6 w-6" />
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
        <div className="flex justify-center">
          <button
            type="submit"
            className="rounded-full bg-orange-600 px-8 py-3 text-lg font-semibold text-white shadow-[0_8px_18px_rgba(234,88,12,0.35)] transition hover:-translate-y-0.5 hover:bg-orange-700"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
}
