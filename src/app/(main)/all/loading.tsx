import { Header, SubHeader } from "@/app/components/text/Headers";
import {
  Search,
  ArrowUpDown,
  ChevronDown,
  Funnel,
} from "lucide-react";

function SkeletonCard() {
  return (
    <article className="relative w-full aspect-[0.7] flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white shadow-lg shadow-rose-300/50">
      <div className="bg-[var(--skeleton)] animate-pulse w-full h-1/2 md:h-3/5" />
      <div className="px-4 py-3 h-1/2 md:h-2/5 flex flex-col justify-between">
        <div>
          <div className="bg-[var(--skeleton)] animate-pulse h-5 rounded w-3/4" />
          <div className="hidden md:block space-y-1 mt-2">
            <div className="bg-[var(--skeleton)] animate-pulse h-4 rounded w-full" />
            <div className="bg-[var(--skeleton)] animate-pulse h-4 rounded w-2/3" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="bg-[var(--skeleton)] animate-pulse h-6 rounded-full w-14" />
          <div className="bg-[var(--skeleton)] animate-pulse h-6 rounded-full w-10" />
        </div>
      </div>
    </article>
  );
}

export default function AllRecipesLoading() {
  return (
    <>
      <div className="mt-8 sm:mt-12 ml-2 sm:ml-4 space-y-4 mb-6 sm:mb-8">
        <Header>
          Your Cookbook
        </Header>
        <SubHeader>
          Browse your recipes, search by title, or filter by tag. Click a recipe to see full details.
        </SubHeader>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="h-11 sm:h-12 flex items-center gap-2 md:gap-4">
          <div className="relative h-full flex-1">
            <div className="w-full h-full rounded-full bg-white pl-12 pr-4 border border-slate-300 flex items-center text-slate-400 text-base">
              Search recipes…
            </div>
            <Search
              size={20}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>

          <div className="h-full sm:w-22 md:w-32 flex no-wrap justify-center items-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-rose-500 text-white font-bold px-4 py-2 text-md">
            <ArrowUpDown className="block sm:hidden" size={18} />
            <span className="hidden sm:block grow text-center">Sort</span>
            <ChevronDown className="hidden sm:block" size={22} />
          </div>

          <div className="h-full sm:w-22 md:w-32 flex no-wrap justify-center items-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-rose-500 text-white font-bold px-4 py-2 text-md">
            <Funnel className="block sm:hidden" size={18} />
            <span className="hidden sm:block grow text-center">Filter</span>
            <ChevronDown className="hidden sm:block" size={22} />
          </div>
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
