export default function LoadingRecipesGrid() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-4 md:py-6">
      {/* Skeleton filter bar */}
      <div className="sticky top-20 z-10">
        <div className="rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="p-3 md:p-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-10 w-full sm:flex-1 min-w-[240px] rounded-xl bg-zinc-200/40 animate-pulse" />
              <div className="h-10 w-40 rounded-xl bg-zinc-200/40 animate-pulse" />
              <div className="h-5 w-40 ml-auto rounded bg-zinc-200/40 animate-pulse" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 w-20 rounded-full bg-zinc-200/40 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skeleton cards with glassy effect */}
      <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i}>
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/50 bg-white/40 backdrop-blur-sm shadow-sm">
              <div className="aspect-[4/3] w-full bg-zinc-200/30 animate-pulse" />
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