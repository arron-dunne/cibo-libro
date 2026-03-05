"use client";

import {
  CheckCircle,
  CircleX,
  Mail,
  MessageSquare,
  Send,
  Tag,
} from "lucide-react";
import { FormSubmitButton } from "@/app/components/forms/FormSubmitButton";
import { useActionState, useEffect } from "react";
import { submitContact } from "./actions";

export default function ContactPage() {
  const [state, formAction] = useActionState(submitContact, { status: null });

  useEffect(() => {
    if (state.status) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.status]);

  return (
    <div>
      {state.status === "success" && (
        <div className="mb-8 rounded-3xl bg-green-200/90 border border-green-500/50 p-8 text-green-900 shadow">
          <h2 className="text-xl sm:text-2xl font-semibold mb-1 flex items-center gap-4">
            <CheckCircle size={28} className="hidden sm:block shrink-0" />
            Message sent
          </h2>
          <p className="sm:ml-11 text-sm sm:text-base">
            Thanks for getting in touch — we&apos;ll get back to you as soon as we can.
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

      {/* Header */}
      <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-black">
          Get in touch
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-700 leading-relaxed">
          Have a question, a suggestion, or just want to say hello? Fill in the
          form below and we&apos;ll get back to you.
        </p>
      </section>

      {/* Form */}
      <form action={formAction} className="mt-10 space-y-10">
        {/* Subject */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-4">
            <Tag size={28} className="hidden sm:block shrink-0 text-orange-500" />
            What&apos;s this about?
          </h2>
          <input
            type="text"
            name="subject"
            required
            placeholder="e.g. Question about creating recipes"
            className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400"
          />
        </section>

        {/* Email */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-4">
            <Mail size={28} className="hidden sm:block shrink-0 text-orange-500" />
            Your email address
          </h2>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400"
          />
          <p className="mt-2 ml-2 text-sm text-slate-500">
            Optional — only needed if you&apos;d like a reply.
          </p>
        </section>

        {/* Message */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-black mb-4 flex items-center gap-4">
            <MessageSquare size={28} className="hidden sm:block shrink-0 text-orange-500" />
            Your message
          </h2>
          <textarea
            name="message"
            required
            placeholder="Tell us what's on your mind…"
            rows={6}
            className="w-full rounded-2xl border border-zinc-300 bg-white p-4 text-slate-800 placeholder:text-slate-400"
          />
        </section>

        {/* Submit */}
        <FormSubmitButton pendingLabel="Sending...">
          Send Message <Send size={22} />
        </FormSubmitButton>
      </form>
    </div>
  );
}
