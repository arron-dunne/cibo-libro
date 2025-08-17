"use client";

import Image from "next/image";
import { useState } from "react";
import { Circle, CheckCircle } from "lucide-react";

export default function ClientRecipe() {
  const [checked, setChecked] = useState<string[]>([]);
  const toggle = (i: string) =>
    setChecked((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const ingredients = [
    "200g spaghetti",
    "2 cloves garlic",
    "400g canned tomatoes",
    "2 tbsp olive oil",
    "Fresh basil leaves",
    "Salt & pepper",
  ];

  const steps = [
    "Boil pasta until al dente.",
    "Sauté garlic in olive oil.",
    "Add tomatoes, simmer & season.",
    "Toss spaghetti with sauce.",
    "Top with basil & serve.",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
      {/* Navbar */}
      <nav className="flex justify-between px-6 py-4 bg-orange-500 text-white font-bold">
        <div>🍝 Cookbook Hub</div>
        <div className="space-x-6">
          <a href="#" className="hover:underline">Recipes</a>
          <a href="#" className="hover:underline">Collections</a>
          <a href="#" className="hover:underline">About</a>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative h-72">
        <Image
          src="https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e"
          alt="Dish"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-orange-600/40 flex items-center justify-center">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-md">
            Spaghetti al Pomodoro
          </h1>
        </div>
      </div>

      {/* At-a-glance */}
      <div className="grid grid-cols-2 md:grid-cols-4 text-center bg-yellow-200 py-4 font-semibold">
        <p>Prep: 10m</p>
        <p>Cook: 20m</p>
        <p>Total: 30m</p>
        <p>Servings: 2</p>
      </div>

      {/* Ingredients block */}
      <section className="p-6 bg-orange-100">
        <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
        <div className="space-y-2">
          {ingredients.map((i) => (
            <div key={i} className="flex items-center space-x-2 cursor-pointer" onClick={() => toggle(i)}>
              {checked.includes(i) ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <Circle className="text-gray-400" />
              )}
              <span className={checked.includes(i) ? "line-through text-gray-500" : ""}>{i}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Steps block */}
      <section className="p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">Steps</h2>
        <ol className="space-y-4">
          {steps.map((s, idx) => (
            <li key={idx} className="flex items-start space-x-4">
              <span className="bg-orange-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                {idx + 1}
              </span>
              <p>{s}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
