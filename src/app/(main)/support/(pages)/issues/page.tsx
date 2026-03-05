"use client";

import {
  Bug,
  AlertTriangle,
  Layers,
  CircleX,
  ChevronLeft,
  Home,
  CheckCircle,
  Send,
} from "lucide-react";
import { FormSubmitButton } from "@/app/components/forms/FormSubmitButton";
import { useActionState, useState } from "react";
import { submitIssue } from "./actions";
import Link from "next/link";

export default function ReportIssuesPage() {
  const [state, formAction] = useActionState(submitIssue, { status: null });

  const [issueCategory, setIssueCategory] = useState<string>("");

  const pageOptions = [
    "Home",
    "All Recipes",
    "View Recipe",
    "Manual Add Recipe",
    "Edit Recipe",
    "Import from URL",
    "Cook Mode",
    "Login / Register",
    "Image Uploads",
    "Settings",
    "Other",
    "All of the above",
  ];

  return (
    <div>
      {/* Feedback Panel */}
      {state.status === "success" && (
        <div className="mb-4 rounded-3xl bg-green-200/90 border border-green-800 p-8 text-green-800 shadow">
          <h2 className="text-2xl font-semibold mb-1 flex items-center gap-4">
            <CheckCircle size={28} />
            Your feedback was submitted
          </h2>
          <p className="ml-11">
            Thank you for taking the time to make Cibo Libro a better place
          </p>
          <Link
            href="/home"
            className="ml-10 mt-4 w-max text-black flex items-center gap-2 rounded-full px-4 py-2 bg-slate-200 border border-black/10 cursor-pointer hover:brightness-90 active:brightness-75"
          >
            <Home size={20} />
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
          <Link
            href="/home"
            className="ml-11 mt-2 w-max text-black flex items-center gap-2 rounded-full px-4 py-2 bg-slate-200 border border-white cursor-pointer hover:brightness-90 active:brightness-75"
          >
            <ChevronLeft />
            Home
          </Link>
          {/* {state.message ?? "Thanks for your feedback!"} */}
        </div>
      )}

      {/* Header */}
      <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-950">
          Report an Issue
        </h1>
        <p className="mt-3 text-slate-700 leading-relaxed">
          Found a bug, broken feature, or something that doesn’t behave as
          expected? Let us know and we’ll look into it. Your reports help keep
          CiboLibro reliable.
        </p>
      </section>

      {/* Form */}
      <form action={formAction} className="mt-10 space-y-10">
        {/* Category */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-orange-950 mb-4 flex items-center gap-4">
            <AlertTriangle size={28} className="text-orange-500" />
            What type of issue is this?
          </h2>

          <select
            name="issueCategory"
            value={issueCategory}
            onChange={(e) => setIssueCategory(e.target.value)}
            className="w-full rounded-2xl border border-orange-200 bg-white/80 p-4 text-slate-800 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-300"
            required
          >
            <option value="">Select a category…</option>
            <option value="bug">Bug / Something not working</option>
            <option value="ui">UI / Layout issue</option>
            <option value="performance">Slow or performance issue</option>
            <option value="incorrectData">Incorrect data / import issue</option>
            <option value="crash">Page crash / error</option>
            <option value="other">Other</option>
          </select>

          {/* Extra field when "Other" is selected */}
          {issueCategory === "other" && (
            <input
              type="text"
              name="otherCategoryDetail"
              placeholder="Please specify…"
              className="mt-4 w-full rounded-2xl border border-orange-200 bg-white/80 p-4 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-300"
              required
            />
          )}
        </section>

        {/* Description */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-orange-950 mb-4 flex items-center gap-4">
            <Bug size={28} className="text-orange-500" />
            Describe the issue
          </h2>
          <textarea
            name="issueDescription"
            required
            placeholder="What happened? What did you expect to happen? Any steps to reproduce?"
            rows={5}
            className="w-full rounded-2xl border border-orange-200 bg-white/80 p-4 text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-300"
          />
        </section>

        {/* Pages Affected */}
        <section className="rounded-3xl border border-white/70 bg-white/95 p-8 shadow-lg backdrop-blur">
          <h2 className="text-2xl font-semibold text-orange-950 mb-4 flex items-center gap-4">
            <Layers size={28} className="text-orange-500" />
            Which page(s) does this affect?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pageOptions.map((page) => (
              <label
                key={page}
                className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-white/70 p-4 cursor-pointer hover:border-orange-400 transition"
              >
                <input
                  type="checkbox"
                  name="affectedPages"
                  value={page}
                  className="h-5 w-5 rounded border-slate-300 text-orange-600 focus:ring-orange-400"
                />
                <span className="text-slate-800">{page}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Submit */}
        <FormSubmitButton pendingLabel="Submitting...">
          Submit Issue <Send size={22} />
        </FormSubmitButton>
      </form>
    </div>
  );
}
