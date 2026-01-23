export default function Loading() {
  return (
    <div className="max-w-4xl w-full mx-auto animate-pulse">
      {/* Main import card */}
      <div className="mt-8 p-6 sm:p-8 rounded-3xl border border-white/70 bg-white/60 shadow">
        {/* Header skeleton */}
        <div className="mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6 md:mb-8">
          {/* Icon */}
          <div className="hidden sm:block w-20 h-18 rounded-3xl bg-white/60" />

          {/* Title + subtitle */}
          <div className="w-full text-center sm:text-start space-y-3">
            <div className="h-8 w-64 max-w-full mx-auto sm:mx-0 rounded-md bg-white/60" />
            <div className="h-4 w-80 max-w-full mx-auto sm:mx-0 rounded-md bg-white/60" />
          </div>
        </div>

        {/* URL input skeleton */}
        <div className="space-y-4">
          <div className="h-14 w-full rounded-full bg-white/60" />
        </div>
      </div>

      {/* Info cards */}
      <div className="mt-16 flex flex-col md:flex-row gap-8 md:gap-4">
        <SkeletonInfoCard />
        <SkeletonInfoCard />
        <SkeletonInfoCard />
      </div>
    </div>
  );
}

function SkeletonInfoCard() {
  return (
    <div className="w-full max-w-lg mx-auto md:w-1/3 p-4 rounded-3xl border border-white/80 bg-white/60 shadow flex gap-4">
      {/* Text */}
      <div className="flex-1 space-y-2">
        <div className="h-5 w-40 rounded-md bg-white/60" />
        <div className="h-4 w-full rounded-md bg-white/60" />
        <div className="h-4 w-5/6 rounded-md bg-white/60" />
      </div>
    </div>
  );
}
