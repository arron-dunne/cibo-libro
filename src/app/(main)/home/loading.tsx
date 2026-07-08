import Link from "next/link";
import {
  ChevronRight,
  CookingPot,
  Import,
  LucideProps,
  PlusCircle,
  Search,
  Tag as TagIcon,
} from "lucide-react";
import { PrimaryButton } from "@/app/components/buttons/Buttons";
import { Header, SubHeader } from "@/app/components/text/Headers";

export default function Loading() {
  return (
    <>
      {/* Header */}
      <div className="mt-12 ml-2 space-y-2">
        <Header>What&apos;s cooking?</Header>
        <SubHeader>
          Browse your cookbook, add new recipes, or import them so you never
          forget the food you love to cook.
        </SubHeader>
      </div>

      {/* Main actions card */}
      <section className="w-full mt-4">
        <div className="mt-8 flex flex-wrap gap-4">
          <ActionButton
            href="/all"
            Icon={CookingPot}
            color="bg-linear-to-br from-blue-300 to-blue-500"
            header="View My Cookbook"
          />
          <ActionButton
            href="/add"
            Icon={PlusCircle}
            color="bg-linear-to-br from-amber-400 to-orange-600"
            header="Create a New Recipe"
          />
          <ActionButton
            href="/import"
            Icon={Import}
            color="bg-linear-to-br from-lime-400 to-green-600"
            header="Import a Recipe"
          />
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="mt-14 rounded-3xl border border-white/50 bg-white p-6 sm:p-8">
        <Header textSize="text-3xl">What do you feel like today?</Header>

        {/* Search Bar */}
        <SubHeader className="mt-6 ml-2 mb-4">
          <Search size={24} />
          Search your cookbook
        </SubHeader>
        <form action="/all" method="get" className="h-12 flex gap-2">
          <input
            type="text"
            name="search"
            placeholder="e.g. Spaghetti Bolognese"
            required
            className="w-full max-w-lg rounded-full border border-slate-300 bg-white px-5 font-semibold placeholder:text-slate-500"
          />
          <PrimaryButton type="submit" height="h-full">
            Search
            <ChevronRight size={20} />
          </PrimaryButton>
        </form>

        {/* Tag Cloud */}
        <SubHeader className="mt-6 ml-2 mb-4">
          <TagIcon size={24} />
          Filter by tags
        </SubHeader>
        <div className="flex flex-wrap gap-3" aria-hidden="true">
          <LoadingTag width="w-20" />
          <LoadingTag width="w-28" />
          <LoadingTag width="w-24" />
        </div>
      </section>

      {/* Recently Added */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <Header className="ml-2" textSize="text-3xl sm:text-4xl">
            Recently Added
          </Header>
          <Link href="/all?sort=created">
            <PrimaryButton type="button">
              More <ChevronRight size={16} />
            </PrimaryButton>
          </Link>
        </div>
        <div className="grid gap-6 grid-cols-2 lg:grid-cols-4" />
      </section>
    </>
  );
}

function LoadingTag({ width }: { width: string }) {
  return (
    <div
      className={`${width} h-11 animate-pulse rounded-full border border-rose-300 bg-rose-50`}
    />
  );
}

function ActionButton({
  href,
  color,
  Icon,
  header,
}: {
  href: string;
  color: string;
  Icon: React.ComponentType<LucideProps>;
  header: string;
}) {
  return (
    <Link
      href={href}
      className={`${color} flex items-center gap-3 rounded-full px-6 py-4 text-lg text-white font-bold shadow-md border border-white/60 cursor-pointer hover:brightness-95 active:brightness-75`}
    >
      <Icon size={24} />
      {header}
    </Link>
  );
}
