// app/(main)/import/page.tsx
import Link from "next/link";
import { importRecipe } from "./actions"; // we'll implement next

export const dynamic = "force-dynamic";

export default function ImportPage() {
    console.log('db_url', process.env.DATABASE_URL)
  return (
    <div className="relative">
      {/* White floating panel */}
      <div className="mx-auto max-w-2xl rounded-2xl bg-white/95 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Import a recipe
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Paste a link to a recipe. If we can read the important bits, we’ll
            save them to your cookbook. If not, we’ll keep a handy card that
            links back to the original page.
          </p>
        </header>

        {/* Form */}
        <form action={importRecipe} className="space-y-4">
          {/* Honeypot (simple bot trap) */}
          <div aria-hidden="true" className="hidden">
            <label>
              Leave this empty:
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div>
            <label htmlFor="url" className="mb-1 block text-sm font-medium text-gray-800">
              Recipe URL
            </label>
            <input
              id="url"
              name="url"
              type="url"
              required
              inputMode="url"
              placeholder="https://example.com/best-lasagne"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-[15px] outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              pattern="https?://.+"
              maxLength={2000}
            />
            <p className="mt-1 text-xs text-gray-500">
              Tip: Use a direct recipe page (not a homepage).
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(234,88,12,0.35)] transition hover:-translate-y-0.5 hover:bg-orange-700"
            >
              Import
            </button>
            <Link
              href="/recipes"
              className="text-sm font-medium text-orange-800 underline-offset-4 hover:underline"
            >
              Back to recipes
            </Link>
          </div>

          {/* Friendly compliance note (non-technical) */}
          <div className="mt-4 rounded-xl bg-orange-50 p-3 text-xs text-orange-900">
            <strong className="font-semibold">Heads up:</strong> Imported
            content stays <span className="font-semibold">private to you</span>.
            We always include a <span className="font-semibold">“View original”</span>{" "}
            link to support creators. When a site doesn’t allow copying, we’ll
            just save the link.
          </div>
        </form>

        {/* Small FAQ-ish help */}
        <section className="mt-6 space-y-2 text-sm text-gray-600">
          <p className="font-medium text-gray-800">What you’ll see</p>
          <ul className="list-inside list-disc">
            <li>If the site plays nice, the recipe is saved into your cookbook.</li>
            <li>Otherwise you’ll get a neat card with the title, picture, and a link.</li>
            <li>You can rename and tag it anytime.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
