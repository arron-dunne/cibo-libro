"use client";

import { Bug, AlertTriangle, Layers, Send, Loader2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { submitIssue } from "./actions";
import { ErrorBanner, SuccessBanner } from "../../components/Banners";
import { Header } from "@/app/components/text/Headers";
import { Input, TextArea } from "@/app/components/forms/Inputs";
import { PrimaryButton } from "@/app/components/buttons/Buttons";

export default function ReportIssuesPage() {
  const [state, formAction, isPending] = useActionState(submitIssue, {
    status: null,
  });
  const [issueCategory, setIssueCategory] = useState<string>("");

  useEffect(() => {
    if (state.status) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.status]);

  const pageOptions = [
    "Home",
    "My Cookbook",
    "View Recipe",
    "Add Recipe",
    "Edit Recipe",
    "Import",
    "Cook Mode",
    "Login / Register",
    "Image Uploads",
    "Settings",
    "Other",
    "All of the above",
  ];

  return (
    <div>
      {state.status === "success" && (
        <SuccessBanner text="Your issue was submitted." />
      )}

      {state.status === "error" && (
        <ErrorBanner text="Something went wrong. Please try again or come back later." />
      )}

      {/* Header */}
      <Header>Report an issue</Header>
      <p className="mt-4">
        Found a bug, broken feature, or something that doesn&apos;t behave as
        expected? Let us know and we&apos;ll look into it. Your reports help
        improve Cibo Libro.
      </p>

      {/* Form */}
      <form action={formAction} className="mt-12 space-y-16">
        {/* Category */}
        <div className="space-y-4">
          <div className="ml-2 flex gap-4 items-center">
            <AlertTriangle
              size={28}
              className="hidden sm:block shrink-0 text-orange-500"
            />
            <h3 className="text-2xl font-semibold">
              What type of issue is this?
            </h3>
          </div>

          <select
            name="issueCategory"
            value={issueCategory}
            onChange={(e) => setIssueCategory(e.target.value)}
            className="w-full rounded-full bg-white/70 backdrop-blur-lg border border-slate-300 px-4 py-3 text-slate-800"
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

          {issueCategory === "other" && (
            <Input
              type="text"
              name="otherCategoryDetail"
              placeholder="Please specify…"
              required
            />
          )}
        </div>

        {/* Description */}
        <div className="space-y-4">
          <div className="ml-2 flex gap-4 items-center">
            <Bug
              size={28}
              className="hidden sm:block shrink-0 text-orange-500"
            />
            <h3 className="text-2xl font-semibold">Describe the issue</h3>
          </div>
          <TextArea
            name="issueDescription"
            required
            placeholder="What happened? What did you expect to happen? Any steps to reproduce?"
            rows={5}
          />
        </div>

        {/* Pages Affected */}
        <div className="space-y-4">
          <div className="ml-2 flex gap-4 items-center">
            <Layers
              size={28}
              className="hidden sm:block shrink-0 text-orange-500"
            />
            <h3 className="text-2xl font-semibold">
              Which page(s) does this affect?
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pageOptions.map((page) => (
              <label
                key={page}
                className="flex items-center gap-3 rounded-full border border-slate-300 bg-white py-3 px-5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="affectedPages"
                  value={page}
                  className="h-4 w-4 rounded border-zinc-300 text-orange-600"
                />
                <span className="text-slate-800">{page}</span>
              </label>
            ))}
          </div>
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
              Submit Issue
              <Send size={26} />
            </>
          )}
        </PrimaryButton>
      </form>
    </div>
  );
}
