// app/(main)/import/page.tsx
import Link from "next/link";
import { importRecipe, createLinkOnlyRecipe } from "./actions";
import { SubmitButton } from "./SubmitButton";

export const dynamic = "force-dynamic";

export default async function ImportPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;
  const prompt = params?.prompt === "1";
  const url = typeof params?.u === "string" ? params.u : "";
  const preTitle = typeof params?.t === "string" ? params.t : "";
  const domain = url ? safeDomain(url) : null;
  const image = typeof params?.i === "string" ? params.i : "";
  const reason = typeof params?.reason === "string" ? params.reason : undefined;

  if (prompt && url) {
    return <PromptPanel url={url} preTitle={preTitle} domain={domain} image={image} reason={reason} />;
  }

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
            <SubmitButton />
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

function safeDomain(u?: string | null) {
  try { return new URL(u || "").hostname.replace(/^www\./, ""); } catch { return null; }
}

function PromptPanel({
  url,
  preTitle,
  domain,
  image,
  reason,
}: {
  url: string;
  preTitle?: string | null;
  domain: string | null;
  image?: string | null;
  reason?: string | undefined;
}) {
  const message = {
    ROBOTS_BLOCKED: "This site doesn’t allow importing. You can still save the link or add it manually.",
    DENYLISTED: "We don’t copy from this site, but you can save a link card or add a manual recipe.",
    PAYWALLED: "We don’t copy from this site, but you can save a link card or add a manual recipe.",
    NO_SCHEMA: "We couldn’t find recipe details to import. You can still save a link or add it manually.",
    NOT_RECIPE: "That doesn’t look like a recipe page. You can save it as a link or discard.",
  }[reason ?? "NO_SCHEMA"];

  return (
    <div className="mx-auto max-w-3xl">
      {/* Floating white panel */}
      <div className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
        <header className="mb-5">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Save this link?</h1>
          <p className="mt-1 text-sm text-zinc-600">{message}</p>
        </header>

        {/* Two columns: preview + form */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Preview card */}
          <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="relative aspect-[4/3] w-full bg-zinc-100">
              {image ? (
                <img
                  src={normalizeUrl(image) ?? PLACEHOLDER}
                  alt={preTitle || "Link cover"}
                  className="absolute inset-0 h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <img src={PLACEHOLDER} alt="" className="absolute inset-0 h-full w-full object-cover" />
              )}
            </div>
            <div className="p-4">
              <h3 className="line-clamp-2 text-lg font-semibold text-zinc-900">
                {preTitle || "Untitled link"}
              </h3>
              <div className="mt-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 1 0 7 7l3-3a5 5 0 0 0-7-7l-1 1" />
                    <path d="M14 11a5 5 0 0 0-7 7l3 3a5 5 0 0 0 7-7" />
                  </svg>
                  {domain ?? "source"}
                </span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-orange-700 underline underline-offset-2"
                >
                  Open original
                </a>
              </div>
            </div>
          </article>

          {/* Actions form */}
          <div className="flex flex-col">
            <form action={createLinkOnlyRecipe} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <input type="hidden" name="url" value={url} />
              <input type="hidden" name="image" value={image ?? ""} />

              <label className="mb-1 block text-sm font-medium text-zinc-800">Title</label>
              <input
                name="title"
                defaultValue={preTitle || ""}
                placeholder="Spring Veg Stew With Cheddar Dumplings"
                className="mb-3 w-full rounded-xl border border-zinc-300 px-3 py-2 text-[15px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />

              <label className="mb-1 block text-sm font-medium text-zinc-800">Tags (optional)</label>
              <input
                name="tags"
                placeholder="Dinner, Vegetarian, Easy"
                className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-[15px] outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  Save link card
                </button>

                <Link
                  href={`/recipes/new?title=${encodeURIComponent(preTitle || "")}&sourceUrl=${encodeURIComponent(url)}`}
                  className="rounded-full border border-orange-300 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-800"
                >
                  Manual add
                </Link>

                <Link
                  href="/import"
                  className="rounded-full border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-zinc-700"
                >
                  Discard
                </Link>
              </div>
            </form>

            <p className="mt-3 text-xs text-zinc-500">
              We couldn’t import the details this time, but saving the link keeps it handy in your cookbook.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'><rect width='4' height='3' fill='#f3f4f6'/></svg>`
  );

function normalizeUrl(src?: string | null): string | null {
  if (!src) return null;
  let s = src.trim();
  if (!s) return null;
  if (s.startsWith("//")) s = "https:" + s;
  try {
    const u = new URL(s);
    if (!/^https?:$/i.test(u.protocol)) return null;
    return u.toString();
  } catch {
    return null;
  }
}


