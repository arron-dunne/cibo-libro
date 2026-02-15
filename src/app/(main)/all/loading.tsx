export default function LoadingRecipesGrid() {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Top Filter/Search Bar Skeletons */}
      <div className="sticky top-20 z-10 flex items-center gap-3 md:gap-4">
        {/* Search bar */}
        <div className="flex-1 h-11 md:h-12 rounded-full bg-white/60 border border-white/70 backdrop-blur-md shadow-lg animate-pulse" />

        {/* Sort button */}
        <div className="h-11 md:h-12 w-28 sm:w-32 rounded-full bg-linear-to-r from-slate-200 to-slate-300 shadow-lg animate-pulse" />

        {/* Filter button */}
        <div className="h-11 md:h-12 w-28 sm:w-32 rounded-full bg-linear-to-r from-slate-200 to-slate-300 shadow-lg animate-pulse" />
      </div>

      {/* Recipe Card Skeletons  */}
      <ul className="px-2 mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i}>
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/50 bg-white/40 backdrop-blur-sm shadow-sm">
              {/* Image placeholder */}
              <div className="aspect-4/3 w-full bg-zinc-200/30 animate-pulse" />

              {/* Text & tags placeholder */}
              <div className="p-4 flex-1">
                <div className="h-5 w-2/3 rounded bg-zinc-200/30 animate-pulse mb-3" />
                <div className="h-4 w-full rounded bg-zinc-200/30 animate-pulse mb-2" />
                <div className="h-4 w-5/6 rounded bg-zinc-200/30 animate-pulse mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 rounded-full bg-zinc-200/30 animate-pulse" />
                  <div className="h-6 w-24 rounded-full bg-zinc-200/30 animate-pulse" />
                  <div className="h-6 w-16 rounded-full bg-zinc-200/30 animate-pulse" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
