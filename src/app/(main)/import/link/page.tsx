// app/import/link/page.tsx
import Link from "next/link";
import { z } from "zod";
import { Suspense } from "react";
import {
  Globe,
  ExternalLink,
  Link2,
  Image as ImageIcon,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import ClientLinkCardForm from "./ClientLinkCardForm";

// Do NOT change param names or enum values; kept UPPERCASE as requested
const ParamsSchema = z.object({
  url: z.url(),
  title: z.string().min(1).max(280),
  reason: z.enum(["ROBOTS", "DENYLIST", "PAYWALL", "NO_SCHEMA", "ERROR"]).default("NO_SCHEMA"),
  image: z.url().optional().or(z.literal("")).optional(),
  siteName: z.string().optional(),
});

type ReasonKey = z.infer<typeof ParamsSchema>["reason"];

// Keep searchParams awaiting style exactly as in your app
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const parsed = ParamsSchema.safeParse({
    url: normalizeParam(params.url),
    title: normalizeParam(params.title),
    reason: normalizeParam(params.reason),
    image: normalizeParam(params.image),
    siteName: normalizeParam(params.siteName),
  });

  if (!parsed.success) {
    return (
      <div className="mx-auto w-[min(1150px,95%)]">
        <div className="mx-auto max-w-3xl">
          <div className="mt-6 rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <h1 className="text-lg font-semibold">Invalid link preview parameters</h1>
            </div>
            <p className="text-sm text-gray-700">
              Required: <code>url</code>, <code>title</code>. Optional: <code>reason</code>, <code>image</code>, <code>siteName</code>.
            </p>
            <div className="mt-4">
              <Link href="/import" className="text-sm font-semibold text-orange-600 hover:underline">
                ← Back to Import
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { url, title, reason, image, siteName } = parsed.data;
  const site = (siteName || safeHostname(url)).trim();
  const badge = reasonBadge(reason);

  return (
    <div className="mx-auto w-[min(1150px,95%)]">
      {/* Floating status panel (no page-level background here; layout provides gradient) */}
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

      {/* Two floating white panels on the gradient background */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: static preview (server-rendered) */}
        <section aria-labelledby="preview-title" className="rounded-2xl border bg-white shadow-sm">
          <header className="flex items-center justify-between border-b px-5 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="h-4 w-4" />
              <span className="truncate">{site}</span>
              <span className="text-gray-300">•</span>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-gray-700 underline decoration-gray-300 underline-offset-2 hover:text-gray-900"
              >
                View original <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-600">
              <Link2 className="h-3.5 w-3.5" />
              Link Card
            </div>
          </header>

          {/* Image / placeholder – still server-side, no remotePatterns needed */}
          <div className="relative">
            {image ? (
              <img
                src={image}
                alt={title}
                className="aspect-[16/9] w-full rounded-t-2xl object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="aspect-[16/9] w-full rounded-t-2xl bg-gradient-to-br from-orange-100 to-rose-100">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex items-center gap-3 rounded-xl border border-orange-200/60 bg-white/70 px-4 py-2 text-orange-700 shadow-sm backdrop-blur">
                    <ImageIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">No preview image available</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 px-5 py-5">
            <h2 id="preview-title" className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <p className="text-sm text-gray-500">
              This is a link preview. Full recipe remains on the original site.
            </p>
          </div>

          <footer className="border-t px-5 py-4 text-xs text-gray-500">
            We only save safe metadata and your own inputs. Full recipes from other sites aren’t copied. You’ll always have a link back to the original.
          </footer>
        </section>

        {/* Right: client-only form (no duplication of metadata in preview) */}
        <Suspense fallback={<div className="h-[560px] rounded-2xl border bg-white shadow-sm" />}>
          <ClientLinkCardForm initialUrl={url} />
        </Suspense>
      </div>
    </div>
  );
}

/* -------- utils -------- */
function normalizeParam(v: string | string[] | undefined) {
  if (!v) return undefined;
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
