import Link from "next/link";

export default function NotFound() {
  return (
    <div className="rounded-3xl border border-white/40 bg-white/90 p-8 text-center shadow-xl">
      <h1 className="text-2xl font-bold">Recipe not found</h1>
      <p className="mt-2 text-gray-600">We couldn’t find that recipe, or you don’t have access.</p>
      <div className="mt-6">
        <Link
          href="/recipes"
          className="rounded-full bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
        >
          Back to your library
        </Link>
      </div>
    </div>
  );
}
