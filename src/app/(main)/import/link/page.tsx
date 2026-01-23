import Link from "next/link"
import { notFound } from "next/navigation";
import { z } from "zod";
import { AlertTriangle, LinkIcon } from "lucide-react";
import { RecipeImage } from "@/app/components/recipes/RecipeImage";
import { saveLinkCard } from "./actions";
import { Tags } from "./Tags";
import { SaveButton } from "./SaveButton";


const ParamsSchema = z.object({
  url: z.url(),
  title: z.string().min(1).max(280),
  imageUrl: z.string().optional(), // accept any string for image
  siteName: z.string().optional(),
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    url?: string;
    title?: string;
    image?: string;
    siteName?: string;
  }>;
}) {
  const params = await searchParams

  const parsed = ParamsSchema.safeParse({
    url: normalizeParam(params.url),
    title: normalizeParam(params.title),
    image: normalizeParam(params.image),
    siteName: normalizeParam(params.siteName),
  });

  if (!parsed.success) {
    notFound();
  }

  const { url, title, imageUrl, siteName } = parsed.data;
  const site = (siteName || safeHostname(url)).trim();

  return (
    <div className="mx-auto max-w-3xl">
      <StatusPanel />
      {/* Preview */}
      <form action={saveLinkCard}>
        <PreviewCard title={title} url={url} imageUrl={imageUrl} />
      </form>

    </div>
  );
}


function PreviewCard({
  title,
  url,
  imageUrl
}: {
  title: string,
  url: string,
  imageUrl?: string
}) {

  return (
    <div className="relative w-92 mx-auto bg-white rounded-3xl">

      {/* Hidden inputs */}
      <input name="url" value={url} hidden readOnly />
      <input name="imageUrl" value={imageUrl} hidden readOnly />

      {/* Source */}
      <Link
        href={url}
        target="_blank"
        className="absolute top-3 right-3 px-4 py-2 flex gap-2 items-center
          bg-linear-to-r from-slate-200 to-slate-300 shadow-lg
          rounded-full text-slate-700 cursor-pointer
          hover:brightness-90 active:brightness-75"
      >
        <LinkIcon size={18} />
        <p className="text-sm">{safeHostname(url)}</p>

      </Link>

      {/* Image */}
      <div className="w-full aspect-[1.4] rounded-t-3xl overflow-hidden">
        <RecipeImage externalUrl={imageUrl} alt="Recipe picture" />
      </div>

      {/* Data */}
      <div className="p-4 flex flex-col gap-4">
        <div>
          <label htmlFor="title" className="text-sm font-semibold">Title</label>
          <input
            id="title"
            name="title"
            defaultValue={title}
            className="mt-2 border border-slate-200 rounded-2xl w-full p-2 shadow-inner text-2xl font-bold text-zinc-900"
          />
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-semibold">Description</label>
          <textarea
            id="description"
            name="description"
            rows={5}
            placeholder="Add a description for this recipe link..."
            className="mt-2 p-2 w-full rounded-2xl border border-slate-200 shadow-inner"
          />
        </div>

        <Tags />

        <SaveButton />
      </div>

    </div>
  )
}

function StatusPanel() {
  return (
    <div className="mt-2 mb-6 flex items-start gap-3 rounded-2xl border border-orange-200/70 bg-white/85 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/65">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="grow">
        <h1 className="text-lg font-semibold text-gray-900">We couldn’t import the full recipe</h1>
        <p className="mt-1 text-sm text-gray-700">
          The website’s settings or terms prevent automated imports. You can still save a{" "}
          <span className="font-medium text-gray-900">Link Card</span> with safe metadata and your own tags/notes.
        </p>
      </div>
    </div>
  )
}

// Utils
function normalizeParam(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
function safeHostname(u: string) {
  try {
    const x = new URL(u);
    return x.hostname.replace(/^www\./, "");
  } catch {
    return u;
  }
}