import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  ChefHat,
  CookingPot,
  Import,
  PlusCircle,
  Search,
  Timer,
  UtensilsCrossed,
} from "lucide-react";
import { Footer } from "@/app/components/footer/Footer";

// ─── Static data ──────────────────────────────────────────────────────────────

const features = [
  {
    Icon: Import,
    title: "Import from anywhere",
    description:
      "Paste any URL and Cibo Libro extracts the full recipe automatically — from food blogs, YouTube, and cooking sites.",
  },
  {
    Icon: PlusCircle,
    title: "Add your own recipes",
    description:
      "Build your personal cookbook with your own creations, family recipes, and anything in between.",
  },
  {
    Icon: Search,
    title: "Find it instantly",
    description:
      "Search by name, filter by tags, and sort your entire collection. Never lose a recipe again.",
  },
  {
    Icon: CookingPot,
    title: "Cook mode",
    description:
      "A distraction-free screen walks you through every step with built-in timers and highlighted ingredients.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create a free account",
    description: "Sign up in seconds. No credit card, no catch.",
  },
  {
    number: "02",
    title: "Add your recipes",
    description: "Import from a URL or type them in yourself.",
  },
  {
    number: "03",
    title: "Cook and enjoy",
    description: "Browse, search, and cook with a beautiful guided experience.",
  },
];

const mockRecipes = [
  {
    title: "Spaghetti Carbonara",
    description: "A classic Roman pasta with eggs, pecorino, and guanciale.",
    tags: ["Italian", "Pasta"],
    gradient: "bg-linear-to-br from-amber-400 to-orange-500",
    time: "20 mins",
  },
  {
    title: "Chocolate Lava Cake",
    description: "Rich, gooey chocolate cake with a molten centre.",
    tags: ["Dessert", "Chocolate"],
    gradient: "bg-linear-to-br from-rose-400 to-pink-600",
    time: "30 mins",
  },
  {
    title: "Thai Green Curry",
    description: "Fragrant coconut curry with fresh vegetables and herbs.",
    tags: ["Thai", "Curry"],
    gradient: "bg-linear-to-br from-green-400 to-emerald-600",
    time: "40 mins",
  },
  {
    title: "Avocado Toast",
    description: "Smashed avocado on sourdough with chili flakes and lemon.",
    tags: ["Breakfast", "Quick"],
    gradient: "bg-linear-to-br from-lime-400 to-green-500",
    time: "5 mins",
  },
  {
    title: "Beef Tacos",
    description: "Spiced ground beef tacos with salsa, cheese, and fresh lime.",
    tags: ["Mexican", "Dinner"],
    gradient: "bg-linear-to-br from-orange-400 to-red-500",
    time: "25 mins",
  },
  {
    title: "Blueberry Pancakes",
    description: "Fluffy American stack loaded with fresh blueberries.",
    tags: ["Breakfast", "Sweet"],
    gradient: "bg-linear-to-br from-violet-400 to-purple-600",
    time: "20 mins",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Navbar ── */}
      <nav className="sticky top-4 mt-6 z-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center h-14 gap-2 rounded-full border border-white/80 bg-white/60 px-4 py-2 shadow backdrop-blur">
            <Link href="/landing" aria-label="Cibo Libro home">
              <Image
                src="/logo.png"
                alt="Cibo Libro"
                width={150}
                height={36}
                className="h-9 w-auto drop-shadow"
                priority
              />
            </Link>
            <div className="flex gap-2">
              <Link
                href="/login"
                className="flex items-center justify-center rounded-full border border-white/70 bg-linear-to-br from-slate-200 to-slate-300 text-slate-900 px-5 py-2 font-semibold shadow hover:brightness-90 active:brightness-75 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center rounded-full border border-white/40 bg-linear-to-br from-orange-500 to-rose-500 text-white px-5 py-2 font-semibold shadow hover:brightness-90 active:brightness-75 transition"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-7xl w-full px-4 pt-16 pb-12 md:pt-24 md:pb-20 flex flex-col items-center text-center gap-6">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full bg-white/20 border border-white/40 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
          <ChefHat size={14} />
          The digital cookbook for food lovers
        </span>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight"
          style={{ WebkitTextStroke: "4px black", paintOrder: "stroke fill" }}
        >
          Your recipes.
          <br />
          Always within reach.
        </h1>

        {/* Sub-copy */}
        <p className="max-w-xl text-lg md:text-xl text-white/90 font-medium leading-relaxed">
          Import from any website, add your own creations, and cook with a
          beautiful guided experience. Everything in one place — free.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-full bg-white text-orange-600 px-8 py-3.5 text-lg font-bold shadow-lg hover:brightness-95 active:brightness-90 transition"
          >
            Get Started Free
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/20 text-white px-8 py-3.5 text-lg font-semibold backdrop-blur-sm hover:bg-white/30 transition"
          >
            See the features
          </a>
        </div>

        {/* Hero visual placeholder */}
        <div className="mt-6 w-full max-w-4xl rounded-3xl border-2 border-dashed border-white/35 bg-white/10 backdrop-blur-sm aspect-video flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
            <BookOpen size={28} className="text-white/60" />
          </div>
          <p className="text-sm font-medium text-white/50 tracking-wide">
            [ App Screenshot / Hero Animation ]
          </p>
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap justify-center gap-6 mt-2 text-white/70 text-sm font-medium">
          <span>✓ Free forever for essentials</span>
          <span>✓ No adverts</span>
          <span>✓ Import from 100+ recipe sites</span>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="mx-auto max-w-7xl w-full px-4 py-16">
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-black text-white"
            style={{ WebkitTextStroke: "3px black", paintOrder: "stroke fill" }}
          >
            Everything you need
          </h2>
          <p className="mt-3 text-white/80 text-lg font-medium max-w-lg mx-auto">
            All the tools a food lover needs, without the subscription wall.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/70 bg-white/95 p-6 shadow-lg backdrop-blur flex flex-col gap-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-md shrink-0">
                <feature.Icon size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">{feature.title}</h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="mx-auto max-w-7xl w-full px-4 py-16">
        <div className="rounded-3xl border border-white/70 bg-white/95 p-8 md:p-12 shadow-lg backdrop-blur">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-zinc-900">
              Up and running in minutes
            </h2>
            <p className="mt-2 text-zinc-500 text-lg">
              No complicated setup. Just sign up and start cooking.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start">
            {steps.map((step, i) => (
              <Fragment key={step.number}>
                <div className="flex-1 flex flex-col items-center text-center gap-3 px-6 py-4">
                  <div className="w-16 h-16 rounded-full bg-linear-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg shrink-0">
                    <span className="text-white font-black text-lg">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900">
                    {step.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed max-w-48">
                    {step.description}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex items-center pt-8 shrink-0">
                    <div className="w-12 h-0.5 bg-linear-to-r from-orange-200 to-rose-200 rounded-full" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recipe Showcase ── */}
      <section className="mx-auto max-w-7xl w-full px-4 py-16">
        <div className="text-center mb-10">
          <h2
            className="text-4xl md:text-5xl font-black text-white"
            style={{ WebkitTextStroke: "3px black", paintOrder: "stroke fill" }}
          >
            Your cookbook, beautifully organised
          </h2>
          <p className="mt-3 text-white/80 text-lg font-medium">
            Every recipe you save looks exactly like this.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockRecipes.map((recipe) => (
            <MockRecipeCard key={recipe.title} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="mx-auto max-w-7xl w-full px-4 py-16">
        <div className="rounded-3xl border border-white/70 bg-white/95 p-10 md:p-16 shadow-xl backdrop-blur text-center">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg mx-auto mb-6">
            <UtensilsCrossed size={28} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 leading-tight">
            Ready to build your
            <br />
            <span className="bg-linear-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              dream cookbook?
            </span>
          </h2>
          <p className="mt-4 text-zinc-500 text-lg max-w-md mx-auto leading-relaxed">
            Join food lovers who never lose a recipe again. Free forever for the
            essentials — no credit card required.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-br from-orange-500 to-rose-500 text-white px-10 py-4 text-lg font-bold shadow-lg border border-white/40 hover:brightness-90 active:brightness-75 transition"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-br from-slate-200 to-slate-300 text-slate-900 px-10 py-4 text-lg font-bold shadow border border-white/70 hover:brightness-90 active:brightness-75 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ─── Mock Recipe Card ──────────────────────────────────────────────────────────

function MockRecipeCard({
  recipe,
}: {
  recipe: {
    title: string;
    description: string;
    tags: string[];
    gradient: string;
    time: string;
  };
}) {
  return (
    <article className="relative w-full flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
      {/* Coloured image stand-in */}
      <div
        className={`w-full h-48 ${recipe.gradient} flex items-end p-3`}
      >
        <div className="flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1 text-white text-xs font-medium backdrop-blur-sm">
          <Timer size={11} />
          {recipe.time}
        </div>
      </div>
      {/* Content */}
      <div className="px-4 py-4 flex flex-col gap-2">
        <h3 className="text-xl font-bold text-zinc-900 line-clamp-1">
          {recipe.title}
        </h3>
        <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-linear-to-br from-orange-100 to-rose-100 text-rose-500 border border-rose-200 px-3 py-1 text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
