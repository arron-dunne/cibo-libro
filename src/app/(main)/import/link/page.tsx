import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { Info, LinkIcon } from "lucide-react";
import { RecipeImage } from "@/app/components/recipes/RecipeImage";
import { saveLinkCard } from "./actions";
import { Tags } from "./Tags";
import { SaveButton } from "./SaveButton";
import { getHostname } from "@/lib/hostname";

const ParamsSchema = z.object({
  url: z.url(),
  title: z.string().min(1).max(280),
  imageUrl: z.string().optional(),
  description: z.string().max(600).optional(),
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    url?: string;
    title?: string;
    image?: string;
    description?: string;
  }>;
}) {
  const params = await searchParams;

  const parsed = ParamsSchema.safeParse({
    url: normalizeParam(params.url),
    title: normalizeParam(params.title),
    imageUrl: normalizeParam(params.image),
    description: normalizeParam(params.description),
  });

  if (!parsed.success) {
    notFound();
  }

  const { url, title, imageUrl, description } = parsed.data;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 md:gap-8">
      <InfoBanner />
      <PreviewCard
        title={title}
        url={url}
        imageUrl={imageUrl}
        description={description}
      />
    </div>
  );
}

function PreviewCard({
  title,
  url,
  imageUrl,
  description,
}: {
  title: string;
  url: string;
  imageUrl?: string;
  description?: string;
}) {
  return (
    <form
      action={saveLinkCard}
      className="rounded-3xl border border-white/70 bg-white/90 shadow-lg backdrop-blur overflow-hidden"
    >
      {/* Hidden inputs */}
      <input name="url" value={url} hidden readOnly />
      {imageUrl && <input name="imageUrl" value={imageUrl} hidden readOnly />}

      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative w-full md:w-2/5 shrink-0">
          <div className="h-full max-h-80 md:max-h-none aspect-auto overflow-hidden">
            <RecipeImage externalUrl={imageUrl} alt="Recipe picture" />
          </div>

          {/* Source */}
          <Link
            href={url}
            target="_blank"
            className="absolute top-3 right-3 px-4 py-2 flex gap-2 items-center
              bg-linear-to-r from-slate-200 to-slate-300 shadow-lg
              rounded-full text-slate-700 border border-white/70
              cursor-pointer hover:brightness-90 active:brightness-75"
          >
            <LinkIcon size={18} />
            <p className="text-sm">{getHostname(url)}</p>
          </Link>
        </div>

        {/* Form fields */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4">
          <div className="shrink-0">
            <label htmlFor="title" className="text-sm font-semibold">
              Title
            </label>
            <input
              id="title"
              name="title"
              defaultValue={title}
              className="mt-1 border border-zinc-300 bg-white rounded-2xl w-full p-2 text-xl sm:text-2xl font-bold text-zinc-900"
            />
          </div>

          <div className="shrink-0">
            <label htmlFor="description" className="text-sm font-semibold">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={description}
              placeholder="Add a description for this recipe link..."
              className="mt-1 p-2 w-full rounded-2xl border border-zinc-300 bg-white/95"
            />
          </div>

          <Tags />

          <SaveButton />
        </div>
      </div>
    </form>
  );
}

function InfoBanner() {
  return (
    <div className="max-w-4xl mx-auto rounded-3xl border border-white/70 bg-white/60 px-5 py-3.5 shadow backdrop-blur flex items-center gap-3">
      <Info size={24} className="text-rose-500 shrink-0" />
      <div>
        <span className="font-semibold text-gray-900">
          We couldn&apos;t import this recipe.{" "}
        </span>
        <span className="font-medium text-gray-600">
          You can still save it as a link in your cookbook.
        </span>
      </div>
    </div>
  );
}

// Utils
function normalizeParam(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
