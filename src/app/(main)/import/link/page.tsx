import Link from "next/link"
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
  const params = await searchParams

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
    <div className="mx-auto max-w-3xl flex flex-col md:flex-row gap-8 mt-4">
      <StatusPanel />
      <PreviewCard title={title} url={url} imageUrl={imageUrl} description={description} />
    </div>
  );
}


function PreviewCard({
  title,
  url,
  imageUrl,
  description,
}: {
  title: string,
  url: string,
  imageUrl?: string,
  description?: string,
}) {

  return (
    <form action={saveLinkCard} className="relative max-w-92 mx-auto bg-white rounded-3xl">

      {/* Hidden inputs */}
      <input name="url" value={url} hidden readOnly />
      {imageUrl && <input name="imageUrl" value={imageUrl} hidden readOnly />}

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
            defaultValue={description}
            placeholder="Add a description for this recipe link..."
            className="mt-2 p-2 w-full rounded-2xl border border-slate-200 shadow-inner"
          />
        </div>

        <Tags />

        <SaveButton />
      </div>

    </form>
  )
}

function StatusPanel() {
  return (
    <div className="w-full h-max max-w-3xl md:max-w-92 p-4 md:p-6 rounded-3xl border border-white/90 bg-white/60 shadow flex flex-col">
      <div className="flex flex-row md:flex-col items-start gap-4">
        <div className="hidden sm:flex w-16 h-16 mx-0 md:mx-auto shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-rose-500 to-fuchsia-400 text-white">
          <Info size={30} />
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-lg sm:text-xl font-semibold text-slate-900">
            We couldn’t import a recipe from this page
          </h4>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            You can still save it as a recipe link in your cookbook.
            Customise it with a description and tags below, or quick save as it is.
          </p>
        </div>
      </div>
    </div>
  );
}

// Utils
function normalizeParam(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}
