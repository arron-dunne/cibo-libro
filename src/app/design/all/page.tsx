// app/recipes/page.tsx
import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import ClientRecipesGrid from "./ClientRecipesGrid";

export const revalidate = 0;

export default async function RecipesPage() {
  const file = await fs.readFile(path.join(process.cwd(), "public", "recipes.json"), "utf8");
  const recipes = JSON.parse(file);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-orange-400 via-orange-500 to-rose-500 text-slate-900">
      <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <ClientRecipesGrid recipes={recipes} />
      </main>

      {/* SITE FOOTER ON BACKGROUND */}
      <footer className="mt-12 border-t border-white/30 bg-white/10 py-8 text-white backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/80 text-orange-600">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <div className="font-fun text-lg font-extrabold text-white">Cookbook Hub</div>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link className="hover:underline" href="/legal/content-policy">
              Content Policy
            </Link>
            <Link className="hover:underline" href="/legal/privacy">
              Privacy Policy
            </Link>
            <Link className="hover:underline" href="/support">
              Support
            </Link>
            <Link className="hover:underline" href="/contact">
              Contact
            </Link>
          </nav>
          <div className="text-xs/6 opacity-80">
            © {new Date().getFullYear()} Cookbook Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
