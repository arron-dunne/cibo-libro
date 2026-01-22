import Link from "next/link"
import { notFound } from "next/navigation";
import { z } from "zod";
import { AlertTriangle, ShieldAlert, LinkIcon, Save, ArrowRight } from "lucide-react";
import { RecipeImage } from "@/app/components/recipes/RecipeImage";
import { saveLinkCard } from "./actions";
import { Tags } from "./Tags";

const Reason = ["ROBOTS", "DENYLIST", "PAYWALL", "NO_SCHEMA", "ERROR"] as const;

const ParamsSchema = z.object({
  url: z.url(),
  title: z.string().min(1).max(280),
  imageUrl: z.string().optional(), // accept any string for image
  siteName: z.string().optional(),
  reason: z.enum(Reason),
});

type ReasonKey = z.infer<typeof Reason>;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    url?: string;
    title?: string;
    image?: string;
    siteName?: string;
    reason?: string
  }>;
}) {
  const params = await searchParams

  const parsed = ParamsSchema.safeParse({
    url: normalizeParam(params.url),
    title: normalizeParam(params.title),
    reason: normalizeParam(params.reason),
    image: normalizeParam(params.image),
    siteName: normalizeParam(params.siteName),
  });

  if (!parsed.success) {
    notFound();
  }

  const { url, title, imageUrl, siteName, reason } = parsed.data;
  const site = (siteName || safeHostname(url)).trim();
  const badge = reasonBadge(reason);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Status panel */}
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
        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${badge.cls}`}>
          {badge.icon}
          {badge.label}
        </span>
      </div>

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
            rows={5}
            placeholder="Add a description for this recipe link..."
            className="mt-2 p-2 w-full rounded-2xl border border-slate-200 shadow-inner"
          />
        </div>

        <Tags />

        <button className="my-3 cursor-pointer hover:brightness-90 active:brightness-75 rounded-full flex gap-2 justify-center items-center w-full py-2 bg-linear-to-br from-orange-500 to-rose-500 text-white font-bold text-lg">
          Save 
          <ArrowRight size={20} />
        </button>
      </div>

    </div>
  )
}

/* -------- utils -------- */
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

function reasonBadge(reason: ReasonKey) {
  switch (reason) {
    case "ROBOTS":
      return { label: "site blocks robots", cls: "bg-amber-100 text-amber-800", icon: <ShieldAlert className="h-4 w-4" /> };
    case "DENYLIST":
      return { label: "site terms restrict import", cls: "bg-yellow-100 text-yellow-800", icon: <AlertTriangle className="h-4 w-4" /> };
    case "PAYWALL":
      return { label: "paywalled", cls: "bg-pink-100 text-pink-800", icon: <AlertTriangle className="h-4 w-4" /> };
    case "ERROR":
      return { label: "fetch/parsing error", cls: "bg-red-100 text-red-800", icon: <AlertTriangle className="h-4 w-4" /> };
    case "NO_SCHEMA":
    default:
      return { label: "no JSON-LD schema", cls: "bg-gray-100 text-gray-800", icon: <AlertTriangle className="h-4 w-4" /> };
  }
}