function SkeletonCard() {
  return (
    <article className="relative w-full aspect-[0.7] flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white shadow-lg shadow-rose-300/50">
      <div className="skeleton w-full h-1/2 md:h-3/5" />
      <div className="px-4 py-3 h-1/2 md:h-2/5 flex flex-col justify-between">
        <div>
          <div className="skeleton h-5 rounded w-3/4" />
          <div className="hidden md:block space-y-1 mt-2">
            <div className="skeleton h-4 rounded w-full" />
            <div className="skeleton h-4 rounded w-2/3" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-6 rounded-full w-14" />
          <div className="skeleton h-6 rounded-full w-10" />
        </div>
      </div>
    </article>
  );
}

export default function AllRecipesLoading() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>

      <div className="mt-8 sm:mt-12 ml-2 sm:ml-4 space-y-4 mb-6 sm:mb-8">
        <div className="skeleton h-12 w-56 rounded-xl" />
        <div className="skeleton h-6 w-full max-w-lg rounded-lg" />
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="h-11 sm:h-12 flex items-center gap-2 md:gap-4">
          <div className="skeleton flex-1 h-full rounded-full" />
          <div className="skeleton w-11 sm:w-22 md:w-32 h-full rounded-full" />
          <div className="skeleton w-11 sm:w-22 md:w-32 h-full rounded-full" />
        </div>

        <ul className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i}>
              <SkeletonCard />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
