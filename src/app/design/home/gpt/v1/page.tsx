// v1/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { LogOut, PlusCircle, Globe, BookOpen } from "lucide-react";

export default function Page() {
  // Mocked data
  const user = { name: "Arron" };
  const recentRecipes = [
    { id: 1, title: "Creamy Mushroom Pasta", image: "https://images.unsplash.com/photo-1600803907087-f56d462fd26b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=927", tags: ["Dinner", "Vegetarian"] },
    { id: 2, title: "Avocado Toast Deluxe", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1772", tags: ["Breakfast"] },
    { id: 3, title: "Lemon Chicken Skewers", image: "/images/chicken-skewers.jpg", tags: ["Lunch", "Grill"] },
    { id: 4, title: "Chocolate Lava Cake", image: "/images/lava-cake.jpg", tags: ["Dessert"] },
  ];

  const [active, setActive] = useState("home");

  return (
    <main className="relative mx-auto max-w-6xl px-4 py-8 text-orange-950">
      
      {/* ─────────────── NAVBAR ─────────────── */}
      <nav className="mb-10 flex flex-wrap items-center justify-between rounded-full border border-white/80 bg-white/60 px-5 py-3 shadow-md backdrop-blur-md">
        
        <img className="h-8" src="/images/logo.png"></img>

        <div className="flex items-center gap-6 text-sm font-medium">
          {["Home", "Recipes", "Add", "Import", "Settings"].map((item) => (
            <button
              key={item}
              onClick={() => setActive(item.toLowerCase())}
              className={`transition-colors hover:text-orange-600 ${
                active === item.toLowerCase() ? "text-orange-600" : "text-orange-900/70"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600">
          <LogOut size={16} /> Logout
        </button>
      </nav>

      {/* ─────────────── WELCOME PANEL ─────────────── */}
      <section className="rounded-3xl bg-white/90 p-8 shadow-lg backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold text-orange-950 sm:text-4xl">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="mt-2 text-orange-900/80">
          Your recipes are looking delicious today — let’s cook something amazing.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <ActionButton
            icon={<PlusCircle className="h-5 w-5" />}
            color="bg-orange-500 hover:bg-orange-600"
            label="Add Recipe"
          />
          <ActionButton
            icon={<Globe className="h-5 w-5" />}
            color="bg-emerald-500 hover:bg-emerald-600"
            label="Import Recipe"
          />
          <ActionButton
            icon={<BookOpen className="h-5 w-5" />}
            color="bg-sky-500 hover:bg-sky-600"
            label="Cook Mode"
          />
        </div>
      </section>

      {/* ─────────────── RECENT RECIPES ─────────────── */}
      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-semibold text-orange-950">
          Recently Added
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recentRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-lg"
            >
              <div className="relative h-44 w-full">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-orange-950">{recipe.title}</h3>
                <div className="mt-2 flex flex-wrap gap-1">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENT: ActionButton
// ─────────────────────────────────────────────────────────────
function ActionButton({
  icon,
  color,
  label,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
}) {
  return (
    <button
      className={`${color} flex items-center gap-2 rounded-full px-4 py-2 font-medium text-white shadow-md transition`}
    >
      {icon}
      {label}
    </button>
  );
}
